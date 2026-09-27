import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, get_db
import app.crud as crud
import app.schemas as schemas

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Seed data on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    db = next(get_db())
    try:
        crud.seed_sample_data(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="EcoCollect Pune - Municipal Waste Collection API",
    version=settings.VERSION,
    description="Backend REST API for EcoCollect - Pune Municipal Waste Collection System",
    lifespan=lifespan
)

# CORS Middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
#  API ROUTES - These are registered FIRST so they
#  always take priority over the static file catch-all
# =====================================================

@app.get("/api/health", tags=["System"])
def health_check():
    """System health check endpoint - used by Navbar status indicator."""
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "jurisdiction": "Pune Municipal Corporation",
        "version": settings.VERSION,
        "database": "connected"
    }


@app.get("/api/categories", tags=["Waste Categories"])
def get_waste_categories():
    """Returns all 5 waste categories with disposal guidance."""
    return [
        {
            "id": "organic",
            "name": "Organic Waste",
            "summary": "Food waste, garden trimmings, leaves, and compostable organic matter.",
            "guide": "Place organic waste in compostable bags or green bins. Keep free of plastics, metals, and chemical contaminants.",
            "examples": ["Fruit & vegetable peels", "Coffee grounds", "Yard trimmings", "Food scraps"]
        },
        {
            "id": "recyclable",
            "name": "Recyclable Waste",
            "summary": "Clean paper, cardboard, plastic containers, glass, and metal cans.",
            "guide": "Rinse out containers and flatten cardboard boxes before pickup. Do not include soiled paper or soft plastic bags.",
            "examples": ["Cardboard boxes", "Plastic bottles", "Aluminum cans", "Glass jars"]
        },
        {
            "id": "general",
            "name": "General Waste",
            "summary": "Non-recyclable household trash, mixed materials, and residual waste.",
            "guide": "Bag securely before placing for collection. Ensure no hazardous chemicals or electronics are mixed in.",
            "examples": ["Soiled packaging", "Ceramics", "Broken household items", "Diapers & sanitary waste"]
        },
        {
            "id": "ewaste",
            "name": "E-Waste",
            "summary": "Electronic devices, circuit boards, cables, and appliances.",
            "guide": "Includes phones, chargers, laptops and electronic devices. Do not dispose of these with regular household waste.",
            "examples": ["Smartphones & chargers", "Laptops & monitors", "Small appliances", "Batteries & cables"]
        },
        {
            "id": "hazardous",
            "name": "Hazardous Waste",
            "summary": "Paints, chemicals, solvents, motor oil, and flammable materials.",
            "guide": "Store in tightly sealed, labeled original containers. Keep separate from standard collection bins for special handling.",
            "examples": ["Paints & thinners", "Cleaning solvents", "Motor oil & fluids", "Pesticides"]
        }
    ]


@app.post("/api/requests", response_model=schemas.RequestResponse, status_code=status.HTTP_201_CREATED, tags=["Pickup Requests"])
def create_pickup_request(req: schemas.RequestCreate, db: Session = Depends(get_db)):
    """Create a new waste pickup request. Validates category and stores in database."""
    if req.category not in crud.VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid waste category. Allowed: {', '.join(crud.VALID_CATEGORIES)}"
        )
    return crud.create_request(db, req)


@app.get("/api/requests", response_model=list[schemas.RequestResponse], tags=["Admin & Search"])
def get_all_requests(
    search: str = Query(None, description="Search by ID, name, phone, or address"),
    category: str = Query(None, description="Filter by waste category"),
    status_filter: str = Query(None, alias="status", description="Filter by status"),
    db: Session = Depends(get_db)
):
    """List all requests. Supports search, category filter, and status filter."""
    return crud.get_requests(db, search=search, category=category, status=status_filter)


@app.get("/api/requests/{identifier}", response_model=schemas.RequestResponse, tags=["Request Status"])
def get_request_by_identifier(identifier: str, db: Session = Depends(get_db)):
    """Fetch a single request by its database ID or tracking code (e.g. EC-1001)."""
    req = crud.get_request_by_id_or_code(db, identifier)
    if not req:
        raise HTTPException(status_code=404, detail=f"Request '{identifier}' not found.")
    return req


@app.patch("/api/requests/{identifier}/status", response_model=schemas.RequestResponse, tags=["Request Status"])
def update_request_status(
    identifier: str,
    status_update: schemas.RequestStatusUpdate,
    db: Session = Depends(get_db)
):
    """Update request status. Valid values: Pending, Assigned, Collected, Cancelled."""
    if status_update.status not in crud.VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {', '.join(crud.VALID_STATUSES)}"
        )
    req = crud.get_request_by_id_or_code(db, identifier)
    if not req:
        raise HTTPException(status_code=404, detail=f"Request '{identifier}' not found.")
    return crud.update_request_status(db, req, status_update)


@app.get("/api/stats", response_model=schemas.DashboardStats, tags=["Collection Statistics"])
def get_dashboard_statistics(db: Session = Depends(get_db)):
    """Returns dashboard statistics: counts by status and category breakdown."""
    return crud.get_dashboard_stats(db)


# =====================================================
#  STATIC FILE SERVING - React Frontend
#  This comes AFTER all API routes so it never
#  intercepts /api/* calls
# =====================================================

static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")

if os.path.exists(static_dir):
    # Serve /assets/* (JS, CSS bundles)
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static_assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(request: Request, full_path: str):
        """Serve React SPA. Skips any /api paths (should never reach here)."""
        # Safety: never intercept API calls
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"detail": "API endpoint not found"})

        # Try serving the exact file (images, favicon, etc.)
        file_path = os.path.join(static_dir, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)

        # For all other paths, serve index.html (React Router handles routing)
        return FileResponse(os.path.join(static_dir, "index.html"))
