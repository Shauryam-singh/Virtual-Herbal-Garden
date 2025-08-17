import base64
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from scripts.classify_plant import classify_plant
import json
import random
import os

app = Flask(__name__)
CORS(app) 

with open('data/plant_info.json', 'r') as f:
    plant_info = json.load(f)

with open('data/diseases.json', 'r') as f:
    disease_data = json.load(f)

quiz_questions = []
def generate_questions(plant_info):
    global quiz_questions
    quiz_questions = []

    for idx, (plant, info) in enumerate(plant_info.items()):
        question = {
            "id": idx,
            "question": f"What is {plant.replace('_', ' ')} known for?",
            "options": [info['info']] + random.sample(
                [i['info'] for k, i in plant_info.items() if k != plant], 3
            ),
            "answer": info['info']
        }
        random.shuffle(question["options"])
        quiz_questions.append(question)

@app.route('/api/search')
def search():
    query = request.args.get('q', '').lower().replace("_", " ").strip()
    results = {}

    for plant, info in plant_info.items():
        normalized_name = plant.lower().replace("_", " ")
        normalized_info = info.get('info', '').lower().replace("_", " ")

        if query in normalized_name or query in normalized_info:
            image_name = info.get('image', 'default.jpg')
            image_url = f"/plants/{image_name}"

            results[plant] = {
                "name": plant.replace("_", " "),
                "info": info.get('info', ''),
                "scientific_name": info.get('scientific_name', ''),
                "habitat": info.get('habitat', ''),
                "image_url": image_url
            }

    return jsonify(results)

@app.route('/api/upload', methods=['POST'])
def upload():
    file = request.files.get('file')
    if not file:
        return jsonify(error="No file uploaded"), 400

    try:
        mime_type = file.content_type or "image/jpeg"

        file_bytes = file.read()

        plant_name, info = classify_plant(file_bytes)
        if not plant_name:
            return jsonify(error="Unable to classify plant"), 400
        
        normalized_name = plant_name.replace("_", " ").lower()

        plant_data = None
        for key, value in plant_info.items():
            if key.replace("_", " ").lower() == normalized_name:
                plant_data = value
                plant_name = key 
                break

        if not plant_data:
            plant_data = {"info": info or ""}

        encoded = base64.b64encode(file_bytes).decode()
        image_url = f"data:{mime_type};base64,{encoded}"

        response = {
            "name": normalized_name,
            "info": plant_data.get('info', info or ''),
            "scientific_name": plant_data.get('scientific_name', ''),
            "habitat": plant_data.get('habitat', ''),
            "image_url": image_url
        }
        return jsonify(response)

    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route('/api/quiz')
def quiz():
    global quiz_questions
    if not quiz_questions:
        generate_questions(plant_info)

    question = random.choice(quiz_questions)
    return jsonify({
        "id": question["id"],
        "question": question["question"],
        "options": question["options"]
    })


@app.route('/api/quiz_submit', methods=['POST'])
def quiz_submit():
    data = request.get_json()
    qid = data.get("id")
    selected = data.get("selected")

    if qid is None or selected is None:
        return jsonify(error="Missing question id or answer"), 400

    question = next((q for q in quiz_questions if q["id"] == qid), None)
    if not question:
        return jsonify(error="Invalid question id"), 400

    correct = (question["options"][selected] == question["answer"])
    return jsonify(correct=correct, score=1 if correct else 0)

@app.route('/api/disease_treatment', methods=['POST'])
def disease_treatment():
    data = request.get_json()
    user_input = data.get('input', '').lower()
    results = []

    for disease, details in disease_data.items():
        if user_input in disease.lower() or any(user_input in s.lower() for s in details['symptoms']):
            results.append({
                "disease": disease,
                "symptoms": details['symptoms'],
                "treatment": details['treatment'],
                "plant": details.get('plant', '')
            })

        if results:
            return jsonify({"results": results})
    return jsonify({"results": []})


if __name__ == "__main__":
    app.run(debug=True)
