from fastapi import Header, HTTPException, status
from .config import get_settings

settings = get_settings()

async def api_key_dependency(x_api_key: str | None = Header(default=None)):
    if not settings.api_key:
        return  # no auth required in dev if API_KEY not set
    if x_api_key != settings.api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing API key")
