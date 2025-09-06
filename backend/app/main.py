from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .database import init_db
from .routers import health, layouts, incubation, flocks, eggs, feed, sales, sensors

settings = get_settings()

app = FastAPI(title="Granja Mboré API", version="0.1.0")

# CORS
origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router)
app.include_router(layouts.router)
app.include_router(incubation.router)
app.include_router(flocks.router)
app.include_router(eggs.router)
app.include_router(feed.router)
app.include_router(sales.router)
app.include_router(sensors.router)

@app.on_event("startup")
def on_startup():
    init_db()
