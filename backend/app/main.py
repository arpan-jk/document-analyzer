from fastapi import FastAPI
from app.routes.pdf_routes import router as pdf_router

app = FastAPI()
app.include_router(pdf_router, prefix="/pdf", tags=["PDF Analyzer"])
