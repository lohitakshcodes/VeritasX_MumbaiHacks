from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from backend.database import Base

class NewsItem(Base):
    __tablename__ = "news_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    link = Column(String, unique=True, index=True)
    description = Column(Text)
    content = Column(Text, nullable=True) # Full article text
    pub_date = Column(DateTime(timezone=True), server_default=func.now())
    genre = Column(String, index=True) # e.g., "Technology", "Sports"
    
    # Verification fields
    is_verified = Column(Boolean, default=False)
    fact_check_result = Column(Text, nullable=True) # JSON or text summary
    misinformation_score = Column(Integer, default=0) # 0-100 likelihood

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, index=True)
    source = Column(String, nullable=True)
    is_fake = Column(Boolean, default=False)
    explanation = Column(Text, nullable=True)
