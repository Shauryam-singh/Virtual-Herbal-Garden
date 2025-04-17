import os
import cv2
import numpy as np
import joblib
from skimage.feature import hog
from skimage import color
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def extract_features(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image {image_path}")
    image = cv2.resize(image, (128, 128))
    gray = color.rgb2gray(image)
    hog_features, _ = hog(gray, visualize=True, block_norm='L2-Hys', 
                          pixels_per_cell=(16, 16), cells_per_block=(2, 2))
    hist_features = cv2.calcHist([image], [0, 1, 2], None, 
                                 [8, 8, 8], [0, 256, 0, 256, 0, 256]).flatten()
    return np.concatenate((hog_features, hist_features))

features = []
labels = []

# Load plant images
for plant_folder in os.listdir('data/plant_images'):
    plant_path = os.path.join('data/plant_images', plant_folder)
    for img_file in os.listdir(plant_path):
        img_path = os.path.join(plant_path, img_file)
        try:
            feat = extract_features(img_path)
            features.append(feat)
            labels.append('plant')
        except:
            pass

# Load non-plant images
for img_file in os.listdir('data/not_plant'):
    img_path = os.path.join('data/not_plant', img_file)
    try:
        feat = extract_features(img_path)
        features.append(feat)
        labels.append('not_plant')
    except:
        pass

# Train
X = np.array(features)
y = np.array(labels)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Evaluate
print(classification_report(y_test, clf.predict(X_test)))

# Save
joblib.dump(clf, 'models/is_plant_classifier.pkl')
print("✅ Plant-vs-NotPlant classifier trained and saved.")
