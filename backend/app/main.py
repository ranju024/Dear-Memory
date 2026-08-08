from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from contextlib import asynccontextmanager
from .database import engine, Base
from .api.routes import auth, events, photos, albums, leads, analytics, studio, guestbook
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    yield
    logger.info("Shutting down...")

app = FastAPI(
    title="DearMemory API",
    description="Photo gallery platform for event photography",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "*"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads folder
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(photos.router, prefix="/api/photos", tags=["photos"])
app.include_router(albums.router, prefix="/api/albums", tags=["albums"])
app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(studio.router, prefix="/api/studio", tags=["studio"])
app.include_router(guestbook.router, prefix="/api/guestbook", tags=["guestbook"])

@app.get("/")
async def root():
    return {"message": "DearMemory API is running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)