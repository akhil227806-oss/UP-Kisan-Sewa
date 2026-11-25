"""Administrative Dashboard and User Management APIs backed by real database records."""

from datetime import datetime, timezone
import io
import csv
import time
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.api.v1.auth import get_current_user
from app.db.mongo import get_db

router = APIRouter(prefix="/admin", tags=["admin"])


async def require_admin_user(current_user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    """Ensure the requesting user has administrative permissions."""
    role = current_user.get("role", "")
    if role not in ["super_admin", "admin", "content_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="प्रशासनिक पहुँच अस्वीकृत (Admin authorization required)"
        )
    return current_user


class UserStatusUpdateIn(BaseModel):
    status: str  # active, inactive, pending_verification


@router.get("/dashboard/stats")
async def get_admin_dashboard_stats(admin: dict[str, Any] = Depends(require_admin_user)) -> dict[str, Any]:
    """Retrieve verified real-time database metrics for the admin dashboard."""
    db = get_db()

    total_users = await db.users.count_documents({})
    total_farmers = await db.users.count_documents({"role": "farmer"})
    verified_users = await db.users.count_documents({"email_verified": True})
    unverified_users = await db.users.count_documents({"email_verified": False})
    active_users = await db.users.count_documents({"status": "active"})
    pending_users = await db.users.count_documents({"status": "pending_verification"})
    total_admins = await db.users.count_documents({"role": {"$in": ["super_admin", "admin", "content_admin"]}})

    # Calculate district breakdown
    district_counts: dict[str, int] = {}
    users_cursor = db.users.find({}, {"district": 1})
    all_users = await users_cursor.to_list(length=1000)
    for u in all_users:
        dist = u.get("district") or "अन्य (Other)"
        district_counts[dist] = district_counts.get(dist, 0) + 1

    # Recent registrations (last 5)
    recent_cursor = db.users.find({}, {"password_hash": 0}).sort("created_at", -1).limit(5)
    recent_users = await recent_cursor.to_list(length=5)

    return {
        "status": "success",
        "metrics": {
            "total_registered_users": total_users,
            "total_farmers": total_farmers,
            "verified_users": verified_users,
            "unverified_users": unverified_users,
            "active_users": active_users,
            "pending_users": pending_users,
            "total_admins": total_admins,
        },
        "district_breakdown": district_counts,
        "recent_registrations": [
            {
                "id": str(u.get("_id", "")),
                "full_name": u.get("full_name", ""),
                "email": u.get("email", ""),
                "phone": u.get("phone", ""),
                "district": u.get("district", ""),
                "status": u.get("status", "pending"),
                "email_verified": u.get("email_verified", False),
                "created_at": str(u.get("created_at", ""))
            }
            for u in recent_users
        ]
    }


@router.get("/users")
async def list_admin_users(
    q: str | None = Query(None, description="Search by name, email, phone"),
    district: str | None = Query(None, description="Filter by district"),
    status: str | None = Query(None, description="Filter by account status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    admin: dict[str, Any] = Depends(require_admin_user)
) -> dict[str, Any]:
    """Retrieve paginated and searchable list of registered users."""
    db = get_db()
    query: dict[str, Any] = {}

    if district:
        query["district"] = district
    if status:
        query["status"] = status
    if q:
        clean_q = q.strip()
        query["$or"] = [
            {"full_name": {"$regex": clean_q, "$options": "i"}},
            {"email": {"$regex": clean_q, "$options": "i"}},
            {"phone": {"$regex": clean_q, "$options": "i"}},
        ]

    total_matching = await db.users.count_documents(query)
    cursor = db.users.find(query, {"password_hash": 0}).sort("created_at", -1).skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)

    return {
        "total": total_matching,
        "skip": skip,
        "limit": limit,
        "users": [
            {
                "id": str(u.get("_id", "")),
                "full_name": u.get("full_name", ""),
                "email": u.get("email", ""),
                "phone": u.get("phone", ""),
                "role": u.get("role", "farmer"),
                "district": u.get("district", ""),
                "tehsil": u.get("tehsil", ""),
                "block": u.get("block", ""),
                "village": u.get("village", ""),
                "pincode": u.get("pincode", ""),
                "email_verified": u.get("email_verified", False),
                "status": u.get("status", "pending_verification"),
                "created_at": str(u.get("created_at", ""))
            }
            for u in users
        ]
    }


@router.get("/users/{user_id}")
async def get_user_detail(user_id: str, admin: dict[str, Any] = Depends(require_admin_user)) -> dict[str, Any]:
    """Retrieve full detail of a specific user."""
    db = get_db()
    user = await db.users.find_one({"_id": user_id}, {"password_hash": 0})
    if not user:
        raise HTTPException(status_code=404, detail="उपयोगकर्ता नहीं मिला (User not found)")
    
    user["id"] = str(user["_id"])
    return user


@router.patch("/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    payload: UserStatusUpdateIn,
    admin: dict[str, Any] = Depends(require_admin_user)
) -> dict[str, Any]:
    """Activate or deactivate user account."""
    db = get_db()
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="उपयोगकर्ता नहीं मिला (User not found)")

    await db.users.update_one({"_id": user_id}, {"$set": {"status": payload.status}})
    return {
        "status": "success",
        "message": f"उपयोगकर्ता स्थिति '{payload.status}' में परिवर्तित की गई।",
        "user_id": user_id
    }


