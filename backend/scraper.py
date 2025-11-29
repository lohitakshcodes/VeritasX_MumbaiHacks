import httpx
import xml.etree.ElementTree as ET
from sqlalchemy.orm import Session
from backend import models, schemas
from datetime import datetime
import email.utils

# List of RSS feeds to scrape
RSS_FEEDS = {
    "Technology": "http://feeds.bbci.co.uk/news/technology/rss.xml",
    "Sports": "http://feeds.bbci.co.uk/sport/rss.xml",
    "World": "http://feeds.bbci.co.uk/news/world/rss.xml",
    "Health": "http://feeds.bbci.co.uk/news/health/rss.xml"
}

async def fetch_feed(url: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            return response.content
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

def parse_feed(content: bytes, genre: str):
    items = []
    try:
        root = ET.fromstring(content)
        # Handle standard RSS 2.0
        channel = root.find("channel")
        if channel is None:
            return items
            
        for item in channel.findall("item"):
            title = item.find("title").text if item.find("title") is not None else "No Title"
            link = item.find("link").text if item.find("link") is not None else ""
            description = item.find("description").text if item.find("description") is not None else ""
            pub_date_str = item.find("pubDate").text if item.find("pubDate") is not None else ""
            
            # Parse date
            pub_date = datetime.now()
            if pub_date_str:
                try:
                    # RFC 822 parsing
                    parsed = email.utils.parsedate_to_datetime(pub_date_str)
                    pub_date = parsed
                except:
                    pass

            items.append({
                "title": title,
                "link": link,
                "description": description,
                "pub_date": pub_date,
                "genre": genre
            })
    except Exception as e:
        print(f"Error parsing feed: {e}")
    return items

async def scrape_and_store_feeds(db: Session):
    for genre, url in RSS_FEEDS.items():
        content = await fetch_feed(url)
        if content:
            parsed_items = parse_feed(content, genre)
            for item in parsed_items:
                # Check if exists
                exists = db.query(models.NewsItem).filter(models.NewsItem.link == item["link"]).first()
                if not exists:
                    db_item = models.NewsItem(**item)
                    db.add(db_item)
            db.commit()
    print("Scraping completed.")
