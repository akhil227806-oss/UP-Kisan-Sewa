import asyncio
import json
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

LOCAL_DB_FILE = Path(__file__).parent / "local_storage.json"
URI = "mongodb+srv://upkisansewa_db_user:D7tmfnRAIHbVjjze@upkisanapp.1oqhzzi.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "up_kisan_sewa"

async def sync():
    print(f"Connecting to Online MongoDB Atlas: {DB_NAME}...")
    client = AsyncIOMotorClient(URI, serverSelectionTimeoutMS=10000)
    db = client[DB_NAME]
    ping = await db.command("ping")
    print("✓ Atlas Ping successful:", ping)

    if not LOCAL_DB_FILE.exists():
        print("local_storage.json not found!")
        return

    with open(LOCAL_DB_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    for coll_name, docs in data.items():
        if not docs:
            continue
        coll = db[coll_name]
        for d in docs:
            doc_copy = dict(d)
            # Remove any string _id if invalid or use id
            q = {}
            if "id" in doc_copy:
                q = {"id": doc_copy["id"]}
            elif "email" in doc_copy:
                q = {"email": doc_copy["email"]}
            elif "phone" in doc_copy:
                q = {"phone": doc_copy["phone"]}
            elif "name" in doc_copy:
                q = {"name": doc_copy["name"]}
            else:
                q = {"_id": doc_copy.get("_id")}

            if "_id" in doc_copy and isinstance(doc_copy["_id"], str) and len(doc_copy["_id"]) != 24:
                del doc_copy["_id"]

            await coll.update_one(q, {"$set": doc_copy}, upsert=True)

        c = await coll.count_documents({})
        print(f"  ✓ {coll_name}: {c} records synced to online MongoDB Atlas")

    colls = await db.list_collection_names()
    print(f"\nAll online Atlas collections ({len(colls)}):", colls)
    client.close()

if __name__ == "__main__":
    asyncio.run(sync())
