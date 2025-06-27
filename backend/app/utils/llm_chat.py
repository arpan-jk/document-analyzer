import ollama

def ask_local_llm(question: str, context: str) -> str:
    prompt = f"""Use the following context to answer the question:\n\n{context}\n\nQuestion: {question}"""
    
    response = ollama.chat(
        model='llama3.2:1b',  # Or your preferred model like 'llama3.2:1b'
        messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ]
    )

    return response['message']['content']
