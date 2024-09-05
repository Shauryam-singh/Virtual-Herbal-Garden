import os
import cv2
import numpy as np
import joblib
from skimage.feature import hog
from skimage import color
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import LeaveOneOut, GridSearchCV, train_test_split, cross_val_score
from sklearn.metrics import confusion_matrix, classification_report

def extract_features(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image not found or could not be loaded: {image_path}")
    image = cv2.resize(image, (128, 128))
    
    # Convert to grayscale for HOG
    image_gray = color.rgb2gray(image)
    hog_features, _ = hog(image_gray, visualize=True, block_norm='L2-Hys', pixels_per_cell=(16, 16), cells_per_block=(2, 2))
    
    # Extract color histogram features
    hist_features = cv2.calcHist([image], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256]).flatten()
    
    # Combine features
    features = np.concatenate((hog_features, hist_features))
    
    return features

def get_label_from_filename(filename):
    # Extract the label from the filename; customize as needed
    base_name = os.path.basename(filename)
    label = base_name.split('.')[0]  # Extract the plant name part before the dot
    return label

# Load data
data_dir = 'data/plant_images/'
if not os.path.exists(data_dir):
    raise FileNotFoundError(f"Data directory not found: {data_dir}")

X_train = []
y_train = []

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

# Use Leave-One-Out Cross-Validation (LOOCV)
cv = LeaveOneOut()

# Create pipeline for SVC
pipeline = make_pipeline(StandardScaler(), SVC())

# Define parameter grid for GridSearchCV
param_grid = {
    'svc__C': [0.1, 1, 10],
    'svc__gamma': ['scale', 'auto'],
    'svc__kernel': ['linear', 'rbf']
}

# Grid search with LOOCV
grid_search = GridSearchCV(pipeline, param_grid, cv=cv, verbose=3)
grid_search.fit(X_train, y_train)

# Best model from GridSearchCV
best_model = grid_search.best_estimator_
joblib.dump(best_model, 'models/plant_recognition_best_model.pkl')

# Create and train Random Forest model
rf_model = make_pipeline(StandardScaler(), RandomForestClassifier(n_estimators=100))
rf_model.fit(X_train, y_train)

# Save Random Forest model
joblib.dump(rf_model, 'models/plant_recognition_rf_model.pkl')

# Cross-validation for Random Forest
cv_scores = cross_val_score(rf_model, X_train, y_train, cv=cv)
print(f"Cross-validation scores: {cv_scores}")

# Split data into training and testing sets for evaluation
X_train_split, X_test, y_train_split, y_test = train_test_split(X_train, y_train, test_size=0.2, random_state=42)

# Predictions and confusion matrix for Random Forest
y_pred = rf_model.predict(X_test)
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))
