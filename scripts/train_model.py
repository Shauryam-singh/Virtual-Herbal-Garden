import os
import cv2
import numpy as np
import joblib
from skimage.feature import hog
from skimage import color
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

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

# Load plant images (per class = folder name)
train_root = "data/Train_Set_Folder"
for plant_folder in os.listdir(train_root):
    plant_path = os.path.join(train_root, plant_folder)
    if not os.path.isdir(plant_path):
        continue
    for img_file in os.listdir(plant_path):
        img_path = os.path.join(plant_path, img_file)
        try:
            feat = extract_features(img_path)
            features.append(feat)
            labels.append(plant_folder)   # 🔥 label by folder name
        except Exception as e:
            print(f"Skipping {img_path}: {e}")

X = np.array(features)
y = np.array(labels)

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Model
clf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
clf.fit(X_train, y_train)

# Accuracy
y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"✅ Test Accuracy: {acc:.4f}\n")

print("📊 Classification Report:")
print(classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred, labels=clf.classes_)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=clf.classes_, yticklabels=clf.classes_)
plt.xlabel("Predicted")
plt.ylabel("True")
plt.title("Confusion Matrix")
plt.show()

# Cross-validation
# cv_scores = cross_val_score(clf, X, y, cv=5)
# print(f"🔄 Cross-validation mean accuracy: {cv_scores.mean():.4f}")

# Save model
os.makedirs("models", exist_ok=True)
joblib.dump(clf, "models/plant_recognition_rf_model.pkl")
print("✅ Multi-class plant recognition model trained and saved.")