@router.get("/crops")
async def get_admin_crops(admin: dict[str, Any] = Depends(require_admin_user)) -> dict[str, Any]:
    """Retrieve full catalog of crops for administrative management."""
    db = get_db()
    cursor = db.crops.find({}, {"_id": 0})
    crops = await cursor.to_list(100)
    return {"status": "success", "total": len(crops), "items": crops}


@router.get("/schemes")
async def get_admin_schemes(admin: dict[str, Any] = Depends(require_admin_user)) -> dict[str, Any]:
    """Retrieve full catalog of schemes for administrative management."""
    db = get_db()
    cursor = db.schemes.find({}, {"_id": 0})
    schemes = await cursor.to_list(100)
    return {"status": "success", "total": len(schemes), "items": schemes}


class VideoItemIn(BaseModel):
    youtube_id: str
    title: str
    title_hi: str | None = None
    category: str
    category_en: str | None = None
    duration: str | None = "10:00"
    channel: str | None = "NDUAT Media Cell"
    source: str | None = "MANAGE / TNAU / ICAR"
    description: str | None = ""
    description_en: str | None = ""
    status: str | None = "published"


@router.get("/videos")
async def get_admin_videos(
    q: str | None = None,
    category: str | None = None,
    admin: dict[str, Any] = Depends(require_admin_user),
) -> dict[str, Any]:
    """Retrieve complete video training catalog for administration."""
    db = get_db()
    filt: dict[str, Any] = {}
    if category and category != "all":
        filt["$or"] = [
            {"category": {"$regex": category, "$options": "i"}},
            {"category_en": {"$regex": category, "$options": "i"}},
        ]
    if q and q.strip():
        search_term = q.strip()
        filt["$or"] = [
            {"title": {"$regex": search_term, "$options": "i"}},
            {"title_hi": {"$regex": search_term, "$options": "i"}},
            {"channel": {"$regex": search_term, "$options": "i"}},
        ]
    cursor = db.videos.find(filt, {"_id": 0}).limit(100)
    videos = await cursor.to_list(100)
    return {"status": "success", "total": len(videos), "items": videos}


@router.post("/videos")
async def create_admin_video(
    payload: VideoItemIn,
    admin: dict[str, Any] = Depends(require_admin_user),
) -> dict[str, Any]:
    """Add a new training video to online database."""
    db = get_db()
    clean_yt_id = payload.youtube_id.strip()
    if "v=" in clean_yt_id:
        clean_yt_id = clean_yt_id.split("v=")[1].split("&")[0]
    elif "youtu.be/" in clean_yt_id:
        clean_yt_id = clean_yt_id.split("youtu.be/")[1].split("?")[0]

    video_doc = {
        "id": f"vid-{int(datetime.now().timestamp())}",
        "youtube_id": clean_yt_id,
        "title": payload.title.strip(),
        "title_hi": payload.title_hi.strip() if payload.title_hi else payload.title.strip(),
        "category": payload.category.strip(),
        "category_en": payload.category_en.strip() if payload.category_en else payload.category.strip(),
        "duration": payload.duration or "10:00",
        "channel": payload.channel or "NDUAT Media Cell",
        "source": payload.source or "MANAGE / TNAU / ICAR",
        "description": payload.description or "",
        "description_en": payload.description_en or "",
        "status": payload.status or "published",
        "created_at": datetime.now().isoformat(),
    }
    await db.videos.insert_one(video_doc)
    return {"status": "success", "message": "प्रशिक्षण वीडियो सफलतापूर्वक जोड़ा गया।", "item": video_doc}


@router.put("/videos/{video_id}")
async def update_admin_video(
    video_id: str,
    payload: VideoItemIn,
    admin: dict[str, Any] = Depends(require_admin_user),
) -> dict[str, Any]:
    """Update training video attributes."""
    db = get_db()
    clean_yt_id = payload.youtube_id.strip()
    if "v=" in clean_yt_id:
        clean_yt_id = clean_yt_id.split("v=")[1].split("&")[0]
    elif "youtu.be/" in clean_yt_id:
        clean_yt_id = clean_yt_id.split("youtu.be/")[1].split("?")[0]

    update_fields = {
        "youtube_id": clean_yt_id,
        "title": payload.title.strip(),
        "title_hi": payload.title_hi.strip() if payload.title_hi else payload.title.strip(),
        "category": payload.category.strip(),
        "category_en": payload.category_en.strip() if payload.category_en else payload.category.strip(),
        "duration": payload.duration,
        "channel": payload.channel,
        "source": payload.source,
        "description": payload.description,
        "description_en": payload.description_en,
        "status": payload.status or "published",
    }
    await db.videos.update_one({"id": video_id}, {"$set": update_fields})
    return {"status": "success", "message": "वीडियो सफलतापूर्वक अद्यतित किया गया।"}


