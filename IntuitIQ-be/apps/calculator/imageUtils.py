from google import genai
from google.genai import types
import ast, json
from PIL import Image
from constants import GEMINI_API_KEY
from process_response import process_response_from_json
from fallback_response import extract_dict_from_response

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL = "gemini-2.0-flash"

def analyze_image(img: Image, dict_of_vars: dict):
    dict_of_vars_str = json.dumps(dict_of_vars, ensure_ascii=False)
    prompt = (
        f"You have been given an image with some mathematical expressions, equations, or graphical problems, and you need to solve them. "
        f"Note: Use the PEMDAS rule for solving mathematical expressions. PEMDAS stands for the Priority Order: Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). Parentheses have the highest priority, followed by Exponents, then Multiplication and Division, and lastly Addition and Subtraction. "
        f"For example: "
        f"Q. 2 + 3 * 4 "
        f"(3 * 4) => 12, 2 + 12 = 14. "
        f"Q. 2 + 3 + 5 * 4 - 8 / 2 "
        f"5 * 4 => 20, 8 / 2 => 4, 2 + 3 => 5, 5 + 20 => 25, 25 - 4 => 21. "
        f"YOU CAN HAVE SIX TYPES OF EQUATIONS/EXPRESSIONS IN THIS IMAGE AND ONLY ONE CASE SHALL APPLY EVERY TIME: "
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

        f"3. Assigning values to variables like x = 4, y = 5, z = 6, etc.: In this case, assign values to variables and return another key in the dict called {{'assign': True}}, keeping the variable as 'expr' and the value as 'result' in the original dictionary. RETURN AS A LIST OF DICTS. "

        f"4. Analyzing Graphical Math problems, which are word problems represented in drawing form, such as cars colliding, trigonometric problems, problems on the Pythagorean theorem, adding runs from a cricket wagon wheel, etc. These will have a drawing representing some scenario and accompanying information with the image. PAY SPECIAL ATTENTION TO COLOR-CODED ELEMENTS IN THESE PROBLEMS. Follow these specific instructions for color-based problems: "
        f"a. First identify all distinct colors present in the diagram that are being used to represent numerical values "
        f"b. For each color, count how many times it appears in the diagram (e.g., number of lines, shapes, or marks in that color) "
        f"c. Multiply the count by the value associated with that color (e.g., if red represents 6 runs and there are 3 red lines: 3 * 6 = 18 runs) "
        f"d. Sum all color-based calculations to get the final result "
        f"e. For example in a cricket wagon wheel: "
        f"   - If red lines = 6 runs each and there are 3 red lines → 3 * 6 = 18 runs "
        f"   - If blue arcs = 4 runs each and there are 5 blue arcs → 5 * 4 = 20 runs "
        f"   - Total runs = 18 + 20 = 38 runs "
        f"Return the answer in the format of a LIST OF ONE DICT containing: "
        f"1. 'expr': Description of the graphical problem and color-value mappings "
        f"2. 'steps': Detailed calculation steps including: "
        f"   - Color identification and their associated values "
        f"   - Count of each color's occurrences "
        f"   - Individual color calculations "
        f"   - Final summation "
        f"   Format as: 'Step 1: Identified colors...\\nStep 2: Counted...\\nStep 3: Calculated...\\nStep 4: Summed...' "
        f"3. 'result': Final calculated answer "
        f"Example format: "
        f"[{{'expr': 'Cricket wagon wheel with red lines (6 runs each) and blue arcs (4 runs each)', "
        f"'steps': 'Step 1: Identified 2 colors - red (6 runs) and blue (4 runs)\\nStep 2: Counted 3 red lines and 5 blue arcs\\nStep 3: Red total = 3 * 6 = 18 runs\\nBlue total = 5 * 4 = 20 runs\\nStep 4: Total runs = 18 + 20 = 38 runs', "
        f"'result': '38'}}] "
        f"NOTE: If the problem doesn't involve colors, solve it normally and maintain the same output format, just without the color-specific steps."

        f"5. You have been given an image that represents a probability-based question using drawings, symbols, or graphical elements using different colours. Your task is to carefully analyze the image, extract relevant numerical values and conditions by giving special focus to the different colours used and mentioned in the question, and compute the correct probability. Follow these steps to determine the probability: "
        f"a. Identify the total number of possible outcomes based on the given image. "
        f"b. Determine the number of favorable outcomes related to the event in question. "
        f"c. Compute the probability using the fundamental formula: "
        f"   P(Event) = (Number of Favorable Outcomes) / (Total Number of Outcomes). "
        f"d. If the problem involves conditional probability, use: "
        f"   P(A | B) = P(A ∩ B) / P(B). "
        f"e. For independent events, use: "
        f"   P(A and B) = P(A) * P(B). "
        f"f. For dependent events, consider how prior outcomes affect subsequent probabilities. "
        f"g. If the image represents permutations, combinations, or Bayes' Theorem, apply the appropriate formula accordingly. "
        f"h. Clearly state assumptions if any information is missing from the image. "
        f"Return the answer in the following structured format for easy parsing: "
        f"[{{'expr': 'Extracted probability expression', 'steps': 'Step 1: Add both equations... (show all steps), then after newline Step 2: and then continued...', 'result': 'calculated probability value'}}]. "
        f"Ensure all probability values are rounded to four decimal places where applicable. "
        f"DO NOT USE BACKTICKS OR MARKDOWN FORMATTING. "

        f"6. If you have been given an abstract image or a random text which does not contains any mathematical problems to be solved, then return the answer in the following format: "
        f"A LIST OF ONE DICT containing: "
        f"1. 'expr': An empty string containing nothing "
        f"2. 'steps': An empty string containing nothing "
        f"3. 'result': Write what the image or line shows and tell that as it does not contain any mathematical problems, it can't be solved "
        f"For example, if given eimage contains an abstract image of whatever or a text which is asking nothing related to mathematics, your response should look like: "
        f"[{{'expr': '', "
        f"'steps': ''"
        f"'result': 'The provided image contains blah blah blah... and no mathematical expressions or equations. So, no calculations can be performed.'}}] "
        
        f"Analyze the equation or expression in this image and return the answer according to the given rules: "
        f"Here is a dictionary of user-assigned variables. If the given expression has any of these variables, use its actual value from this dictionary accordingly: {dict_of_vars_str}. "
        f"DO NOT USE BACKTICKS OR MARKDOWN FORMATTING. "
        f"PROPERLY QUOTE THE KEYS AND VALUES IN THE DICTIONARY FOR EASIER PARSING WITH Python's ast.literal_eval."
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt, img],
        config=types.GenerateContentConfig(response_modalities=["Text"])
    )
    print(f"Raw Image Response: {response.text}")
    text = process_response_from_json(response.text)
    try:
        answers = ast.literal_eval(text)
    except Exception as e:
        print(f"Error in parsing: {e}")
        answers = extract_dict_from_response(text)
    print(f"Processed Image Answer: {answers}")
    for ans in answers:
        ans['assign'] = 'assign' in ans
    return answers