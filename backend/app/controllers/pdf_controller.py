from fastapi import UploadFile , Request
from fastapi.responses import JSONResponse
from app.utils.pdf_parser import extract_text_from_pdf,UPLOAD_DIR
from app.utils.llm_chat import ask_local_llm
from app.models.pydantic_models import ChatRequest
import os
import aiofiles
from app.utils.session_manger import get_session_id



async def handle_pdf_upload(file: UploadFile,request : Request):

    session_id = get_session_id(request)

    session_path = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(session_path, exist_ok=True)

    file_path = os.path.join(session_path, file.filename)
        
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(await file.read())

    return {"success": True, "message": f"Successfully uploaded {file.filename}"}


async def handle_pdf_delete(filename : str,request : Request):
    
    session_id = get_session_id(request)
    file_path = os.path.join(UPLOAD_DIR, session_id, filename)

    
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"success": True, "message": f"Successfully deleted {filename}"}
    else:
        return {"success": False, "message": f"File '{filename}' not found"}



async def query_pdf(chatRequest: ChatRequest,request : Request):

    session_id = get_session_id(request)
    
    pdf_context = ""
    if chatRequest.fileName:
        pdf_context = await extract_text_from_pdf(chatRequest.fileName,session_id)

    pdf_context_to_send=""


    if chatRequest.fileName and not pdf_context:
        return {"error": "No PDF uploaded yet."}

    elif chatRequest.fileName:
        pdf_context_to_send=pdf_context

    
    response = ask_local_llm(chatRequest.message, pdf_context_to_send)
    return JSONResponse(content={"response": response, "success": True})
