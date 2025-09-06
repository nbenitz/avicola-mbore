from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import get_session
from ..models import Layout
from ..schemas import LayoutCreate, LayoutRead
from ..deps import api_key_dependency
from typing import List

router = APIRouter(prefix="/api/layouts", tags=["layouts"], dependencies=[Depends(api_key_dependency)])

@router.get("", response_model=List[LayoutRead])
def list_layouts(session: Session = Depends(get_session)):
    layouts = session.exec(select(Layout).order_by(Layout.created_at.desc())).all()
    return layouts

@router.post("", response_model=LayoutRead)
def create_layout(payload: LayoutCreate, session: Session = Depends(get_session)):
    layout = Layout(**payload.model_dump())
    session.add(layout)
    session.commit()
    session.refresh(layout)
    return layout

@router.get("/{layout_id}", response_model=LayoutRead)
def get_layout(layout_id: int, session: Session = Depends(get_session)):
    layout = session.get(Layout, layout_id)
    if not layout:
        raise HTTPException(status_code=404, detail="Layout not found")
    return layout

@router.put("/{layout_id}", response_model=LayoutRead)
def update_layout(layout_id: int, payload: LayoutCreate, session: Session = Depends(get_session)):
    layout = session.get(Layout, layout_id)
    if not layout:
        raise HTTPException(status_code=404, detail="Layout not found")
    for k, v in payload.model_dump().items():
        setattr(layout, k, v)
    session.add(layout)
    session.commit()
    session.refresh(layout)
    return layout

@router.delete("/{layout_id}")
def delete_layout(layout_id: int, session: Session = Depends(get_session)):
    layout = session.get(Layout, layout_id)
    if not layout:
        raise HTTPException(status_code=404, detail="Layout not found")
    session.delete(layout)
    session.commit()
    return {"ok": True}
