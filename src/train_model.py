
from load_data import train_images, train_labels, valid_images, valid_labels, class_names
from build_model import build_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

train_datagen = ImageDataGenerator(rotation_range=40,
                                   width_shift_range=0.2,
                                   height_shift_range=0.2,
                                   shear_range=0.2,
                                   zoom_range=0.2,
                                   horizontal_flip=True,
                                   fill_mode='nearest')

val_datagen = ImageDataGenerator()

train_generator = train_datagen.flow(train_images, train_labels, batch_size=32)
val_generator = val_datagen.flow(valid_images, valid_labels, batch_size=32)

input_shape = (150, 150, 3)
num_classes = len(class_names)
model = build_model(input_shape, num_classes)

history = model.fit(train_generator,
                    steps_per_epoch=len(train_images) // 32,
                    epochs=25,
                    validation_data=val_generator,
                    validation_steps=len(valid_images) // 32)

model.save('food_allergen_cnn_model.h5')

