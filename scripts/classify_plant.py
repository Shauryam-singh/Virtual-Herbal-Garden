import cv2
import numpy as np
import joblib
import json
import os
from skimage.feature import hog
from skimage import color

# Load model
model = joblib.load('models/plant_recognition_model.pkl')

# Load plant information
with open('data/plant_info.json', 'r') as f:
    plant_info = json.load(f)

def extract_features(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image not found or could not be loaded: {image_path}")
    image = cv2.resize(image, (128, 128))
    image_gray = color.rgb2gray(image)
    features, _ = hog(image_gray, visualize=True, block_norm='L2-Hys')
    return features

def get_label_from_filename(filename):
    # Extract the label from the filename; customize as needed
    # Assuming filename format: <plant_name>.jpg
    base_name = os.path.basename(filename)
    label = base_name.split('.')[0]  # Extract the plant name part before the dot
    return label

def classify_plant(image_path):
    absolute_path = os.path.abspath(image_path)
    
    if not os.path.isfile(absolute_path):
        print(f"File not found: {absolute_path}")
        return None, 'File not found.'

    image = cv2.imread(absolute_path)
    if image is None:
        print(f"Unable to read the image file: {absolute_path}")
        return None, 'Unable to read image file.'
    
    image_features = extract_features(absolute_path)
    image_features = image_features.flatten().reshape(1, -1)  # Flatten and reshape for model input

    prediction = model.predict(image_features)
    plant_name = prediction[0]
    
    # Get information about the plant
    info = plant_info.get(plant_name, 'No information available.')

    return plant_name, info
