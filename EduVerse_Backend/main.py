# EduVerse Backend - Vercel Entry Point
"""
Main entry point for Vercel deployment
This file imports and exposes the FastAPI app for serverless deployment
"""

import os
import sys

# Add the current directory to Python path for imports
sys.path.insert(0, os.path.dirname(__file__))

# Import the FastAPI app from the app module
from app.main import app

# This is the WSGI/ASGI application that Vercel will use
application = app

# For local development
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    ) 