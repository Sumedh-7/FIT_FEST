import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from app.database import engine, Base, SessionLocal
from app.models import WasteRequest
import app.crud as crud
import app.schemas as schemas

def test_all():
    print("1. Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("2. Seeding initial data...")
        crud.seed_sample_data(db)
        
        print("3. Querying stats...")
        stats = crud.get_dashboard_stats(db)
        print(f"Stats: Total={stats.total_requests}, Pending={stats.pending}, Assigned={stats.assigned}, Collected={stats.collected}, Cancelled={stats.cancelled}")
        assert stats.total_requests >= 5, "Expected at least 5 seeded requests"
        
        print("4. Creating a new request...")
        new_req_data = schemas.RequestCreate(
            name="Test User",
            phone="+1 555-9999",
            category="E-Waste",
            address="100 Tech Blvd",
            pickup_date="2026-10-05",
            pickup_time="09:00 AM - 12:00 PM",
            description="Testing automated flow"
        )
        created = crud.create_request(db, new_req_data)
        print(f"Created request: {created.request_id} (Status: {created.status})")
        assert created.request_id.startswith("EC-"), "Request ID must start with EC-"
        
        print("5. Updating status...")
        updated = crud.update_request_status(db, created, schemas.RequestStatusUpdate(status="Assigned"))
        print(f"Updated request {updated.request_id} status to {updated.status}")
        assert updated.status == "Assigned"
        
        print("6. Fetching by code...")
        fetched = crud.get_request_by_id_or_code(db, created.request_id)
        assert fetched and fetched.id == created.id
        print("Backend automated checks passed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    test_all()
