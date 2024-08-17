
import json
import os
import base64
from io import BytesIO
import uuid
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
from flask import Flask, request, jsonify, url_for

# Load the trained model
model_path = 'final_model_after_additional_training.keras'
model = load_model(model_path)

# Load the class indices
class_indices_path = 'class_indices.json'
with open(class_indices_path, 'r') as f:
    class_indices = json.load(f)

# Reverse the class indices dictionary to map index to class label
indices_class = {v: k for k, v in class_indices.items()}

# Load the allergen information
allergen_info_path = 'class_allergen_map.json'
with open(allergen_info_path, 'r') as f:
    allergen_info = json.load(f)

def preprocess_image(img):
    img = img.resize((416, 416))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

def predict_image(model, img_array):
    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions, axis=1)[0]
    predicted_class_label = indices_class[predicted_class_index]
    
    # Create a list of tuples with class names and their respective confidence percentages
    predictions_with_labels = [
        (indices_class[i], f"{pred * 100:.2f}%") 
        for i, pred in enumerate(predictions[0])
    ]
    
    return predicted_class_label, predictions_with_labels

app = Flask(__name__)
CORS(app)



@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Food Allergen Detection API'})

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_data = data['image']
    image_data = image_data.split(',')[1]
    image_data = base64.b64decode(image_data)
    img = Image.open(BytesIO(image_data))
    img_array = preprocess_image(img)
    predicted_class_label, predictions_with_labels = predict_image(model, img_array)
    
    # Calculate the highest confidence percentage
    max_confidence = max([float(conf.strip('%')) for _, conf in predictions_with_labels])
    
    if max_confidence < 45:
        response = {
            'prediction': 'Food allergens not detected',
            'allergen': '0',
            'description': '0',
            'confidence': predictions_with_labels
        }
    else:
        allergen = allergen_info[predicted_class_label]['allergen']
        description = allergen_info[predicted_class_label]['description']
        response = {
            'prediction': predicted_class_label,
            'allergen': allergen,
            'description': description,
            'confidence': predictions_with_labels
        }
    
    return jsonify(response)
if __name__ == '__main__':
    app.run(debug=True)

