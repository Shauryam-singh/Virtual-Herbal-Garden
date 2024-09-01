from skimage.feature import hog
from skimage import color
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
import joblib
import os
import cv2
import numpy as np

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

# Prepare training data
X_train = []
y_train = []

data_dir = 'data/plant_images/'
if not os.path.exists(data_dir):
    raise FileNotFoundError(f"Data directory not found: {data_dir}")

for image_file in os.listdir(data_dir):
    image_path = os.path.join(data_dir, image_file)
    try:
        features = extract_features(image_path)
        if features.size > 0:  # Ensure non-empty features
            label = get_label_from_filename(image_file)
            X_train.append(features)
            y_train.append(label)
    except ValueError as e:
        print(e)

# Convert to numpy arrays
X_train = np.array(X_train)
y_train = np.array(y_train)

print(f"X_train shape: {X_train.shape}")  # Debugging line
print(f"y_train shape: {y_train.shape}")  # Debugging line

# Check if data was collected
if X_train.size == 0 or y_train.size == 0:
    raise ValueError("No data collected for training. Check your image directory.")

# Train SVM model
model = make_pipeline(StandardScaler(), SVC())
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'models/plant_recognition_model.pkl')
