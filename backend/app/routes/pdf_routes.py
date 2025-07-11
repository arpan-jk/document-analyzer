from fastapi import APIRouter, UploadFile, File, Request
from app.controllers.pdf_controller import handle_pdf_upload, query_pdf , handle_pdf_delete
from app.models.pydantic_models import ChatRequest , FileDeleteRequest

router = APIRouter()

@router.post("/upload")
async def upload_pdf(request : Request,file: UploadFile = File(...)):
    return await handle_pdf_upload(file,request)

@router.delete("/upload")
async def delete_pdf(data : FileDeleteRequest,request : Request):
    print("Got ",data.filename)
    return await handle_pdf_delete(data.filename,request)

@router.post("/chat")
async def ask_question(chatRequest : ChatRequest,request: Request):
    return await query_pdf(chatRequest,request)
