"""Farmer Profile & Settings API."""

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.v1.auth import get_current_user
from app.db.mongo import get_db

router = APIRouter(prefix="/farmers", tags=["farmers"])


class FarmerProfileUpdateIn(BaseModel):
    full_name: str | None = Field(None, min_length=2, max_length=100)
    phone: str | None = Field(None, pattern=r"^[6-9]\d{9}$")
    district: str | None = None
    tehsil: str | None = None
    block: str | None = None
    village: str | None = None
    post_office: str | None = None
    pincode: str | None = Field(None, min_length=6, max_length=6)


@router.get("/me")
async def get_my_farmer_profile(current_user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    """Retrieve full profile details for the logged-in farmer."""
    return {
        "id": str(current_user["_id"]),
        "full_name": current_user.get("full_name"),
        "email": current_user.get("email"),
        "phone": current_user.get("phone"),
        "role": current_user.get("role", "farmer"),
        "status": current_user.get("status", "active"),
        "email_verified": current_user.get("email_verified", True),
        "state": current_user.get("state", "Uttar Pradesh"),
        "division": current_user.get("division"),
        "district": current_user.get("district"),
        "tehsil": current_user.get("tehsil"),
        "block": current_user.get("block"),
        "village": current_user.get("village"),
        "post_office": current_user.get("post_office"),
        "pincode": current_user.get("pincode"),
        "created_at": str(current_user.get("created_at", "")),
        "last_login": str(current_user.get("last_login", ""))
    }


@router.patch("/me")
async def update_my_farmer_profile(
    payload: FarmerProfileUpdateIn,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> dict[str, Any]:
    """Update farmer profile location and contact details."""
    db = get_db()
    update_data: dict[str, Any] = {}
    
    if payload.full_name is not None:
        update_data["full_name"] = payload.full_name.strip()
    if payload.phone is not None:
        update_data["phone"] = payload.phone.strip()
    if payload.district is not None:
        update_data["district"] = payload.district.strip()
    if payload.tehsil is not None:
        update_data["tehsil"] = payload.tehsil.strip()
    if payload.block is not None:
        update_data["block"] = payload.block.strip()
    if payload.village is not None:
        update_data["village"] = payload.village.strip()
    if payload.post_office is not None:
        update_data["post_office"] = payload.post_office.strip()
    if payload.pincode is not None:
        update_data["pincode"] = payload.pincode.strip()

    if update_data:
        await db.users.update_one({"_id": current_user["_id"]}, {"$set": update_data})
    
    updated = await db.users.find_one({"_id": current_user["_id"]})
    return {
        "status": "success",
        "message": "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई (Profile updated successfully)",
        "user": {
            "id": str(updated["_id"]),
            "full_name": updated.get("full_name"),
            "email": updated.get("email"),
            "phone": updated.get("phone"),
            "district": updated.get("district"),
            "tehsil": updated.get("tehsil"),
            "block": updated.get("block"),
            "village": updated.get("village"),
            "pincode": updated.get("pincode")
        }
    }


class FarmerCropIn(BaseModel):
    name: str
    season: str
    area: str
    sowingDate: str
    stage: str | None = "वानस्पतिक वृद्धि अवस्था"
    slug: str | None = "gehu-sample"


@router.get("/me/crops")
async def get_my_crops(current_user: dict[str, Any] = Depends(get_current_user)) -> list[dict[str, Any]]:
    """Retrieve all crops registered by the logged-in farmer."""
    db = get_db()
    user_id = str(current_user["_id"])
    cursor = db.farmer_crops.find({"$or": [{"user_id": user_id}, {"email": current_user.get("email")}]})
    crops = await cursor.to_list(100)
    if not crops:
        # Default starter crops for verified user
        default_crops = [
            {
                "id": "c1",
                "user_id": user_id,
                "email": current_user.get("email"),
                "name": "गेहूँ (DBW 187 / करण वंदना)",
                "season": "रबी 2025-26",
                "area": "2.5 एकड़",
                "sowingDate": "2025-11-20",
                "stage": "दाना पकने की अवस्था",
                "slug": "gehu-sample",
            },
            {
                "id": "c2",
                "user_id": user_id,
                "email": current_user.get("email"),
                "name": "सरसों (NDR 8501)",
                "season": "रबी 2025-26",
                "area": "1.0 एकड़",
                "sowingDate": "2025-10-10",
                "stage": "कटाई योग्य / पक्व अवस्था",
                "slug": "sarson-sample",
            },
        ]
        for c in default_crops:
            await db.farmer_crops.insert_one(dict(c))
        return default_crops
    return crops


@router.post("/me/crops")
async def add_farmer_crop(payload: FarmerCropIn, current_user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    """Register a new crop plot for the farmer."""
    import time
    db = get_db()
    user_id = str(current_user["_id"])
    crop_doc = {
        "id": f"c_{int(time.time() * 1000)}",
        "user_id": user_id,
        "email": current_user.get("email"),
        "name": payload.name,
        "season": payload.season,
        "area": payload.area,
        "sowingDate": payload.sowingDate,
        "stage": payload.stage or "वानस्पतिक वृद्धि अवस्था",
        "slug": payload.slug or "gehu-sample",
    }
    await db.farmer_crops.insert_one(crop_doc)
    return {"status": "success", "message": "फसल सफलतापूर्वक पंजीकृत की गई", "crop": crop_doc}


@router.delete("/me/crops/{crop_id}")
async def delete_farmer_crop(crop_id: str, current_user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    """Remove a crop record."""
    db = get_db()
    user_id = str(current_user["_id"])
    await db.farmer_crops.delete_one({"id": crop_id, "$or": [{"user_id": user_id}, {"email": current_user.get("email")}]})
    return {"status": "success", "message": "फसल हटा दी गई"}


@router.get("/me/questions")
async def get_my_questions(current_user: dict[str, Any] = Depends(get_current_user)) -> list[dict[str, Any]]:
    """Retrieve all expert questions asked by the farmer."""
    db = get_db()
    email = current_user.get("email")
    cursor = db.expert_questions.find({"farmer_email": email}, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(100)

