from fastapi import APIRouter, UploadFile, File, Form
from app.controllers.pdf_controller import handle_pdf_upload, query_pdf
from app.models.pydantic_models import ChatRequest

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    return await handle_pdf_upload(file)

@router.post("/chat")
async def ask_question(request : ChatRequest):
    return await query_pdf(request)
