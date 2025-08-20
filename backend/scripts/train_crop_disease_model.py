import os
import pickle
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
import json

IMG_DIR = "data/train_images"
CSV_PATH = "data/train.csv"
LABEL_MAP_PATH = "data/label_num_to_disease_map.json"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_csv(CSV_PATH)
print("✅ CSV loaded. Shape:", df.shape)

df = df[df["image_id"].apply(lambda x: os.path.isfile(os.path.join(IMG_DIR, x)))].reset_index(drop=True)
print(f"✅ Remaining images: {len(df)}")
df.to_csv(CSV_PATH, index=False)

with open(LABEL_MAP_PATH, "r") as f:
    label_map = json.load(f)

def extract_features(image_path, img_size=(128, 128)):
    img = Image.open(image_path).convert("RGB").resize(img_size)
    img_array = np.array(img)

    gray = color.rgb2gray(img_array)
    hog_features = hog(
        gray,
        pixels_per_cell=(16, 16),
        cells_per_block=(2, 2),
        block_norm='L2-Hys'
    )

    hist = np.histogramdd(
        img_array.reshape(-1, 3),
        bins=(8, 8, 8),
        range=((0, 256), (0, 256), (0, 256))
    )[0].flatten()

    return np.concatenate([hog_features, hist])

data = []
labels = []
for idx, row in df.iterrows():
    img_path = os.path.join(IMG_DIR, row["image_id"])
    try:
        features = extract_features(img_path)
        data.append(features)
        labels.append(row["label"])
    except Exception as e:
        print(f"❌ Error processing {img_path}: {e}")

X = np.array(data, dtype=np.float32)
y = np.array(labels)
print(f"✅ Features shape: {X.shape}, Labels shape: {y.shape}")

le = LabelEncoder()
y_encoded = le.fit_transform(y)
with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "wb") as f:
    pickle.dump(le, f)

df_features = pd.DataFrame(X)
df_features['label'] = y_encoded

balanced_dfs = []
max_samples = df_features['label'].value_counts().max()

for label in df_features['label'].unique():
    df_class = df_features[df_features['label'] == label]
    df_upsampled = resample(df_class,
                            replace=True,
                            n_samples=max_samples,
                            random_state=42)
    balanced_dfs.append(df_upsampled)

df_balanced = pd.concat(balanced_dfs).sample(frac=1, random_state=42).reset_index(drop=True)  # shuffle
X_balanced = df_balanced.drop('label', axis=1).values
y_balanced = df_balanced['label'].values
print(f"✅ Balanced dataset: {X_balanced.shape}, {y_balanced.shape}")

X_train, X_test, y_train, y_test = train_test_split(
    X_balanced, y_balanced, test_size=0.2, random_state=42, stratify=y_balanced
)

clf = RandomForestClassifier(
    n_estimators=700,
    max_depth=None,
    random_state=42,
    n_jobs=-1,
    class_weight='balanced'
)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print("✅ Accuracy:", accuracy_score(y_test, y_pred))
print("✅ Classification Report:\n", classification_report(
    y_test, y_pred,
    target_names=[label_map[str(i)] for i in sorted(label_map.keys(), key=int)]
))

MODEL_FILE = os.path.join(MODEL_DIR, "crop_disease_model.pkl")
with open(MODEL_FILE, "wb") as f:
    pickle.dump(clf, f)
print(f"✅ Model saved to {MODEL_FILE}")