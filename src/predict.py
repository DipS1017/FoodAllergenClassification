
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

def load_and_preprocess_image(image_path, target_size=(150, 150)):
    img = load_img(image_path, target_size=target_size)
    img = img_to_array(img)
    img = img / 255.0
    return np.expand_dims(img, axis=0)  # Add batch dimension

def predict_image(model, image_path, class_indices):
    preprocessed_image = load_and_preprocess_image(image_path)
    prediction = model.predict(preprocessed_image)
    predicted_class_index = np.argmax(prediction, axis=1)[0]
    
    # Invert the class_indices dictionary
    index_to_class = {v: k for k, v in class_indices.items()}
    predicted_class = index_to_class[predicted_class_index]
    
    confidence = prediction[0][predicted_class_index]
    return predicted_class, confidence

# Load the trained model
model_path = 'food_allergen_model.h5'
model = load_model(model_path)

# Define the class indices (make sure this matches your training data)
class_indices = {
    'alcohol': 0, 'alcohol_glass': 1, 'almond': 2, 'avocado': 3, 'blackberry': 4,
    'blueberry': 5, 'bread': 6, 'bread_loaf': 7, 'capsicum': 8, 'cheese': 9,
    'chocolate': 10, 'cooked_meat': 11, 'dates': 12, 'egg': 13, 'eggplant': 14,
    'icecream': 15, 'milk': 16, 'milk_based_beverage': 17, 'mushroom': 18,
    'non_milk_based_beverage': 19, 'pasta': 20, 'pineapple': 21, 'pistachio': 22,
    'pizza': 23, 'raw_meat': 24, 'roti': 25, 'spinach': 26, 'strawberry': 27,
    'tomato': 28, 'whole_egg_boiled': 29
}

# Path to the image you want to predict
image_path = '12.jpg'  # Replace with the path to your image

# Make prediction
predicted_class, confidence = predict_image(model, image_path, class_indices)

print(f"Predicted class: {predicted_class}")
print(f"Confidence: {confidence:.2f}")

