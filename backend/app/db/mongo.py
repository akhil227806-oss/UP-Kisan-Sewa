"""Resilient Hybrid MongoDB Engine for Awadh Kisan Sewa.
Connects directly to Online MongoDB Atlas with automatic fallback and local backup persistence.
"""

import asyncio
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import certifi

from app.core.config import settings

LOCAL_DB_FILE = Path(__file__).parent / "local_storage.json"


def _json_serial(obj: Any):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, ObjectId):
        return str(obj)
    return str(obj)


class LocalCollectionCursor:
    def __init__(self, docs: list[dict[str, Any]]):
        self._docs = docs
        self._idx = 0
        self._limit_val: int | None = None
        self._skip_val: int = 0
        self._sort_key: str | None = None
        self._sort_dir: int = 1

    def sort(self, key_or_list: Any, direction: int = 1):
        if isinstance(key_or_list, list):
            if key_or_list:
                self._sort_key = key_or_list[0][0]
                self._sort_dir = key_or_list[0][1]
        else:
            self._sort_key = key_or_list
            self._sort_dir = direction
        return self

    def skip(self, n: int):
        self._skip_val = n
        return self

    def limit(self, n: int):
        self._limit_val = n
        return self

    def _get_items(self) -> list[dict[str, Any]]:
        items = list(self._docs)
        if self._sort_key:
            items.sort(
                key=lambda x: str(x.get(self._sort_key, "")),
                reverse=(self._sort_dir == -1),
            )
        if self._skip_val:
            items = items[self._skip_val:]
        if self._limit_val is not None:
            items = items[:self._limit_val]
        return items

    def __aiter__(self):
        self._items = self._get_items()
        self._idx = 0
        return self

    async def __anext__(self):
        if self._idx < len(self._items):
            item = self._items[self._idx]
            self._idx += 1
            return item
        raise StopAsyncIteration

    async def to_list(self, length: int | None = None) -> list[dict[str, Any]]:
        items = self._get_items()
        if length is not None:
            return items[:length]
        return items


class LocalCollection:
    def __init__(self, db_store: dict[str, list[dict[str, Any]]], name: str, save_fn: Any):
        self._store = db_store
        self._name = name
        self._save = save_fn
        if name not in self._store:
            self._store[name] = []

    def _docs(self) -> list[dict[str, Any]]:
        return self._store.get(self._name, [])

    def _match(self, doc: dict[str, Any], query: dict[str, Any]) -> bool:
        for k, v in query.items():
            if k == "$or":
                sub_queries = v
                if not any(all(doc.get(sk) == sv for sk, sv in sq.items()) for sq in sub_queries):
                    return False
                continue
            if k == "_id":
                if str(doc.get("_id", "")) != str(v):
                    return False
                continue
            val = doc.get(k)
            if isinstance(v, dict):
                for op, op_val in v.items():
                    if op == "$in" and val not in op_val:
                        return False
                    if op == "$ne" and val == op_val:
                        return False
                    if op == "$regex":
                        pattern = re.compile(op_val, re.IGNORECASE)
                        if not pattern.search(str(val or "")):
                            return False
                continue
            if val != v:
                return False
        return True

    async def find_one(self, query: dict[str, Any] | None = None, *args, **kwargs) -> dict[str, Any] | None:
        q = query or {}
        for d in self._docs():
            if self._match(d, q):
                return dict(d)
        return None

    def find(self, query: dict[str, Any] | None = None, *args, **kwargs) -> LocalCollectionCursor:
        q = query or {}
        matches = [dict(d) for d in self._docs() if self._match(d, q)]
        return LocalCollectionCursor(matches)

    async def insert_one(self, doc: dict[str, Any]) -> Any:
        d = dict(doc)
        if "_id" not in d:
            d["_id"] = str(ObjectId())
        self._store[self._name].append(d)
        self._save()
        class InsertResult:
            inserted_id = d["_id"]
        return InsertResult()

    async def update_one(self, query: dict[str, Any], update: dict[str, Any], upsert: bool = False) -> Any:
        matched = 0
        modified = 0
        for d in self._docs():
            if self._match(d, query):
                matched = 1
                if "$set" in update:
                    for k, v in update["$set"].items():
                        d[k] = v
                    modified = 1
                self._save()
                break
        if matched == 0 and upsert:
            new_doc = dict(query)
            if "$set" in update:
                new_doc.update(update["$set"])
            if "_id" not in new_doc:
                new_doc["_id"] = str(ObjectId())
            self._store[self._name].append(new_doc)
            self._save()
            modified = 1
        class UpdateResult:
            matched_count = matched
            modified_count = modified
        return UpdateResult()

    async def delete_one(self, query: dict[str, Any]) -> Any:
        docs = self._docs()
        for idx, d in enumerate(docs):
            if self._match(d, query):
                del docs[idx]
                self._save()
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
        class EmptyDelete:
            deleted_count = 0
        return EmptyDelete()

    async def delete_many(self, query: dict[str, Any]) -> Any:
        docs = self._docs()
        initial = len(docs)
        self._store[self._name] = [d for d in docs if not self._match(d, query)]
        deleted = initial - len(self._store[self._name])
        if deleted > 0:
            self._save()
        class DeleteResult:
            deleted_count = deleted
        return DeleteResult()

    async def count_documents(self, query: dict[str, Any] | None = None) -> int:
        q = query or {}
        return sum(1 for d in self._docs() if self._match(d, q))

    async def create_index(self, *args, **kwargs):
        pass


