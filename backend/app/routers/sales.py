from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import Sale
from ..schemas import SaleCreate, SaleRead
from ..deps import api_key_dependency

router = APIRouter(prefix="/api/sales", tags=["sales"], dependencies=[Depends(api_key_dependency)])

@router.get("", response_model=List[SaleRead])
def list_sales(session: Session = Depends(get_session)):
    return session.exec(select(Sale).order_by(Sale.date.desc())).all()

@router.post("", response_model=SaleRead)
def create_sale(payload: SaleCreate, session: Session = Depends(get_session)):
    row = Sale(**payload.model_dump())
    session.add(row)
    session.commit()
    session.refresh(row)
    return row
