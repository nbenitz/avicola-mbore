from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import EggCollection
from ..schemas import EggCreate, EggRead
from ..deps import api_key_dependency

router = APIRouter(prefix="/api/eggs", tags=["eggs"], dependencies=[Depends(api_key_dependency)])

@router.get("", response_model=List[EggRead])
def list_eggs(session: Session = Depends(get_session)):
    return session.exec(select(EggCollection).order_by(EggCollection.date.desc())).all()

@router.post("", response_model=EggRead)
def create_eggs(payload: EggCreate, session: Session = Depends(get_session)):
    row = EggCollection(**payload.model_dump())
    session.add(row)
    session.commit()
    session.refresh(row)
    return row
