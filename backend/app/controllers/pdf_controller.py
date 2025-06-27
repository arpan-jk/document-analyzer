from fastapi import UploadFile
from app.utils.pdf_parser import extract_text_from_pdf
from app.utils.llm_chat import ask_local_llm

# Simple in-memory context store
pdf_context = ""

async def handle_pdf_upload(file: UploadFile):
    global pdf_context
    contents = await file.read()
    pdf_context = extract_text_from_pdf(contents)
    print(pdf_context)
    return {"message": f"PDF uploaded and processed."}

async def query_pdf(question: str):
    global pdf_context
    if not pdf_context:
        return {"error": "No PDF uploaded yet."}
    answer = ask_local_llm(question, pdf_context)
    return {"question": question, "answer": answer}
