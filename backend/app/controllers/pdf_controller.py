from fastapi import UploadFile
from fastapi.responses import JSONResponse
from app.utils.pdf_parser import extract_text_from_pdf
from app.utils.llm_chat import ask_local_llm
from app.models.pydantic_models import ChatRequest

# Simple in-memory context store
pdf_context = ""

async def handle_pdf_upload(file: UploadFile):
    global pdf_context
    contents = await file.read()
    pdf_context = extract_text_from_pdf(contents)
    print(pdf_context)
    return {"success": True, "message": f"Successfully uploaded {file.filename}"}



async def query_pdf(request: ChatRequest):
    global pdf_context

    pdf_context_to_send=""

    print(request)

    if request.fileName and not pdf_context:
        return {"error": "No PDF uploaded yet."}

    elif request.fileName:
        pdf_context_to_send=pdf_context

    print(pdf_context_to_send)
    
    response = ask_local_llm(request.message, pdf_context_to_send)
    return JSONResponse(content={"response": response, "success": True})
