import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from flask import Flask, request, render_template, redirect, url_for
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt

# Load the trained model
model_path = 'final_model_after_additional_training.keras'
model = load_model(model_path)

# Load the class indices
class_indices_path = 'class_indices.json'
with open(class_indices_path, 'r') as f:
    class_indices = json.load(f)

# Reverse the class indices dictionary to map index to class label
indices_class = {v: k for k, v in class_indices.items()}

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(416, 416))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

def predict_image(model, img_array):
    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions, axis=1)[0]
    predicted_class_label = indices_class[predicted_class_index]
    return predicted_class_label, predictions[0]


app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)

            img_array = preprocess_image(file_path)
            predicted_class_label, predictions = predict_image(model, img_array)

            return render_template('index.html', 
                                   filename=file.filename,
                                   predicted_class_label=predicted_class_label,
                                   predictions=predictions)
    return render_template('index.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return redirect(url_for('static', filename='uploads/' + filename), code=301)

if __name__ == "__main__":
    app.run(debug=True)

