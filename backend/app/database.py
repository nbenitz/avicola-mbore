from sqlmodel import SQLModel, create_engine, Session
from .config import get_settings

settings = get_settings()
DATABASE_URL = settings.database_url or "sqlite:///app.db"

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)

def init_db():
    from . import models  # ensure models imported
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
