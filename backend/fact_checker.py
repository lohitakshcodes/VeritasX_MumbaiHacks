import httpx
import os
import json

GOOGLE_FACT_CHECK_API_KEY = os.getenv("GOOGLE_FACT_CHECK_API_KEY", "")

async def check_google_fact_check(query: str):
    if not GOOGLE_FACT_CHECK_API_KEY:
        return None
    
    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {
        "key": GOOGLE_FACT_CHECK_API_KEY,
        "query": query,
        "languageCode": "en"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                if "claims" in data and data["claims"]:
                    return data["claims"][0] # Return top match
        except Exception as e:
            print(f"Google Fact Check API error: {e}")
    return None

async def check_wikipedia(query: str):
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "format": "json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                if "query" in data and "search" in data["query"]:
                    results = data["query"]["search"]
                    if results:
                        return results[0] # Return top match
        except Exception as e:
            print(f"Wikipedia API error: {e}")
    return None

async def verify_claim(text: str):
    google_result = await check_google_fact_check(text)
    wiki_result = await check_wikipedia(text)
    
    result = {
        "google_fact_check": google_result,
        "wikipedia": wiki_result,
        "summary": "No specific fact check found."
    }
    
    score = 0
    
    if google_result:
        result["summary"] = f"Fact Check found: {google_result.get('text', '')}. Rating: {google_result.get('claimReview', [{}])[0].get('textualRating', 'Unknown')}"
        # Simple heuristic: if rating contains "False" or "Fake", high misinformation score
        rating = google_result.get('claimReview', [{}])[0].get('textualRating', '').lower()
        if "false" in rating or "fake" in rating:
            score = 90
        elif "true" in rating:
            score = 10
        else:
            score = 50
    elif wiki_result:
        result["summary"] = f"Wikipedia result found: {wiki_result.get('title', '')} - {wiki_result.get('snippet', '')}"
        score = 30 # Neutral/Unknown
        
    return result, score
