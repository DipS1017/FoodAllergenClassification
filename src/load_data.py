
import os
import csv
import numpy as np
import tensorflow as tf

def load_annotations(csv_path):
    annotations = []
    with open(csv_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            annotations.append(row)
    return annotations

def load_and_preprocess_image(image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(150, 150))
    img = tf.keras.preprocessing.image.img_to_array(img)
    img = img / 255.0
    return img

def load_dataset(annotations, directory):
    images = []
    labels = []
    for annotation in annotations:
        image_path = os.path.join(directory, annotation['filename'])
        if os.path.exists(image_path):
            img = load_and_preprocess_image(image_path)
            images.append(img)
            labels.append(annotation['class'])
    images = np.array(images)
    return images, labels

def encode_labels(labels):
    class_names = np.unique(labels)
    class_dict = {class_name: index for index, class_name in enumerate(class_names)}
    encoded_labels = np.array([class_dict[label] for label in labels])
    return encoded_labels, class_names

base_dir = 'dataset'
train_dir = os.path.join(base_dir, 'train')
test_dir = os.path.join(base_dir, 'test')
valid_dir = os.path.join(base_dir, 'valid')

train_annotations = load_annotations(os.path.join(train_dir, '_annotations.csv'))
test_annotations = load_annotations(os.path.join(test_dir, '_annotations.csv'))
valid_annotations = load_annotations(os.path.join(valid_dir, '_annotations.csv'))

train_images, train_labels = load_dataset(train_annotations, train_dir)
test_images, test_labels = load_dataset(test_annotations, test_dir)
valid_images, valid_labels = load_dataset(valid_annotations, valid_dir)

train_labels, class_names = encode_labels(train_labels)
test_labels, _ = encode_labels(test_labels)
valid_labels, _ = encode_labels(valid_labels)

train_labels = tf.keras.utils.to_categorical(train_labels, num_classes=len(class_names))
test_labels = tf.keras.utils.to_categorical(test_labels, num_classes=len(class_names))
valid_labels = tf.keras.utils.to_categorical(valid_labels, num_classes=len(class_names))
