import easyocr
from io import BytesIO
from flask import Flask, request, jsonify

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

def handler(request):
    # Check if the file was provided
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    image_data = file.read()

    # Use EasyOCR to recognize text
    result = reader.readtext(BytesIO(image_data))
    text = " ".join([text[1] for text in result])  # Extracting the text from the result

    # Return the recognized text as a JSON response
    return jsonify({'text': text})

# Create Flask app