from PyPDF2 import PdfReader
from io import BytesIO
import os
import aiofiles

UPLOAD_DIR="uploads"

async def extract_text_from_pdf(fileName: str,session_id : str) -> str:

    file_path = os.path.join(UPLOAD_DIR, session_id, fileName)

    data = None
    async with aiofiles.open(file_path, 'rb') as f:
        data = await f.read()

    reader = PdfReader(BytesIO(data))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text