@router.delete("/videos/{video_id}")
async def delete_admin_video(
    video_id: str,
    admin: dict[str, Any] = Depends(require_admin_user),
) -> dict[str, Any]:
    """Delete a training video from online database."""
    db = get_db()
    await db.videos.delete_one({"id": video_id})
    return {"status": "success", "message": f"वीडियो {video_id} हटाया गया।"}


# ============================================================================
# ADVANCED ADMIN CAPABILITIES: EXPORT, SYSTEM HEALTH, BROADCASTS & ENTITY CREATION
# ============================================================================

@router.get("/export/farmers.csv")
async def export_farmers_csv(admin: dict[str, Any] = Depends(require_admin_user)):
    """Export all registered farmer records in CSV format for official records."""
    db = get_db()
    cursor = db.users.find({"role": "farmer"}, {"password_hash": 0}).sort("created_at", -1)
    farmers = await cursor.to_list(length=5000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Farmer ID",
        "Full Name",
        "Phone Number",
        "Email Address",
        "District",
        "Tehsil",
        "Block",
        "Village",
        "PIN Code",
        "Email Verified",
        "Account Status",
        "Registration Date"
    ])

    for f in farmers:
        writer.writerow([
            str(f.get("_id", f.get("id", ""))),
            f.get("full_name", ""),
            f.get("phone", ""),
            f.get("email", ""),
            f.get("district", ""),
            f.get("tehsil", ""),
            f.get("block", ""),
            f.get("village", ""),
            f.get("pincode", ""),
            "YES" if f.get("email_verified") else "NO",
            f.get("status", "pending"),
            f.get("created_at", "")
        ])

    output.seek(0)
    filename = f"UP_Kisan_Sewa_Farmers_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/system/health")
async def get_system_health(admin: dict[str, Any] = Depends(require_admin_user)) -> dict[str, Any]:
    """Retrieve database latency, cluster health, and storage metrics."""
    db = get_db()
    start_time = time.time()
    # Ping database
    await db.users.find_one({}, {"_id": 1})
    db_latency_ms = round((time.time() - start_time) * 1000, 2)

    users_count = await db.users.count_documents({})
    crops_count = await db.crops.count_documents({})
    schemes_count = await db.schemes.count_documents({})
    videos_count = await db.videos.count_documents({})
    questions_count = await db.expert_questions.count_documents({})
    mandi_count = await db.mandi_prices.count_documents({})

    return {
        "status": "healthy",
        "cluster": "upkisanapp.1oqhzzi.mongodb.net",
        "database": "up_kisan_sewa",
        "latency_ms": db_latency_ms,
        "collections": {
            "users": users_count,
            "crops": crops_count,
            "schemes": schemes_count,
            "videos": videos_count,
            "questions": questions_count,
            "mandi_prices": mandi_count,
        },
        "engine": "Hybrid MongoDB Atlas Cloud + Local Resilient Mirror",
        "server_time": datetime.now(timezone.utc).isoformat(),
    }


class CropCreateIn(BaseModel):
    name_hi: str
    name_en: str
    slug: str
    season_hi: str
    season_en: str
    varieties: str
    source: str
    msp: str | None = None
    seed_rate: str | None = None


@router.post("/crops")
async def create_admin_crop(payload: CropCreateIn, admin: dict[str, Any] = Depends(require_admin_user)) -> dict[str, Any]:
    """Add a new crop to the official catalogue."""
    db = get_db()
    doc = {
        "id": f"crop-{int(datetime.now().timestamp())}",
        "name_hi": payload.name_hi.strip(),
        "name_en": payload.name_en.strip(),
        "slug": payload.slug.strip().lower(),
        "season_hi": payload.season_hi.strip(),
        "season_en": payload.season_en.strip(),
        "varieties": payload.varieties.strip(),
        "source": payload.source.strip(),
        "msp": payload.msp or "₹2,475/कुंतल",
        "seed_rate": payload.seed_rate or "100 किग्रा/हेक्टेयर",
        "status": "published",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.crops.insert_one(doc)
    return {"status": "success", "message": f"फसल '{payload.name_en}' सफलतापूर्वक जोड़ी गई।", "crop": doc}


class SchemeCreateIn(BaseModel):
    name_hi: str
    name_en: str
    slug: str
    level: str
    category: str
    benefit: str
    official_url: str
    verified_source: str


@router.post("/schemes")
async def create_admin_scheme(payload: SchemeCreateIn, admin: dict[str, Any] = Depends(require_admin_user)) -> dict[str, Any]:
    """Add a new agricultural welfare scheme."""
    db = get_db()
    doc = {
        "id": f"sch-{int(datetime.now().timestamp())}",
        "name_hi": payload.name_hi.strip(),
        "name_en": payload.name_en.strip(),
        "slug": payload.slug.strip().lower(),
        "level": payload.level.strip(),
        "category": payload.category.strip(),
        "benefit": payload.benefit.strip(),
        "official_url": payload.official_url.strip(),
        "verified_source": payload.verified_source.strip(),
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.schemes.insert_one(doc)
    return {"status": "success", "message": f"योजना '{payload.name_en}' सफलतापूर्वक जोड़ी गई।", "scheme": doc}



