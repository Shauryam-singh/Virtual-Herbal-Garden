# 🌿 Healthify - Virtual Herbal Garden

Healthify is a web-based platform that allows users to **identify plants**, **explore plant information**, **take plant quizzes**, and **get disease & treatment recommendations** using AI-driven plant recognition and interactive tools.

---

## Features

- **Plant Identification**  
  Upload an image of a plant, and Healthify will classify it and provide detailed information.

- **Plant Search**  
  Search for plants by name or keywords and get scientific info, habitat, and images.

- **Virtual Plant Quiz**  
  Test your knowledge about plants with dynamically generated quiz questions.

- **Disease & Treatment Recommendations**  
  Enter symptoms or disease names and get recommended natural remedies using plants.

- **Responsive & Interactive UI**  
  Built with modern HTML, CSS, and JavaScript, fully responsive across devices.

---

## Screenshots

![Home](screenshots/home.png)  
*Home page with plant search and upload options.*

![Quiz](screenshots/quiz.png)  
*Interactive plant quiz feature.*

![Disease & Treatment](screenshots/disease_treatment.png)  
*Enter symptoms to get plant-based treatment recommendations.*

---

## Technology Stack

- **Backend:** Python, Flask  
- **Machine Learning:** Scikit-learn, HOG features, Random Forest classifier  
- **Frontend:** HTML5, CSS3, JavaScript  
- **Database:** JSON files for plant info and diseases  
- **File Storage:** Local filesystem for plant images  

---

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/Shauryam-singh/Virtual-Herbal-Garden.git
cd Virtual-Herbal-Garden
```
2. **Create a virtual environment**
```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the application**
```bash
python app.py
```

---

## Usage

- Plant Identification: Upload an image via the “Upload Image” button to identify the plant.
- Search: Use the search bar to find plant information quickly.
- Quiz: Test your plant knowledge through the quiz.
- Disease Treatment: Enter symptoms to get recommended plant-based remedies.

## Future Improvements

- AI-based disease recognition from uploaded leaf images.
- Mobile-friendly UI enhancements for better responsiveness.

---

## License

This project is licensed under the MIT License.