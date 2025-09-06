from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    cors_origins: str = "http://localhost:5173"
    api_key: str | None = None
    database_url: str | None = None

    class Config:
        env_prefix = ""
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache
def get_settings() -> Settings:
    return Settings()
