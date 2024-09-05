import cv2
import numpy as np
import joblib
import json
import os
from skimage.feature import hog
from skimage import color

# Load the model (update the path if necessary)
model = joblib.load('models/plant_recognition_best_model.pkl')

# Load plant information
with open('data/plant_info.json', 'r') as f:
    plant_info = json.load(f)

def extract_features(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image not found or could not be loaded: {image_path}")
    image = cv2.resize(image, (128, 128))
    image_gray = color.rgb2gray(image)
    features, _ = hog(image_gray, visualize=True, block_norm='L2-Hys', pixels_per_cell=(16, 16), cells_per_block=(2, 2))
    
    # Extract color histogram features
    hist_features = cv2.calcHist([image], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256]).flatten()
    
    # Combine features
    features = np.concatenate((features, hist_features))
    
    return features

def classify_plant(image_path):
    absolute_path = os.path.abspath(image_path)
    
    if not os.path.isfile(absolute_path):
        print(f"File not found: {absolute_path}")
        return None, 'File not found.'

    image = cv2.imread(absolute_path)
    if image is None:
        print(f"Unable to read the image file: {absolute_path}")
        return None, 'Unable to read image file.'
    
    # Extract and preprocess features
    image_features = extract_features(absolute_path)
    image_features = image_features.reshape(1, -1)  # Reshape for model input

    # Predict with the model
    prediction = model.predict(image_features)
    plant_name = prediction[0]
    
    # Get information about the plant
    info = plant_info.get(plant_name, 'No information available.')

    return plant_name, info

# Example usage
if __name__ == "__main__":
    image_path = 'path_to_your_image.jpg'
    plant_name, info = classify_plant(image_path)
    print(f"Plant Name: {plant_name}")
    print(f"Information: {info}")
