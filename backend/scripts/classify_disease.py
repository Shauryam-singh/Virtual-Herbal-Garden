import joblib
import numpy as np
from PIL import Image, UnidentifiedImageError
from skimage.feature import hog
from skimage import color
import io
import json

# Load model (USE JOBLIB)
model = joblib.load("models/crop_disease_model_compressed.pkl")

# Load label encoder (also saved with joblib)
label_encoder = joblib.load("models/label_encoder.pkl")

# Load label map
with open("data/label_num_to_disease_map.json", "r") as f:
    label_map = json.load(f)

def extract_features_from_bytes(image_bytes, img_size=(128, 128)):
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

    # Color histogram
    hist = np.histogramdd(
        img_array.reshape(-1, 3),
        bins=(8, 8, 8),
        range=((0, 256), (0, 256), (0, 256))
    )[0].flatten()

    # Mean + Std color (IMPORTANT — match training)
    mean_std = np.concatenate([
        img_array.mean(axis=(0, 1)),
        img_array.std(axis=(0, 1))
    ])

    features = np.concatenate([hog_features, hist, mean_std])
    return features

def classify_disease(image_bytes):
    features = extract_features_from_bytes(image_bytes).reshape(1, -1)

    if features.shape[1] != model.n_features_in_:
        raise ValueError(
            f"Invalid image size: expected {model.n_features_in_} features, got {features.shape[1]}"
        )

    prediction = model.predict(features)[0]
    label_id = label_encoder.inverse_transform([prediction])[0]

    disease = label_map.get(str(label_id), "Unknown Disease")

    return disease