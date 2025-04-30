from mistralai.client import MistralClient
from constants import MISTRAL_API_KEY

if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY not found in environment variables.")

client = MistralClient(api_key=MISTRAL_API_KEY)
model = "mistral-large-latest"

def analyze_text(question: str):
    try:
        chat_response = client.chat(
            model=model,
            messages=[{
                "role": "user",
                "content": f"""
                Please solve this mathematical problem strictly following these guidelines:
                1. Structure your response in exactly this format:
                   Problem: [PROBLEM_STATEMENT]
                   Solution Steps:
                   - [STEP_1_DESCRIPTION]
                   - [STEP_2_DESCRIPTION]
                   ...
                   Final Answer: [FINAL_ANSWER]
                
                2. Format all mathematical expressions as follows:
                   - For inline math: $expression$
                   - For display math (centered equations): $$expression$$
                   - Use proper LaTeX syntax for all mathematical notation
                   - Use environments like \begin{{align*}} when needed for multi-line equations
                
                3. For non-mathematical questions, respond with exactly:
                   "I can only solve mathematical problems. Please provide a math-related question."
                
                4. Never include introductory phrases or explanations - just the structured solution.
                
                5. Example of good formatting:
                   Problem: Solve $$\int \frac{{1}}{{x^2 + 1}} \, dx$$
                   Solution Steps:
                   - Recognize this as a standard integral: $$\int \frac{{1}}{{x^2 + 1}} \, dx = \arctan(x) + C$$
                   Final Answer: $$\arctan(x) + C$$
                
                The problem to solve is: {question}
                """
            }],
            temperature=0.3  # Lower temperature for more deterministic output
        )
        
        response_content = chat_response.choices[0].message.content
        print("Raw API Response:", response_content)  # Debug logging
        
        # Basic validation
        if "Problem:" not in response_content and "I can only solve" not in response_content:
            raise ValueError("Unexpected response format from API")
            
        return {
            "status": "success",
            "response": response_content
        }
    except Exception as e:
        print(f"Error in analyze_text: {str(e)}")  # Debug logging
        return {
            "status": "error",
            "error": str(e)
        }