class LocalDatabase:
    def __init__(self):
        self._store: dict[str, list[dict[str, Any]]] = {}
        self._load()

    def _load(self):
        if LOCAL_DB_FILE.exists():
            try:
                with open(LOCAL_DB_FILE, "r", encoding="utf-8") as f:
                    self._store = json.load(f)
            except Exception:
                self._store = {}
        else:
            self._store = {}

    def _save(self):
        try:
            with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
                json.dump(self._store, f, indent=2, default=_json_serial)
        except Exception as e:
            print("[LOCAL DB SAVE ERROR]", e)

    def __getitem__(self, name: str) -> LocalCollection:
        return LocalCollection(self._store, name, self._save)

    def __getattr__(self, name: str) -> LocalCollection:
        return self[name]


# Initialize Local Persistence
_local_db = LocalDatabase()

# Initialize Online MongoDB Atlas Engine
_atlas_client: AsyncIOMotorClient | None = None
_atlas_db: AsyncIOMotorDatabase | None = None


def _get_atlas_db() -> AsyncIOMotorDatabase | None:
    global _atlas_client, _atlas_db
    if _atlas_db is not None:
        return _atlas_db

    uri = settings.mongodb_uri
    if not uri or "mongodb" not in uri:
        return None

    try:
        _atlas_client = AsyncIOMotorClient(
            uri,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            tlsCAFile=certifi.where(),
        )
        _atlas_db = _atlas_client[settings.mongodb_db]
        return _atlas_db
    except Exception as e:
        print(f"[warn] MongoDB Atlas connection init failed: {e}")
        return None


class ResilientCollection:
    """Delegates to Online MongoDB Atlas with seamless local persistence and fallback."""

    def __init__(self, name: str):
        self._name = name
        self._local = _local_db[name]

    @property
    def _atlas(self):
        db = _get_atlas_db()
        return db[self._name] if db is not None else None

    async def find_one(self, *args, **kwargs):
        atlas = self._atlas
        if atlas is not None:
            try:
                res = await atlas.find_one(*args, **kwargs)
                if res is not None:
                    return res
            except Exception as e:
                print(f"[warn] Atlas find_one fallback for {self._name}: {e}")
        return await self._local.find_one(*args, **kwargs)

    def find(self, *args, **kwargs):
        atlas = self._atlas
        if atlas is not None:
            try:
                return atlas.find(*args, **kwargs)
            except Exception as e:
                print(f"[warn] Atlas find fallback for {self._name}: {e}")
        return self._local.find(*args, **kwargs)

    async def insert_one(self, doc: dict[str, Any], *args, **kwargs):
        atlas = self._atlas
        local_res = await self._local.insert_one(doc)
        if atlas is not None:
            try:
                clean_doc = dict(doc)
                if "_id" in clean_doc and isinstance(clean_doc["_id"], str) and len(clean_doc["_id"]) != 24:
                    del clean_doc["_id"]
                atlas_res = await atlas.insert_one(clean_doc, *args, **kwargs)
                return atlas_res
            except Exception as e:
                print(f"[warn] Atlas insert_one fallback for {self._name}: {e}")
        return local_res

    async def update_one(self, query: dict[str, Any], update: dict[str, Any], *args, **kwargs):
        atlas = self._atlas
        local_res = await self._local.update_one(query, update, *args, **kwargs)
        if atlas is not None:
            try:
                atlas_res = await atlas.update_one(query, update, *args, **kwargs)
                return atlas_res
            except Exception as e:
                print(f"[warn] Atlas update_one fallback for {self._name}: {e}")
        return local_res

    async def delete_one(self, query: dict[str, Any], *args, **kwargs):
        atlas = self._atlas
        local_res = await self._local.delete_one(query)
        if atlas is not None:
            try:
                return await atlas.delete_one(query, *args, **kwargs)
            except Exception as e:
                print(f"[warn] Atlas delete_one fallback for {self._name}: {e}")
        return local_res

    async def delete_many(self, query: dict[str, Any], *args, **kwargs):
        atlas = self._atlas
        local_res = await self._local.delete_many(query)
        if atlas is not None:
            try:
                return await atlas.delete_many(query, *args, **kwargs)
            except Exception as e:
                print(f"[warn] Atlas delete_many fallback for {self._name}: {e}")
        return local_res

    async def count_documents(self, *args, **kwargs):
        atlas = self._atlas
        if atlas is not None:
            try:
                return await atlas.count_documents(*args, **kwargs)
            except Exception as e:
                print(f"[warn] Atlas count_documents fallback for {self._name}: {e}")
        return await self._local.count_documents(*args, **kwargs)

    async def create_index(self, *args, **kwargs):
        atlas = self._atlas
        if atlas is not None:
            try:
                return await atlas.create_index(*args, **kwargs)
            except Exception:
                pass


class ResilientDatabase:
    def __getitem__(self, name: str) -> ResilientCollection:
        return ResilientCollection(name)

    def __getattr__(self, name: str) -> ResilientCollection:
        return self[name]


_engine = ResilientDatabase()


def get_db() -> ResilientDatabase:
    """Return unified online MongoDB database with auto-fallback."""
    return _engine


async def close_mongo() -> None:
    global _atlas_client, _atlas_db
    if _atlas_client is not None:
        _atlas_client.close()
        _atlas_client = None
        _atlas_db = None
