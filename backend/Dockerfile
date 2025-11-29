FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy content to backend directory to support package imports
COPY . ./backend

# Add /app to PYTHONPATH so backend package is found
ENV PYTHONPATH=/app

# Use python -m uvicorn to ensure path is respected
CMD ["sh", "-c", "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"]
