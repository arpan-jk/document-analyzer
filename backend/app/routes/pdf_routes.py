from fastapi import APIRouter, UploadFile, File, Form
from app.controllers.pdf_controller import handle_pdf_upload, query_pdf

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    return await handle_pdf_upload(file)

@router.post("/query")
async def ask_question(question: str = Form(...)):
    return await query_pdf(question)
