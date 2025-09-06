from fastapi import APIRouter, Depends
from sqlmodel import Session
from ..database import get_session
from ..models import SensorReading
from ..schemas import SensorIngest, SensorRead
from ..deps import api_key_dependency

router = APIRouter(prefix="/api/sensors", tags=["sensors"], dependencies=[Depends(api_key_dependency)])

@router.post("/ingest", response_model=SensorRead)
def ingest(payload: SensorIngest, session: Session = Depends(get_session)):
    row = SensorReading(**payload.model_dump())
    session.add(row)
    session.commit()
    session.refresh(row)
    return row
