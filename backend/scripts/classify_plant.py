import cv2
import numpy as np
import joblib
from skimage.feature import hog
from skimage import color
import io

plant_classifier = joblib.load('models/plant_model_compressed.pkl')

def extract_features_from_bytes(file_bytes):
    image = cv2.imdecode(np.frombuffer(file_bytes, np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Cannot read image bytes")
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

def classify_plant(file_bytes):
    features = extract_features_from_bytes(file_bytes).reshape(1, -1)
    plant_name = plant_classifier.predict(features)[0]
    return plant_name, {}
