import os
import csv
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.utils import to_categorical
from tensorflow.keras import layers, models, Input
import tensorflow as tf
import matplotlib.pyplot as plt

def load_annotations(csv_path):
    print(f"Loading annotations from {csv_path}")
    annotations = []
    with open(csv_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            annotations.append(row)
    print(f"Loaded {len(annotations)} annotations from {csv_path}")
    return annotations

def load_and_preprocess_image(image_path, target_size=(150, 150)):
    try:
        img = load_img(image_path, target_size=target_size)
        img = img_to_array(img)
        img = img / 255.0
        return img
    except Exception as e:
        print(f"Error loading image {image_path}: {e}")
        return None

class CustomDataGenerator(tf.keras.utils.Sequence):
    def __init__(self, annotations, directory, batch_size, target_size=(150, 150), shuffle=True):
        self.annotations = annotations
        self.directory = directory
        self.batch_size = batch_size
        self.target_size = target_size
        self.shuffle = shuffle
        self.class_indices = self._get_class_indices()
        self.n_classes = len(self.class_indices)
        self.on_epoch_end()

    def __len__(self):
        return int(np.floor(len(self.annotations) / float(self.batch_size)))

    def __getitem__(self, idx):
        indexes = self.indexes[idx * self.batch_size:(idx + 1) * self.batch_size]
        batch_annotations = [self.annotations[i] for i in indexes]

        X, y = [], []
        for ann in batch_annotations:
            img_path = os.path.join(self.directory, ann['filename'])
            img = load_and_preprocess_image(img_path, self.target_size)
            if img is not None:
                X.append(img)
                y.append(self.class_indices[ann['class']])

        return np.array(X), to_categorical(y, num_classes=self.n_classes)

    def on_epoch_end(self):
        self.indexes = np.arange(len(self.annotations))
        if self.shuffle:
            np.random.shuffle(self.indexes)

    def _get_class_indices(self):
        classes = sorted(list(set(ann['class'] for ann in self.annotations)))
        return {cls: i for i, cls in enumerate(classes)}

# Set up paths
base_dir = os.path.join(os.path.dirname(__file__), '..', 'dataset')
train_dir = os.path.join(base_dir, 'train')
test_dir = os.path.join(base_dir, 'test')
valid_dir = os.path.join(base_dir, 'valid')

# Load annotations
train_annotations = load_annotations(os.path.join(train_dir, '_annotations.csv'))
test_annotations = load_annotations(os.path.join(test_dir, '_annotations.csv'))
valid_annotations = load_annotations(os.path.join(valid_dir, '_annotations.csv'))

# Create custom data generators
batch_size = 32
train_generator = CustomDataGenerator(train_annotations, train_dir, batch_size)
valid_generator = CustomDataGenerator(valid_annotations, valid_dir, batch_size)
test_generator = CustomDataGenerator(test_annotations, test_dir, batch_size)

# Print some information
print(f"Number of training samples: {len(train_generator.annotations)}")
print(f"Number of validation samples: {len(valid_generator.annotations)}")
print(f"Number of test samples: {len(test_generator.annotations)}")
print(f"Number of classes: {train_generator.n_classes}")
print(f"Class indices: {train_generator.class_indices}")

# Define the model
inputs = Input(shape=(150, 150, 3))
x = layers.Conv2D(32, (3, 3), activation='relu')(inputs)
x = layers.MaxPooling2D((2, 2))(x)
x = layers.Conv2D(64, (3, 3), activation='relu')(x)
x = layers.MaxPooling2D((2, 2))(x)
x = layers.Conv2D(128, (3, 3), activation='relu')(x)
x = layers.MaxPooling2D((2, 2))(x)
x = layers.Flatten()(x)
x = layers.Dense(128, activation='relu')(x)
outputs = layers.Dense(train_generator.n_classes, activation='softmax')(x)

model = models.Model(inputs=inputs, outputs=outputs)

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
try:
    history = model.fit(
        train_generator,
        epochs=10,
        validation_data=valid_generator
    )

    # Evaluate the model
    test_loss, test_acc = model.evaluate(test_generator)
    print(f"Test accuracy: {test_acc}")

    # Optional: Save the model
    model.save('food_allergen_model.h5')

    # Plot training history
    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()

    plt.tight_layout()
    plt.show()

except Exception as e:
    print(f"An error occurred during training: {e}")
