
from tensorflow.keras.models import load_model
from load_data import test_images, test_labels
from tensorflow.keras.preprocessing.image import ImageDataGenerator

model = load_model('food_allergen_cnn_model.h5')

test_datagen = ImageDataGenerator()
test_generator = test_datagen.flow(test_images, test_labels, batch_size=32)

test_loss, test_acc = model.evaluate(test_generator, steps=len(test_images) // 32)
print(f'Test accuracy: {test_acc}')

