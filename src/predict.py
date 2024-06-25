
import numpy as np
from tensorflow.keras.models import load_model
from load_data import load_and_preprocess_image, class_names

model = load_model('food_allergen_cnn_model.h5')

def predict_image(image_path, model, class_names):
    img = load_and_preprocess_image(image_path)
    img = np.expand_dims(img, axis=0)
    prediction = model.predict(img)
    class_index = np.argmax(prediction)
    class_name = class_names[class_index]
    return class_name

image_path = 'path/to/some/image.jpg'
predicted_class = predict_image(image_path, model, class_names)
print(f'Predicted class: {predicted_class}')

