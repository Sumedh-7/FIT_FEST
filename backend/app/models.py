from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class WasteRequest(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    request_id = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    address = Column(Text, nullable=False)
    pickup_date = Column(String(20), nullable=False)
    pickup_time = Column(String(30), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(30), nullable=False, default="Pending", index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
