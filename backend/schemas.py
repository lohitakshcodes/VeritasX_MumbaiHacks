from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class NewsItemBase(BaseModel):
    title: str
    link: str
    description: Optional[str] = None
    content: Optional[str] = None
    genre: str

class NewsItemCreate(NewsItemBase):
    pass

class NewsItem(NewsItemBase):
    id: int
    pub_date: datetime
    is_verified: bool
    fact_check_result: Optional[str] = None
    misinformation_score: int

    class Config:
        orm_mode = True

class ClaimBase(BaseModel):
    text: str
    source: Optional[str] = None

class ClaimCreate(ClaimBase):
    pass

class Claim(ClaimBase):
    id: int
    is_fake: bool
    explanation: Optional[str] = None

    class Config:
        orm_mode = True
