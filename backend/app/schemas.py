from typing import Any, Dict, Optional, List
from datetime import date, datetime
from sqlmodel import SQLModel

# Layouts
class LayoutCreate(SQLModel):
    name: str
    width_m: float
    height_m: float
    grid_step: float = 1.0
    data: Dict[str, Any]

class LayoutRead(SQLModel):
    id: int
    name: str
    width_m: float
    height_m: float
    grid_step: float
    data: Dict[str, Any]
    created_at: datetime

# Incubación
class IncubationBatchCreate(SQLModel):
    code: str
    set_date: date
    capacity: int
    eggs_set: int
    hatch_date: Optional[date] = None
    eggs_fertile: Optional[int] = None
    chicks_hatched: Optional[int] = None
    notes: Optional[str] = None

class IncubationBatchRead(IncubationBatchCreate):
    id: int

# Flocks
class FlockCreate(SQLModel):
    name: str
    type: str  # 'recria' | 'postura'
    start_date: date
    birds_start: int
    birds_current: Optional[int] = None
    house: Optional[str] = None
    notes: Optional[str] = None

class FlockRead(FlockCreate):
    id: int

# Eggs
class EggCreate(SQLModel):
    flock_id: int
    date: date
    eggs_ok: int
    eggs_cracked: int = 0
    eggs_dirty: int = 0

class EggRead(EggCreate):
    id: int

# Feed
class FeedCreate(SQLModel):
    flock_id: int
    date: date
    kg: float

class FeedRead(FeedCreate):
    id: int

# Sales
class SaleCreate(SQLModel):
    date: date
    category: str
    product: Optional[str] = None
    qty: float
    unit: str = "unidad"
    unit_price: float
    client: Optional[str] = None
    notes: Optional[str] = None

class SaleRead(SaleCreate):
    id: int

# Sensors
class SensorIngest(SQLModel):
    device_id: str
    key: str
    value: float
    ts: Optional[datetime] = None
    meta: Optional[dict] = None

class SensorRead(SensorIngest):
    id: int
    ts: datetime
