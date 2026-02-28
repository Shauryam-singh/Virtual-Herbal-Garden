import os
import json
import joblib
import numpy as np
import pandas as pd
from PIL import Image
from skimage.feature import hog
from skimage import color
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
from sklearn.utils import resample

# =========================
# Paths
# =========================
IMG_DIR = "data/train_images"
CSV_PATH = "data/train.csv"
LABEL_MAP_PATH = "data/label_num_to_disease_map.json"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# =========================
# Load Dataset
# =========================
df = pd.read_csv(CSV_PATH)
df = df[df["image_id"].apply(lambda x: os.path.isfile(os.path.join(IMG_DIR, x)))].reset_index(drop=True)

with open(LABEL_MAP_PATH, "r") as f:
    label_map = json.load(f)

print("✅ Total valid images:", len(df))

# =========================
# Feature Extraction
# =========================
def extract_features(image_path, img_size=(128, 128)):
    img = Image.open(image_path).convert("RGB").resize(img_size)
    img_array = np.array(img)

    # HOG Features
    gray = color.rgb2gray(img_array)
    hog_features = hog(
        gray,
        pixels_per_cell=(16, 16),
        cells_per_block=(2, 2),
        block_norm="L2-Hys"
    )

    # RGB Histogram
    hist = np.histogramdd(
        img_array.reshape(-1, 3),
        bins=(8, 8, 8),
        range=((0, 256), (0, 256), (0, 256))
    )[0].flatten()

    # Mean + Std color
    mean_std = np.concatenate([
        img_array.mean(axis=(0, 1)),
        img_array.std(axis=(0, 1))
    ])

    return np.concatenate([hog_features, hist, mean_std])

# =========================
# Build Feature Matrix
# =========================
print("🔄 Extracting features...")

data = []
labels = []

for _, row in df.iterrows():
    path = os.path.join(IMG_DIR, row["image_id"])
    try:
        data.append(extract_features(path))
        labels.append(row["label"])
    except Exception as e:
        print(f"Skipping {path}: {e}")

X = np.array(data, dtype=np.float32)
y = np.array(labels)

print("Feature shape:", X.shape)

# =========================
# Encode Labels
# =========================
le = LabelEncoder()
y_encoded = le.fit_transform(y)

joblib.dump(le, os.path.join(MODEL_DIR, "label_encoder.pkl"))

# =========================
# Train-Test Split (BEFORE BALANCING)
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

print("Train size:", X_train.shape)
print("Test size:", X_test.shape)

# =========================
# Balance ONLY Training Set
# =========================
train_df = pd.DataFrame(X_train)
train_df["label"] = y_train

max_count = train_df["label"].value_counts().max()

balanced_parts = []
for label in train_df["label"].unique():
    class_df = train_df[train_df["label"] == label]
    resampled_df = resample(
        class_df,
        replace=True,
        n_samples=max_count,
        random_state=42
    )
    balanced_parts.append(resampled_df)

train_balanced = pd.concat(balanced_parts).sample(frac=1, random_state=42)

X_train_bal = train_balanced.drop("label", axis=1).values
y_train_bal = train_balanced["label"].values

print("Balanced training size:", X_train_bal.shape)

# =========================
# Train Random Forest
# =========================
clf = RandomForestClassifier(
    n_estimators=200,
    max_depth=30,
    min_samples_split=4,
    min_samples_leaf=2,
    max_features="sqrt",
    bootstrap=True,
    random_state=42,
    n_jobs=-1
)

print("🚀 Training model...")
clf.fit(X_train_bal, y_train_bal)

# =========================
# Evaluate (Realistic Evaluation)
# =========================
y_pred = clf.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("\n✅ Final Accuracy:", accuracy)

unique_labels = np.unique(y_test)
class_names = [str(name) for name in le.inverse_transform(unique_labels)]

print("\n✅ Classification Report:\n")
print(classification_report(
    y_test,
    y_pred,
    labels=unique_labels,
    target_names=class_names
))

# =========================
# Save Model
# =========================
MODEL_FILE = os.path.join(MODEL_DIR, "crop_disease_model_compressed.pkl")
joblib.dump(clf, MODEL_FILE, compress=9)

size_mb = os.path.getsize(MODEL_FILE) / (1024 * 1024)

print("\n💾 Model saved at:", MODEL_FILE)
print(f"📦 Model size: {size_mb:.2f} MB")