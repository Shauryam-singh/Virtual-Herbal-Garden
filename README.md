# 🌿 Healthify - Virtual Herbal Garden

Healthify is a web-based platform that allows users to **identify plants**, **explore plant information**, **take plant quizzes**, and **get disease & treatment recommendations** using AI-driven plant recognition and interactive tools.

---

## 🚀 Features

- **Plant Identification**  
  Upload an image of a plant, and Healthify will classify it and provide detailed information.

- **Plant Search**  
  Search for plants by name or keywords and get scientific info, habitat, and images.

- **Virtual Plant Quiz**  
  Test your knowledge about plants with dynamically generated quiz questions.

- **Disease & Treatment Recommendations**  
  Enter symptoms or disease names and get recommended natural remedies using plants.

- **Responsive & Interactive UI**  
  Built with **Flask API + React (Vite + TS)** for a modern, responsive experience.

---

## 🛠️ Technology Stack

- **Backend:** Python, Flask  
- **Machine Learning:** Scikit-learn, HOG features, Random Forest classifier  
- **Frontend:** React (Vite + TypeScript), TailwindCSS  
- **Database:** JSON files for plant info and diseases  
- **File Storage:** Local filesystem for plant images  

---

## ⚡ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Shauryam-singh/Virtual-Herbal-Garden.git

cd Virtual-Herbal-Garden
```

### 2️⃣ Backend Setup
```bash
cd backend

python -m venv venv

source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows

pip install -r requirements.txt

python app.py
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend

npm install

npm run dev
```

---

## 📌 Usage
- Plant Identification → Upload an image via the “Upload Image” button.
- Search → Use the search bar to quickly find plant info.
- Quiz → Test your plant knowledge with quizzes.
- Disease Treatment → Enter symptoms/disease names to get remedies.

---

## 🔮 Future Improvements
AI-based disease recognition directly from uploaded leaf images.

Offline mode with PWA support.

Expanded dataset with more plant varieties.

---

### 📜 License
This project is licensed under the MIT License.