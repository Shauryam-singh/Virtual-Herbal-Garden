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

# Correct the label if wrong
def correct_label(predicted_label, image_path):
    print(f"The predicted label is '{predicted_label}'.")
    correct = input("Is this correct? (yes/no): ").strip().lower()
    
    if correct == 'no':
        new_label = input("Enter the correct plant name: ").strip()
        # Save corrected image with new label in the dataset
        corrected_image_path = os.path.join('data/corrected_images/', new_label + '.jpg')
        if not os.path.exists('data/corrected_images/'):
            os.makedirs('data/corrected_images/')
        cv2.imwrite(corrected_image_path, cv2.imread(image_path))
        print(f"Image saved as '{new_label}.jpg' in corrected images folder.")
        
        # Optionally, append to dataset for future retraining
        features = extract_features(image_path)
        return features, new_label  # Return corrected features and label for retraining
    else:
        return None, None

# Train model and predict
def train_and_predict_model():
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
    
    print(f"X_train shape: {X_train.shape}")
    print(f"y_train shape: {y_train.shape}")
    
    if X_train.size == 0 or y_train.size == 0:
        raise ValueError("No data collected for training. Check your image directory.")
    
    # Train model (Random Forest)
    rf_model = make_pipeline(StandardScaler(), RandomForestClassifier(n_estimators=100))
    rf_model.fit(X_train, y_train)
    
    # Save model
    joblib.dump(rf_model, 'models/plant_recognition_rf_model.pkl')
    
    # Test prediction and allow user correction
    test_image = r'images.jpeg'  # Replace with actual test image path
    predicted_label = rf_model.predict([extract_features(test_image)])[0]
    
    # Allow user to correct the prediction
    corrected_features, corrected_label = correct_label(predicted_label, test_image)
    
    if corrected_label:
        # If user provided correction, update the dataset
        X_train = np.append(X_train, [corrected_features], axis=0)
        y_train = np.append(y_train, corrected_label)
        
        # Retrain the model with the corrected data
        rf_model.fit(X_train, y_train)
        joblib.dump(rf_model, 'models/plant_recognition_rf_model_updated.pkl')
        print(f"Model retrained and saved with corrected label: {corrected_label}")
    
    return rf_model

# Cross-validation and evaluation
def evaluate_model(rf_model, X_train, y_train):
    cv = LeaveOneOut()
    cv_scores = cross_val_score(rf_model, X_train, y_train, cv=cv)
    print(f"Cross-validation scores: {cv_scores}")

    X_train_split, X_test, y_train_split, y_test = train_test_split(X_train, y_train, test_size=0.2, random_state=42)
    y_pred = rf_model.predict(X_test)
    print(confusion_matrix(y_test, y_pred))
    print(classification_report(y_test, y_pred))

if __name__ == "__main__":
    rf_model = train_and_predict_model()
