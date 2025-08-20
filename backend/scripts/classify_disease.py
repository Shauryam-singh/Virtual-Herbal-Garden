import pickle
import numpy as np
from PIL import Image, UnidentifiedImageError
from skimage.feature import hog
from skimage import color
import io
import json

# Load model
with open("models/crop_disease_model.pkl", "rb") as f:
    model = pickle.load(f)

# Load label encoder
with open("models/label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

# Load label map
with open("data/label_num_to_disease_map.json", "r") as f:
    label_map = json.load(f)

def extract_features_from_bytes(image_bytes, img_size=(128, 128)):
    """
    Extract HOG + color histogram features from an image in bytes.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize(img_size)
    except UnidentifiedImageError:
        raise ValueError("Invalid image file")

    img_array = np.array(img)

    # HOG features
    gray = color.rgb2gray(img_array)
    hog_features = hog(
        gray,
        pixels_per_cell=(16, 16),
        cells_per_block=(2, 2),
        block_norm='L2-Hys'
    )

    # Color histogram features
    hist = np.histogramdd(
        img_array.reshape(-1, 3),
        bins=(8, 8, 8),
        range=((0, 256), (0, 256), (0, 256))
    )[0].flatten()

    # Combine
    features = np.concatenate([hog_features, hist])
    return features

def classify_disease(image_bytes):
    """
    Classifies a crop/plant disease image using HOG + color histogram features.
    """
    features = extract_features_from_bytes(image_bytes).reshape(1, -1)

    # Validate feature length
    if features.shape[1] != model.n_features_in_:
        raise ValueError(f"Invalid image size: expected {model.n_features_in_} features, got {features.shape[1]}")

    # Predict
    prediction = model.predict(features)[0]
    label_id = label_encoder.inverse_transform([prediction])[0]
    disease = label_map.get(str(label_id), "Unknown Disease")
    return disease
