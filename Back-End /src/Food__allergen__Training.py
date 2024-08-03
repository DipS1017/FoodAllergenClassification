
import os
import json
import tensorflow as tf
import pandas as pd
import numpy as np
from PIL import Image
from tensorflow.keras.utils import Sequence
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Define the correct class indices
class_indices = {
    'egg': 0, 'whole_egg_boiled': 1, 'milk': 2, 'icecream': 3, 'cheese': 4,
    'milk_based_beverage': 5, 'chocolate': 6, 'non_milk_based_beverage': 7,
    'cooked_meat': 8, 'raw_meat': 9, 'alcohol': 10, 'alcohol_glass': 11,
    'spinach': 12, 'avocado': 13, 'eggplant': 14, 'blueberry': 15,
    'blackberry': 16, 'strawberry': 17, 'pineapple': 18, 'capsicum': 19,
    'mushroom': 20, 'dates': 21, 'almond': 22, 'pistachio': 23, 'tomato': 24,
    'roti': 25, 'pasta': 26, 'bread': 27, 'bread_loaf': 28, 'pizza': 29
}

# Function to load annotations
def load_annotations(annotation_file):
    annotations = pd.read_csv(annotation_file)
    annotations['class'] = annotations['class'].apply(lambda x: x.strip().lower().replace(' ', '_'))
    return annotations.to_dict('records')

# Load annotations
train_annotations = load_annotations('../dataset/train/_annotations.csv')
valid_annotations = load_annotations('../dataset/valid/_annotations.csv')

# Custom data generator
class CustomDataGenerator(Sequence):
    def __init__(self, annotations, image_dir, batch_size, augment=False, class_indices=None):
        self.annotations = annotations
        self.image_dir = image_dir
        self.batch_size = batch_size
        self.augment = augment
        self.class_indices = class_indices
        self.n_classes = len(class_indices)
        self.datagen = ImageDataGenerator(
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.15,  # Horizontal shear
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest'
        ) if self.augment else None

    def __len__(self):
        return int(np.ceil(len(self.annotations) / self.batch_size))

    def __getitem__(self, index):
        batch_annotations = self.annotations[index * self.batch_size:(index + 1) * self.batch_size]
        images = []
        labels = []
        for annotation in batch_annotations:
            image_path = os.path.join(self.image_dir, annotation['filename'])
            image = Image.open(image_path).convert('RGB')
            image = image.resize((416, 416))
            image = np.array(image) / 255.0
            images.append(image)
            labels.append(self.class_indices[annotation['class']])
        images = np.array(images)
        labels = tf.keras.utils.to_categorical(labels, num_classes=self.n_classes)
        
        if self.augment:
            augmented_data = self.datagen.flow(images, labels, batch_size=self.batch_size)
            images, labels = next(augmented_data)

            # Additional rotations
            for i in range(images.shape[0]):
                if np.random.rand() < 0.25:
                    images[i] = np.rot90(images[i], 1)
                elif np.random.rand() < 0.25:
                    images[i] = np.rot90(images[i], 2)
                elif np.random.rand() < 0.25:
                    images[i] = np.rot90(images[i], 3)
                
        return images, labels

    def on_epoch_end(self):
        np.random.shuffle(self.annotations)

# Paths
train_dir = '../dataset/train'
valid_dir = '../dataset/valid'

# Create custom data generators
batch_size = 32  # Increased batch size to manage memory
train_generator = CustomDataGenerator(train_annotations, train_dir, batch_size, augment=True, class_indices=class_indices)
valid_generator = CustomDataGenerator(valid_annotations, valid_dir, batch_size, class_indices=class_indices)

# Print some information
print(f"Number of training samples: {len(train_generator.annotations)}")
print(f"Number of validation samples: {len(valid_generator.annotations)}")
print(f"Number of classes: {train_generator.n_classes}")
print(f"Class indices: {train_generator.class_indices}")

