from PyPDF2 import PdfReader
from io import BytesIO

def extract_text_from_pdf(contents: bytes) -> str:
    reader = PdfReader(BytesIO(contents))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text
