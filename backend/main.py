from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from backend import models, schemas, database, scraper, fact_checker
from backend.database import engine

# Create tables
database.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Misinformation Detection API")

# CORS (will configure properly later, allowing all for now for hackathon)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Misinformation Detection System API"}

# --- News Items ---

@app.get("/news/", response_model=List[schemas.NewsItem])
def read_news(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    news = db.query(models.NewsItem).offset(skip).limit(limit).all()
    return news

@app.post("/news/", response_model=schemas.NewsItem)
def create_news(news: schemas.NewsItemCreate, db: Session = Depends(database.get_db)):
    db_news = models.NewsItem(**news.dict())
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

# --- Claims ---

@app.post("/claims/", response_model=schemas.Claim)
def create_claim(claim: schemas.ClaimCreate, db: Session = Depends(database.get_db)):
    db_claim = models.Claim(**claim.dict())
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    return db_claim

@app.get("/claims/", response_model=List[schemas.Claim])
def read_claims(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    claims = db.query(models.Claim).offset(skip).limit(limit).all()
    return claims

# --- Scraper and Fact Checker ---

@app.post("/trigger-scrape/")
async def trigger_scrape(background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    background_tasks.add_task(scraper.scrape_and_store_feeds, db)
    return {"message": "Scraping triggered in background"}

@app.post("/verify-claim/", response_model=schemas.Claim)
async def verify_claim_endpoint(claim_id: int, db: Session = Depends(database.get_db)):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    result, score = await fact_checker.verify_claim(claim.text)
    
    claim.explanation = str(result["summary"])
    claim.is_fake = score > 50
    db.commit()
    db.refresh(claim)
    return claim

@app.post("/verify-news/{news_id}", response_model=schemas.NewsItem)
async def verify_news_endpoint(news_id: int, db: Session = Depends(database.get_db)):
    news = db.query(models.NewsItem).filter(models.NewsItem.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News item not found")
        
    result, score = await fact_checker.verify_claim(news.title)
    
    news.fact_check_result = str(result["summary"])
    news.misinformation_score = score
    news.is_verified = True
    db.commit()
    db.refresh(news)
    return news
