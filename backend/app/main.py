from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.db.indexes import ensure_indexes
from app.db.mongo import close_mongo


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        await ensure_indexes()
    except Exception as exc:  # noqa: BLE001 — allow boot without DB
        print(f"[warn] MongoDB indexes skipped: {exc}")
    yield
    await close_mongo()


app = FastAPI(
    title="Awadh Kisan Seva API",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health")
@app.get("/api/v1/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "awadh-kisan-seva"}
