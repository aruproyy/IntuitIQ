def extract_dict_from_response(response):
    def extract_val_from_response(text, start_substring, end_substring):
        start_index = text.find(start_substring)
        if start_index == -1:
            return None
        start_index += len(start_substring)
        end_index = text.find(end_substring, start_index)
        if end_index == -1:
            return None
        return text[start_index:end_index]
    extracted_expr = extract_val_from_response(response, "'expr': '", "', 'steps': ")
    extracted_steps = extract_val_from_response(response, "', 'steps': '", "', 'result': ")
    extracted_result = extract_val_from_response(response, "', 'result': '", "'}]")
    extracted_response = [{'expr': extracted_expr, 'steps': extracted_steps, 'result': extracted_result}]
    return extracted_response