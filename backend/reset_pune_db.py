import os
import sys

sys.path.append(os.path.dirname(__file__))

from app.database import engine, Base, SessionLocal
from app.models import WasteRequest
from datetime import datetime, timezone

Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("Clearing old records from database...")
db.query(WasteRequest).delete()
db.commit()

pune_orders = [
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
        "created_at": datetime.now(timezone.utc)
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
        "created_at": datetime.now(timezone.utc)
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
        "created_at": datetime.now(timezone.utc)
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
        "created_at": datetime.now(timezone.utc)
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
        "created_at": datetime.now(timezone.utc)
    },
    {
        "request_id": "EC-1006",
        "name": "Ananya Iyer",
        "phone": "+91 98220 55443",
        "category": "E-Waste",
        "address": "Flat 301, IT Park Road, Aundh, Pune - 411007",
        "pickup_date": "2026-09-30",
        "pickup_time": "09:00 AM - 12:00 PM",
        "description": "Old smartphone, batteries and broken router.",
        "status": "Pending",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "request_id": "EC-1007",
        "name": "Rohan Mehta",
        "phone": "+91 99211 44332",
        "category": "Organic Waste",
        "address": "Villa 14, Clover Village, Wanowrie, Pune - 411040",
        "pickup_date": "2026-09-30",
        "pickup_time": "01:00 PM - 04:00 PM",
        "description": "Kitchen waste and dry leaves.",
        "status": "Assigned",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "request_id": "EC-1008",
        "name": "Kavita Poojary",
        "phone": "+91 94230 77665",
        "category": "Recyclable Waste",
        "address": "Bldg C, Balewadi High Street, Baner, Pune - 411045",
        "pickup_date": "2026-10-01",
        "pickup_time": "09:00 AM - 12:00 PM",
        "description": "Newspaper bundles and clean plastic containers.",
        "status": "Pending",
        "created_at": datetime.now(timezone.utc)
    }
]

for order in pune_orders:
    db.add(WasteRequest(**order))

db.commit()
print(f"SUCCESS: Seeded {len(pune_orders)} fresh Pune orders into database!")
db.close()
