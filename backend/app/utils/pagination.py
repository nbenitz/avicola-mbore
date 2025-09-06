from typing import Optional
from fastapi import Query

def paging_params(limit: Optional[int] = Query(default=100, ge=1, le=1000),
                  offset: Optional[int] = Query(default=0, ge=0)):
    return {"limit": limit, "offset": offset}
