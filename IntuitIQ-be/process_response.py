import re
def process_response_from_json(response):
    text = response.strip()
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'^```', '', text)
    text = re.sub(r'```$', '', text)
    return text