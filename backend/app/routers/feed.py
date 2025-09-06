from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import FeedConsumption
from ..schemas import FeedCreate, FeedRead
from ..deps import api_key_dependency

router = APIRouter(prefix="/api/feed", tags=["feed"], dependencies=[Depends(api_key_dependency)])

@router.get("", response_model=List[FeedRead])
def list_feed(session: Session = Depends(get_session)):
    return session.exec(select(FeedConsumption).order_by(FeedConsumption.date.desc())).all()

@router.post("", response_model=FeedRead)
def create_feed(payload: FeedCreate, session: Session = Depends(get_session)):
    row = FeedConsumption(**payload.model_dump())
    session.add(row)
    session.commit()
    session.refresh(row)
    return row
