# Document Analyzer

A document analyzer application that uses local LLMs to answer queries regarding pdfs uploaded.

## Setup

### 1. AI model setup

1. go to [https://openrouter.ai/](https://openrouter.ai/)
2. create your own api key
3. use with the code [here](https://openrouter.ai/google/gemma-3n-e2b-it:free/api)

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```
## References

1. FastApi Tutorial and Features: [link](https://fastapi.tiangolo.com/)
2. Use google gemma : [link](https://openrouter.ai/google/gemma-3n-e2b-it:free/api)
3. How to use ollama in fastapi : [link](https://www.byteplus.com/en/topic/556170)
4. Pdf extraction in python : [link](https://pypdf2.readthedocs.io/en/3.0.0/user/extract-text.html)
5. 