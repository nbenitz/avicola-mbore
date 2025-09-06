from typing import Optional, Any, Dict
from datetime import datetime, date
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import JSON

def JSONColumn():
    try:
        return Column(JSONB)  # Postgres
    except Exception:
        return Column(JSON)   # SQLite -> TEXT fallback managed by SQLAlchemy

class Layout(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    width_m: float
    height_m: float
    grid_step: float = 1.0
    data: Dict[str, Any] = Field(sa_column=JSONColumn())  # Planner JSON
    created_at: datetime = Field(default_factory=datetime.utcnow)

class IncubationBatch(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str
    set_date: date
    capacity: int
    eggs_set: int
    hatch_date: Optional[date] = None
    eggs_fertile: Optional[int] = None
    chicks_hatched: Optional[int] = None
    notes: Optional[str] = None

class Flock(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str  # 'recria' | 'postura'
    start_date: date
    birds_start: int
    birds_current: Optional[int] = None
    house: Optional[str] = None
    notes: Optional[str] = None

class EggCollection(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    flock_id: int = Field(foreign_key="flock.id")
    date: date
    eggs_ok: int
    eggs_cracked: int = 0
    eggs_dirty: int = 0

class FeedConsumption(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    flock_id: int = Field(foreign_key="flock.id")
    date: date
    kg: float

class Sale(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: date
    category: str  # 'huevos' | 'pollitos' | 'carne'
    product: Optional[str] = None
    qty: float
    unit: str = "unidad"  # unidad | docena | kg
    unit_price: float
    client: Optional[str] = None
    notes: Optional[str] = None

class SensorReading(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: str
    ts: datetime = Field(default_factory=datetime.utcnow)
    key: str  # e.g., 'temp', 'hum', 'co2'
    value: float
    meta: dict | None = Field(default=None, sa_column=JSONColumn())
