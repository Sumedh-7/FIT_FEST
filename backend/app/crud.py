from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models import WasteRequest
from app.schemas import RequestCreate, RequestStatusUpdate, DashboardStats, CategoryCount
from datetime import datetime

VALID_STATUSES = ["Pending", "Assigned", "Collected", "Cancelled"]
VALID_CATEGORIES = [
    "Organic Waste",
    "Recyclable Waste",
    "General Waste",
    "E-Waste",
    "Hazardous Waste"
]

def generate_request_id(db: Session) -> str:
    last_req = db.query(WasteRequest).order_by(WasteRequest.id.desc()).first()
    if not last_req:
        return "EC-1001"
    next_num = 1000 + last_req.id + 1
    return f"EC-{next_num}"

def create_request(db: Session, req_data: RequestCreate) -> WasteRequest:
    req_id_code = generate_request_id(db)
    db_req = WasteRequest(
        request_id=req_id_code,
        name=req_data.name.strip(),
        phone=req_data.phone.strip(),
        category=req_data.category.strip(),
        address=req_data.address.strip(),
        pickup_date=req_data.pickup_date,
        pickup_time=req_data.pickup_time,
        description=req_data.description.strip() if req_data.description else None,
        status="Pending",
        created_at=datetime.utcnow()
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

def get_requests(
    db: Session, 
    search: str = None, 
    category: str = None, 
    status: str = None
) -> list[WasteRequest]:
    query = db.query(WasteRequest)

    if category and category != "All":
        query = query.filter(WasteRequest.category == category)
        
    if status and status != "All":
        query = query.filter(WasteRequest.status == status)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                WasteRequest.request_id.ilike(search_term),
                WasteRequest.name.ilike(search_term),
                WasteRequest.phone.ilike(search_term),
                WasteRequest.address.ilike(search_term)
            )
        )

    return query.order_by(WasteRequest.created_at.desc()).all()

def get_request_by_id_or_code(db: Session, identifier: str) -> WasteRequest | None:
    identifier_clean = identifier.strip()
    
    # Try by code exact match (case insensitive)
    req = db.query(WasteRequest).filter(
        func.lower(WasteRequest.request_id) == identifier_clean.lower()
    ).first()
    if req:
        return req

    # Try integer lookup if numeric
    if identifier_clean.isdigit():
        return db.query(WasteRequest).filter(WasteRequest.id == int(identifier_clean)).first()

    return None

def update_request_status(db: Session, db_req: WasteRequest, status_update: RequestStatusUpdate) -> WasteRequest:
    new_status = status_update.status.strip().capitalize()
    # Normalize capitalized statuses
    for valid in VALID_STATUSES:
        if valid.lower() == new_status.lower():
            new_status = valid
            break
            
    db_req.status = new_status
    db.commit()
    db.refresh(db_req)
    return db_req

def get_dashboard_stats(db: Session) -> DashboardStats:
    total_requests = db.query(WasteRequest).count()
    pending = db.query(WasteRequest).filter(WasteRequest.status == "Pending").count()
    assigned = db.query(WasteRequest).filter(WasteRequest.status == "Assigned").count()
    collected = db.query(WasteRequest).filter(WasteRequest.status == "Collected").count()
    cancelled = db.query(WasteRequest).filter(WasteRequest.status == "Cancelled").count()

    cat_counts = (
        db.query(WasteRequest.category, func.count(WasteRequest.id))
        .group_by(WasteRequest.category)
        .all()
    )
    
    cat_dict = {cat: 0 for cat in VALID_CATEGORIES}
    for cat, count in cat_counts:
        cat_dict[cat] = count
        
    breakdown = [CategoryCount(category=cat, count=count) for cat, count in cat_dict.items()]

    return DashboardStats(
        total_requests=total_requests,
        pending=pending,
        assigned=assigned,
        collected=collected,
        cancelled=cancelled,
        category_breakdown=breakdown
    )

def seed_sample_data(db: Session):
    if db.query(WasteRequest).count() == 0:
        samples = [
            {
                "request_id": "EC-1001",
                "name": "Rajesh Kulkarni",
                "phone": "+91 98220 12345",
                "category": "E-Waste",
                "address": "Flat 402, Sneha Apartments, FC Road, Shivajinagar, Pune - 411005",
                "pickup_date": "2026-09-28",
                "pickup_time": "09:00 AM - 12:00 PM",
                "description": "Old laptop, 2 desktop monitors and broken chargers.",
                "status": "Pending",
                "created_at": datetime.utcnow()
            },
            {
                "request_id": "EC-1002",
                "name": "Priya Sharma",
                "phone": "+91 98901 67890",
                "category": "Organic Waste",
                "address": "B-12, Mayur Colony, Kothrud, Near Karve Statue, Pune - 411038",
                "pickup_date": "2026-09-28",
                "pickup_time": "01:00 PM - 04:00 PM",
                "description": "Garden pruning waste and compost bags.",
                "status": "Assigned",
                "created_at": datetime.utcnow()
            },
            {
                "request_id": "EC-1003",
                "name": "Amit Deshmukh",
                "phone": "+91 94223 45678",
                "category": "Hazardous Waste",
                "address": "Plot 89, Datta Mandir Chowk, Viman Nagar, Pune - 411014",
                "pickup_date": "2026-09-29",
                "pickup_time": "09:00 AM - 12:00 PM",
                "description": "Leftover synthetic paints and solvent cans from painting work.",
                "status": "Pending",
                "created_at": datetime.utcnow()
            },
            {
                "request_id": "EC-1004",
                "name": "Sunita Joshi",
                "phone": "+91 91580 98765",
                "category": "Recyclable Waste",
                "address": "7th Floor, Cosmos Heights, Baner Road, Pune - 411045",
                "pickup_date": "2026-09-26",
                "pickup_time": "09:00 AM - 12:00 PM",
                "description": "Flattened cardboard boxes and glass containers.",
                "status": "Collected",
                "created_at": datetime.utcnow()
            },
            {
                "request_id": "EC-1005",
                "name": "Vikram Patil",
                "phone": "+91 97640 11223",
                "category": "General Waste",
                "address": "Sector 3, Magarpatta City, Hadapsar, Pune - 411028",
                "pickup_date": "2026-09-27",
                "pickup_time": "01:00 PM - 04:00 PM",
                "description": "Bulk renovation debris and non-recyclables.",
                "status": "Cancelled",
                "created_at": datetime.utcnow()
            }
        ]
        for item in samples:
            db.add(WasteRequest(**item))
        db.commit()
