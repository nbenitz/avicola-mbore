from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import Flock
from ..schemas import FlockCreate, FlockRead
from ..deps import api_key_dependency

router = APIRouter(prefix="/api/flocks", tags=["flocks"], dependencies=[Depends(api_key_dependency)])

@router.get("", response_model=List[FlockRead])
def list_flocks(session: Session = Depends(get_session)):
    return session.exec(select(Flock).order_by(Flock.start_date.desc())).all()

@router.post("", response_model=FlockRead)
def create_flock(payload: FlockCreate, session: Session = Depends(get_session)):
    flock = Flock(**payload.model_dump())
    session.add(flock)
    session.commit()
    session.refresh(flock)
    return flock