# Define the custom CNN model
class CustomCNN(tf.keras.Model):
    def __init__(self, num_classes):
        super(CustomCNN, self).__init__()
        self.conv1 = tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same')
        self.bn1 = tf.keras.layers.BatchNormalization()
        self.pool1 = tf.keras.layers.MaxPooling2D((2, 2))
        
        self.conv2 = tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same')
        self.bn2 = tf.keras.layers.BatchNormalization()
        self.pool2 = tf.keras.layers.MaxPooling2D((2, 2))
        
        self.conv3 = tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same')
        self.bn3 = tf.keras.layers.BatchNormalization()
        self.pool3 = tf.keras.layers.MaxPooling2D((2, 2))
        
        self.conv4 = tf.keras.layers.Conv2D(256, (3, 3), activation='relu', padding='same')
        self.bn4 = tf.keras.layers.BatchNormalization()
        self.pool4 = tf.keras.layers.MaxPooling2D((2, 2))
        
        self.conv5 = tf.keras.layers.Conv2D(512, (3, 3), activation='relu', padding='same')
        self.bn5 = tf.keras.layers.BatchNormalization()
        self.pool5 = tf.keras.layers.MaxPooling2D((2, 2))
        
        self.gap = tf.keras.layers.GlobalAveragePooling2D()
        self.dense1 = tf.keras.layers.Dense(128, activation='relu')
        self.bn6 = tf.keras.layers.BatchNormalization()
        self.dropout = tf.keras.layers.Dropout(0.5)
        self.outputs = tf.keras.layers.Dense(num_classes, activation='softmax')
    
    def call(self, inputs, training=False):
        x = self.conv1(inputs)
        x = self.bn1(x, training=training)
        x = self.pool1(x)
        
        x = self.conv2(x)
        x = self.bn2(x, training=training)
        x = self.pool2(x)
        
        x = self.conv3(x)
        x = self.bn3(x, training=training)
        x = self.pool3(x)
        
        x = self.conv4(x)
        x = self.bn4(x, training=training)
        x = self.pool4(x)
        
        x = self.conv5(x)
        x = self.bn5(x, training=training)
        x = self.pool5(x)
        
        x = self.gap(x)
        x = self.dense1(x)
        x = self.bn6(x, training=training)
        x = self.dropout(x, training=training)
        return self.outputs(x)

# Create the model
model = CustomCNN(num_classes=train_generator.n_classes)

# Compile the model
optimizer = tf.keras.optimizers.Adam(learning_rate=0.0001)
model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])

# Add callbacks
reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=0.00001)
early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
model_checkpoint = tf.keras.callbacks.ModelCheckpoint('food_allergen_model_epoch_{epoch:02d}_val_acc_{val_accuracy:.2f}.keras', 
                                   save_best_only=True, 
                                   monitor='val_accuracy', 
                                   mode='max')

# Custom training loop
@tf.function
def train_step(images, labels):
    with tf.GradientTape() as tape:
        predictions = model(images, training=True)
        loss = tf.keras.losses.categorical_crossentropy(labels, predictions)
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))
    return loss, predictions

@tf.function
def valid_step(images, labels):
    predictions = model(images, training=False)
    loss = tf.keras.losses.categorical_crossentropy(labels, predictions)
    return loss, predictions

# Training loop
for epoch in range(20):
    print(f'Epoch {epoch+1}/{20}')
    
    # Training
    for batch_idx, (images, labels) in enumerate(train_generator):
        train_loss, train_predictions = train_step(images, labels)
        if batch_idx % 10 == 0:
            print(f'Batch {batch_idx}, Loss: {tf.reduce_mean(train_loss).numpy()}')

    # Validation
    valid_loss = []
    for batch_idx, (images, labels) in enumerate(valid_generator):
        loss, _ = valid_step(images, labels)
        valid_loss.append(tf.reduce_mean(loss).numpy())

    avg_valid_loss = np.mean(valid_loss)
    print(f'Validation Loss: {avg_valid_loss}')

# Save the final model
model.save('final_model_after_training.keras')

# Save the class indices
with open('class_indices.json', 'w') as f:
    json.dump(train_generator.class_indices, f)

