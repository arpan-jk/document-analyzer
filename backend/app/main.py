from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.pdf_routes import router as pdf_router

app = FastAPI()

# Allow CORS from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf_router, prefix="/pdf", tags=["PDF Analyzer"])
