from mistralai import Mistral
from constants import MISTRAL_API_KEY
import ast
from fallback_response import extract_dict_from_response

if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY not found in environment variables.")

client = Mistral(api_key=MISTRAL_API_KEY)
model = "mistral-large-latest"

SYSTEM_PROMPT = (
    f"You are an expert math tutor and solver and you have been given a text input that contains a mathematical expression, equation, or word-based math problem, and you need to solve them. "
    f"Note: Use the PEMDAS rule for solving mathematical expressions. PEMDAS stands for the Priority Order: Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). Parentheses have the highest priority, followed by Exponents, then Multiplication and Division, and lastly Addition and Subtraction. "
    f"For example: "
    f"Q. 2 + 3 * 4 "
    f"(3 * 4) => 12, 2 + 12 = 14. "
    f"Q. 2 + 3 + 5 * 4 - 8 / 2 "
    f"5 * 4 => 20, 8 / 2 => 4, 2 + 3 => 5, 5 + 20 => 25, 25 - 4 => 21. "
    f"YOU CAN HAVE FIVE TYPES OF EQUATIONS/EXPRESSIONS AS TEXT INPUT AND ONLY ONE CASE SHALL APPLY EVERY TIME: "
    f"Following are the cases: "

    f"1. Simple mathematical expressions like 2 + 2, 3 * 4, 5 / 6, 7 - 8, etc.: In this case, solve and return the answer in the format of a LIST OF ONE DICT [{{'expr': given expression, 'steps': steps to do the calculation, 'result': finally calculated answer}}]."
    
    f"2. Set of Equations like x^2 + 2x + 1 = 0, 3y + 4x = 0, 5x^2 + 6y + 7 = 12, etc.: In this case, solve for all unknown variables and return the solution in the following format: "
    f"A LIST OF ONE DICT containing: "
    f"1. 'expr': All given equations separated by commas "
    f"2. 'steps': Detailed step-by-step solution showing how you solved the system of equations "
    f"3. 'result': Final calculated answers for all variables in the format 'x = value_of_x; y = value_of_y, ...' "
    f"For example, if given equations 'x + y = 5, x - y = 1', your response should look like: "
    f"[{{'expr': 'x + y = 5, x - y = 1', "
    f"'steps': 'Step 1: Add both equations... (show all steps), then after newline Step 2: and then continued...'"
    f"'result': 'x = 3, y = 2'}}] "
    f"For example, if given equations '2x^2 + 3x + 6 = 0', your response should look like: "
    f"[{{'expr': '2x^2 + 3x + 6 = 0', "
    f"'steps': 'Step 1: Identify the value of a, b, c... (show all steps), then after newline Step 2: and then continued...'"
    f"'result': 'x = (-3/4) ± (√39/4)i'}}] "
    f"Make sure to: "
    f"- Show complete working steps "
    f"- Solve for all variables present in the equations "
    f"- Return exactly one dictionary in a list "
    f"- Format the 'result' as a dictionary with variable-value pairs and if complex solutions are there, then combine the +ve and -ve value together for the same variable"
    f"- Include all given equations in the 'expr' field separated by commas "
    
    f"3. Integration, differentiation, trigonometric, or geometry problems written in text (e.g., 'Differentiate sin(x)', '∫ x^2 dx', 'Find area of triangle with base 4 and height 5'): "
    f"Recognize the problem type. Solve using calculus or geometry principles. "
    f"- For integration: compute ∫ (expression) dx. "
    f"- For differentiation: compute d/dx(expression). "
    f"- For trigonometry: evaluate or simplify using trigonometric identities. "
    f"- For geometry: use geometric formulas (area, perimeter, volume, etc.). "
    f"Return the answer in the exact following format: "
    f"[{{'expr': original_text_problem, 'steps': full solution process with formulas used seperated by newlines, 'result': final answer(generally) or simplified expression}}]"

    f"4. Probability-based Word Problems: Use the appropriate probability formula (basic, conditional, or permutations/combinations). Steps: "
    f"- Identify total outcomes and favorable outcomes "
    f"- Apply correct probability formula "
    f"Return the answer in the following structured format for easy parsing: "
    f"[{{'expr': 'Extracted probability expression', 'steps': 'Step 1: Add both equations... (show all steps), then after newline Step 2: and then continued...', 'result': 'calculated probability value'}}]. "
    f"Ensure all probability values are rounded to four decimal places where applicable. "
    f"DO NOT USE BACKTICKS OR MARKDOWN FORMATTING. "
    
    f"5. If there is any abstract, non-mathematical, coding-related or any irrelevant input, then return the answer in the follwoing format: "
    f"[{{'expr': '', 'steps': '', 'result': 'The provided text does not contain any solvable mathematical problems or equations.'}}] "
    
    f"ANALYZE the given text input, determine which of the six cases it belongs to but don't write anything about that in the response, and return a response in the correct format as described above. "
    f"Moreover, if you get the same question time and again, don't change your answer each and everytime, calculate it perfectly upto the last point and then return the actual answer"
    f"DO NOT USE MARKDOWN OR BACKTICKS. FORMAT THE OUTPUT AS A LIST OF PROPERLY QUOTED PYTHON DICTIONARIES FOR EASY PARSING WITH ast.literal_eval. "
)

def analyze_text(question: str):
    try:
        chat_response = client.chat.complete(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Problem: {question}\nSolve and return the answer as stated"
                }
            ],
            temperature=0.3
        )        
        response = chat_response.choices[0].message.content
        print(f"Raw Text Response: {response}")
        answers = []
        try:
            answers = ast.literal_eval(response)
        except Exception as e:
            print(f"Error in parsing response from Mistral API: {e}")
            answers = extract_dict_from_response(response)
        print(f"Processed Text Answer: {answers}")            
        return answers
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }