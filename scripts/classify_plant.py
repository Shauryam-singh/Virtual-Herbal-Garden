import os
import cv2
import numpy as np
import joblib
import json
from skimage.feature import hog
from skimage import color

# Load trained plant recognition model
plant_classifier = joblib.load('models/plant_recognition_rf_model.pkl')

# Load plant info (name → description/details)
with open('data/plant_info.json', 'r') as f:
    plant_info = json.load(f)

def extract_features(image_path):
    """Extract HOG + color histogram features from image"""
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Cannot read image: {image_path}")
    image = cv2.resize(image, (128, 128))
    gray = color.rgb2gray(image)
    hog_features, _ = hog(
        gray, visualize=True, block_norm='L2-Hys',
        pixels_per_cell=(16, 16), cells_per_block=(2, 2)
    )
    hist_features = cv2.calcHist(
        [image], [0, 1, 2], None,
        [8, 8, 8], [0, 256, 0, 256, 0, 256]
    ).flatten()
    return np.concatenate((hog_features, hist_features))

def classify_plant(image_path):
    """Classify image into a plant species"""
    if not os.path.exists(image_path):
        return None, {"info": "❌ File does not exist."}
    
    try:
        features = extract_features(image_path).reshape(1, -1)

        # Predict plant species
        plant_name = plant_classifier.predict(features)[0]

        # Fetch info
        info = plant_info.get(plant_name, {"info": "ℹ️ No information available."})

        return plant_name, info

    except Exception as e:
        return None, {"info": f"⚠️ Error: {str(e)}"}
