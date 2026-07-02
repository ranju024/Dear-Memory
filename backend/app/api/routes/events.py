from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...database import get_db
from ...models.event import Event, EventStatus
from ...models.user import User
from ...schemas.event import EventCreate, EventUpdate, EventResponse, EventDetailResponse
from .auth import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=EventResponse, status_code=201)
async def create_event(
    event: EventCreate,
    token: str,
    db: Session = Depends(get_db)
):
    """Create a new event"""
    user = get_current_user(token, db)
    
    # Check if slug is unique
    existing = db.query(Event).filter(Event.slug == event.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Event slug already exists")
    
    new_event = Event(
        **event.dict(),
        owner_id=user.id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    logger.info(f"Event created: {new_event.slug} by {user.username}")
    return new_event

@router.get("/", response_model=List[EventResponse])
async def list_events(
    token: str,
    status_filter: str = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """List user's events"""
    user = get_current_user(token, db)
    
    query = db.query(Event).filter(Event.owner_id == user.id)
    
    if status_filter:
        query = query.filter(Event.status == status_filter)
    
    events = query.offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=EventDetailResponse)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get event details (public)"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Increment views
    event.views += 1
    db.commit()
    
    return event

@router.get("/slug/{slug}", response_model=EventDetailResponse)
async def get_event_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get event by slug (public)"""
    event = db.query(Event).filter(Event.slug == slug).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Increment views
    event.views += 1
    db.commit()
    
    return event

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_update: EventUpdate,
    token: str,
    db: Session = Depends(get_db)
):
    """Update event"""
    user = get_current_user(token, db)
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update fields
    update_data = event_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    
    logger.info(f"Event updated: {event.slug}")
    return event

@router.delete("/{event_id}", status_code=204)
async def delete_event(
    event_id: int,
    token: str,
    db: Session = Depends(get_db)
):
    """Delete event"""
    user = get_current_user(token, db)
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(event)
    db.commit()
    
    logger.info(f"Event deleted: {event.slug}")

@router.post("/{event_id}/publish", response_model=EventResponse)
async def publish_event(
    event_id: int,
    token: str,
    db: Session = Depends(get_db)
):
    """Publish event (change status to Live)"""
    user = get_current_user(token, db)
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    event.status = EventStatus.LIVE
    db.commit()
    db.refresh(event)
    
    logger.info(f"Event published: {event.slug}")
    return event