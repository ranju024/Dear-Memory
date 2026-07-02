from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database import get_db
from app.models.event import Event
from app.models.photo import Photo
from app.models.lead import Lead, LeadStatus
from app.models.user import User
from app.api.routes.auth import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/dashboard/{user_id}")
async def get_dashboard_stats(
    user_id: int,
    token: str,
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    user = get_current_user(token, db)
    
    if user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Events stats
    total_events = db.query(func.count(Event.id)).filter(Event.owner_id == user.id).scalar()
    live_events = db.query(func.count(Event.id)).filter(
        Event.owner_id == user.id,
        Event.status == "Live"
    ).scalar()
    
    # Photos stats
    total_photos = db.query(func.count(Photo.id)).join(Event).filter(
        Event.owner_id == user.id
    ).scalar()
    
    # Leads stats
    total_leads = db.query(func.count(Lead.id)).filter(Lead.user_id == user.id).scalar()
    booked_leads = db.query(func.count(Lead.id)).filter(
        Lead.user_id == user.id,
        Lead.status == LeadStatus.BOOKED
    ).scalar()
    
    # Views & visitors
    total_views = db.query(func.sum(Event.views)).filter(Event.owner_id == user.id).scalar() or 0
    total_visitors = db.query(func.sum(Event.visitors)).filter(Event.owner_id == user.id).scalar() or 0
    
    return {
        "total_events": total_events or 0,
        "live_events": live_events or 0,
        "total_photos": total_photos or 0,
        "total_leads": total_leads or 0,
        "booked_leads": booked_leads or 0,
        "total_views": int(total_views) if total_views else 0,
        "total_visitors": int(total_visitors) if total_visitors else 0,
    }

@router.get("/events/{user_id}/traffic")
async def get_event_traffic(
    user_id: int,
    token: str,
    days: int = 7,
    db: Session = Depends(get_db)
):
    """Get event traffic stats (placeholder - would need activity tracking)"""
    user = get_current_user(token, db)
    
    if user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Simplified version - returns mock data format
    # In production, you'd track this with a separate Activity table
    return {
        "period": f"Last {days} days",
        "total_views": 24100,
        "total_visitors": 6420,
        "daily_breakdown": [
            {"day": "Mon", "views": 1820, "visitors": 420},
            {"day": "Tue", "views": 2410, "visitors": 510},
            {"day": "Wed", "views": 3120, "visitors": 690},
            {"day": "Thu", "views": 2810, "visitors": 612},
            {"day": "Fri", "views": 4210, "visitors": 920},
            {"day": "Sat", "views": 5640, "visitors": 1240},
            {"day": "Sun", "views": 4820, "visitors": 1080},
        ]
    }

@router.get("/event/{event_id}/performance")
async def get_event_performance(
    event_id: int,
    token: str,
    db: Session = Depends(get_db)
):
    """Get performance metrics for specific event"""
    user = get_current_user(token, db)
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get photos stats
    total_photos = db.query(func.count(Photo.id)).filter(Photo.event_id == event_id).scalar() or 0
    total_favorites = db.query(func.sum(Photo.favorites)).filter(Photo.event_id == event_id).scalar() or 0
    total_downloads = db.query(func.sum(Photo.downloads)).filter(Photo.event_id == event_id).scalar() or 0
    
    return {
        "event_id": event_id,
        "event_title": event.title,
        "views": event.views,
        "visitors": event.visitors,
        "total_photos": total_photos,
        "total_favorites": int(total_favorites) if total_favorites else 0,
        "total_downloads": int(total_downloads) if total_downloads else 0,
        "status": event.status,
        "created_at": event.created_at,
    }

@router.get("/leads/{user_id}/funnel")
async def get_leads_funnel(
    user_id: int,
    token: str,
    db: Session = Depends(get_db)
):
    """Get sales funnel breakdown"""
    user = get_current_user(token, db)
    
    if user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Count leads by status
    statuses = [
        LeadStatus.NEW,
        LeadStatus.CONTACTED,
        LeadStatus.QUOTED,
        LeadStatus.BOOKED,
        LeadStatus.LOST
    ]
    
    funnel = {}
    for status in statuses:
        count = db.query(func.count(Lead.id)).filter(
            Lead.user_id == user.id,
            Lead.status == status
        ).scalar() or 0
        funnel[status.value] = count
    
    return funnel

@router.get("/top-photos/{user_id}")
async def get_top_photos(
    user_id: int,
    token: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get most favorited/downloaded photos"""
    user = get_current_user(token, db)
    
    if user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    top_photos = db.query(Photo).join(Event).filter(
        Event.owner_id == user.id
    ).order_by(Photo.favorites.desc()).limit(limit).all()
    
    return [
        {
            "id": p.id,
            "filename": p.filename,
            "url": p.url,
            "favorites": p.favorites,
            "downloads": p.downloads,
            "event_title": p.event.title
        }
        for p in top_photos
    ]