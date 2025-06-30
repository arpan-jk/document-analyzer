# Document Analyzer

A document analyzer application that uses local LLMs to process and analyze documents.

## Overview

This application consists of a frontend and backend that work together to analyze documents using local language models. The backend processes documents and the frontend provides a user interface for document upload and analysis.

## Prerequisites

- Node.js and npm
- Python 3
- Ollama (for local LLM)

## Setup

### 1. Install Ollama and Model

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull the required model
ollama pull llama3.2:1b
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload
```

## Usage

1. Start the backend server (step 3 above)
2. Start the frontend development server (step 2 above)
3. Open your browser and navigate to the frontend URL
4. Upload and analyze your documents 