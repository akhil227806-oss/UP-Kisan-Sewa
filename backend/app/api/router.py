from fastapi import APIRouter

from app.api.v1 import public_content, auth, locations, farmers, admin, chatbot

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(public_content.router)
api_router.include_router(auth.router)
api_router.include_router(locations.router)
api_router.include_router(farmers.router)
api_router.include_router(admin.router)
api_router.include_router(chatbot.router)
