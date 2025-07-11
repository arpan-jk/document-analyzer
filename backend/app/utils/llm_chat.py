
from openai import OpenAI

from dotenv import load_dotenv
import os

load_dotenv()

model=os.getenv("MODEL")
openrouter_url = os.getenv("OPENROUTER_URL")
api_key=os.getenv("OPENROUTER_API_KEY")


client = OpenAI(
  base_url= openrouter_url,
  api_key= api_key,
)

def ask_local_llm(question: str, context: str) -> str:
    prompt = f"""Use the following context to answer the question:\n\n{context}\n\nQuestion: {question}"""

    
    completion = client.chat.completions.create(
    extra_body={},
    model=model,
    messages=[
        {
        "role": "user",
        "content": prompt
        }
    ]
    )

    
    return completion.choices[0].message.content




