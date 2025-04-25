from mistralai import Mistral
from constants import MISTRAL_API_KEY

if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY not found in environment variables.")

client = Mistral(api_key=MISTRAL_API_KEY)
model = "mistral-large-latest"

def analyze_text(question: str):
    try:
        chat_response = client.chat.complete(
            model=model,
            messages = [{
                "role": "user",
                "content": question
            },]
        )
        response_content = chat_response.choices[0].message.content
        return {
            "status": "success",
            "response": response_content
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }