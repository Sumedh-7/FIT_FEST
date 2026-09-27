from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class RequestCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, example="Rajesh Kulkarni")
    phone: str = Field(..., min_length=5, max_length=30, example="+91 98220 12345")
    category: str = Field(..., example="E-Waste")
    address: str = Field(..., min_length=5, example="Flat 402, Sneha Apartments, FC Road, Shivajinagar, Pune - 411005")
    pickup_date: str = Field(..., example="2026-10-01")
    pickup_time: str = Field(..., example="09:00 AM - 12:00 PM")
    description: Optional[str] = Field(None, max_length=500, example="Old laptop and broken chargers")

class RequestStatusUpdate(BaseModel):
    status: str = Field(..., example="Assigned")

class RequestResponse(BaseModel):
    id: int
    request_id: str
    name: str
    phone: str
    category: str
    address: str
    pickup_date: str
    pickup_time: str
    description: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class CategoryCount(BaseModel):
    category: str
    count: int

class DashboardStats(BaseModel):
    total_requests: int
    pending: int
    assigned: int
    collected: int
    cancelled: int
    category_breakdown: List[CategoryCount]
