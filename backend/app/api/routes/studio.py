from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from ...models.studio import Studio
from ...models.user import User
from ...schemas.lead_studio import StudioCreate, StudioUpdate, StudioResponse
from .auth import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=StudioResponse, status_code=201)
async def create_studio(
    # studio: StudioCreate,
    studio_data: StudioCreate,
    token: str,
    db: Session = Depends(get_db)
):
    """Create a studio profile"""
    user = get_current_user(token, db)
    
    # # Check if user already has a studio
    # existing_studio = db.query(Studio).filter(Studio.user_id == user.id).first()
    # if existing_studio:
    #     raise HTTPException(status_code=400, detail="Studio profile already exists for this user")
    
    # # Check slug uniqueness
    # existing_slug = db.query(Studio).filter(Studio.slug == studio.slug).first()
    # if existing_slug:
    #     raise HTTPException(status_code=400, detail="Studio slug already taken")
    
    # new_studio = Studio(
    #     user_id=user.id,
    #     **studio.dict()
    # )
    # db.add(new_studio)
    # db.commit()
    # db.refresh(new_studio)
    
    # logger.info(f"Studio created: {new_studio.name}")
    # return new_studio

        # Auto-generate slug if not provided
    slug = studio_data.slug or studio_data.name.lower().replace(" ", "-")
    
    studio = Studio(
        name=studio_data.name,
        tagline=studio_data.tagline or "",
        slug=slug,
        owner_id=user.id,
    )
    
    db.add(studio)
    db.commit()
    db.refresh(studio)
    
    return studio

@router.get("/me", response_model=StudioResponse)
async def get_my_studio(
    token: str,
    db: Session = Depends(get_db)
):
    """Get current user's studio profile"""
    user = get_current_user(token, db)
    studio = db.query(Studio).filter(Studio.user_id == user.id).first()
    
    if not studio:
        raise HTTPException(status_code=404, detail="Studio profile not found")
    
    return studio

@router.get("/me")
async def get_current_user_studio(
    token: str,
    db: Session = Depends(get_db)
):
    """Get current user's studio"""
    user = get_current_user(token, db)
    
    studio = db.query(Studio).filter(Studio.owner_id == user.id).first()
    
    if not studio:
        raise HTTPException(status_code=404, detail="Studio not found")
    
    return studio

@router.get("/slug/{slug}", response_model=StudioResponse)
async def get_studio_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get studio profile by slug (public)"""
    studio = db.query(Studio).filter(Studio.slug == slug).first()
    
    if not studio:
        raise HTTPException(status_code=404, detail="Studio not found")
    
    return studio

@router.get("/{user_id}", response_model=StudioResponse)
async def get_user_studio(user_id: int, db: Session = Depends(get_db)):
    """Get studio profile for a user (public)"""
    studio = db.query(Studio).filter(Studio.user_id == user_id).first()
    
    if not studio:
        raise HTTPException(status_code=404, detail="Studio not found")
    
    return studio

@router.put("/me", response_model=StudioResponse)
async def update_my_studio(
    studio_update: StudioUpdate,
    token: str,
    db: Session = Depends(get_db)
):
    """Update current user's studio profile"""
    user = get_current_user(token, db)
    studio = db.query(Studio).filter(Studio.user_id == user.id).first()
    
    if not studio:
        raise HTTPException(status_code=404, detail="Studio profile not found")
    
    update_data = studio_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(studio, field, value)
    
    db.commit()
    db.refresh(studio)
    
    logger.info(f"Studio updated: {studio.name}")
    return studio

@router.post("/me/stats/update", response_model=StudioResponse)
async def update_studio_stats(
    token: str,
    db: Session = Depends(get_db)
):
    """Recalculate studio stats from events and photos"""
    from sqlalchemy import func
    from app.models.event import Event
    from app.models.photo import Photo
    
    user = get_current_user(token, db)
    studio = db.query(Studio).filter(Studio.user_id == user.id).first()
    
    if not studio:
        raise HTTPException(status_code=404, detail="Studio profile not found")
    
    # Count total events
    total_events = db.query(func.count(Event.id)).filter(Event.owner_id == user.id).scalar() or 0
    
    # Count total photos
    total_photos = db.query(func.count(Photo.id)).join(Event).filter(
        Event.owner_id == user.id
    ).scalar() or 0
    
    # Update studio stats
    studio.total_events = total_events
    studio.total_photos = total_photos
    
    db.commit()
    db.refresh(studio)
    
    logger.info(f"Studio stats updated: {studio.name}")
    return studio