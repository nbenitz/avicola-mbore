from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import IncubationBatch
from ..schemas import IncubationBatchCreate, IncubationBatchRead
from ..deps import api_key_dependency

router = APIRouter(prefix="/api/incubation", tags=["incubation"], dependencies=[Depends(api_key_dependency)])

@router.get("/batches", response_model=List[IncubationBatchRead])
def list_batches(session: Session = Depends(get_session)):
    return session.exec(select(IncubationBatch).order_by(IncubationBatch.set_date.desc())).all()

@router.post("/batches", response_model=IncubationBatchRead)
def create_batch(payload: IncubationBatchCreate, session: Session = Depends(get_session)):
    batch = IncubationBatch(**payload.model_dump())
    session.add(batch)
    session.commit()
    session.refresh(batch)
    return batch
