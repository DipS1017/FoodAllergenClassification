import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
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

# Path to the input image
img_path = 'images3.jpeg'

# Preprocess the image
img_array = preprocess_image(img_path)

# Make prediction
predicted_class_label, predictions = predict_image(model, img_array)

# Print the results
print(f"Predicted Class: {predicted_class_label}")
print(f"Prediction Confidence: {predictions}")

# Plot the image and the prediction
plt.imshow(image.load_img(img_path))
plt.title(f"Predicted: {predicted_class_label}")
plt.axis('off')
plt.show()
