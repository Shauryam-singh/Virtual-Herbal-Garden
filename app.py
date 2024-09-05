from flask import Flask, render_template, request, jsonify, url_for
from scripts.classify_plant import classify_plant
import json
import random
import os

app = Flask(__name__)

# Load plant information
with open('data/plant_info.json', 'r') as f:
    plant_info = json.load(f)

# Store quiz questions
quiz_questions = []
def generate_questions(plant_info):
    global quiz_questions
    for plant, info in plant_info.items():
        question = f"What is {plant} known for?"
        options = [info] + random.sample(list(plant_info.values()), 3)
        random.shuffle(options)
        quiz_questions.append({"question": question, "options": options, "answer": info})

generate_questions(plant_info)

@app.route('/')
def index():
    return render_template('template.html')

@app.route('/search')
def search():
    query = request.args.get('q', '').lower()
    results = {plant: info for plant, info in plant_info.items() if query in plant.lower() or query in info.lower()}
    if results:
        return jsonify(result="<br>".join([f"{plant.title()}: {info}" for plant, info in results.items()]))
    else:
        return jsonify(result="No results found.")

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']

    # Save the uploaded file to 'static/plant_images'
    image_folder = 'static/plant_images'
    if not os.path.exists(image_folder):
        os.makedirs(image_folder)
    filepath = os.path.join(image_folder, file.filename)
    file.save(filepath)

    # Classify the plant and return the name and info
    plant_name, info = classify_plant(filepath)

    # Use `url_for` to get the correct static URL for the image
    image_url = url_for('static', filename=f'plant_images/{file.filename}')
    
    return jsonify(plant_name=plant_name, info=info, image_url=image_url)

@app.route('/quiz')
def quiz():
    question = random.choice(quiz_questions)
    return jsonify(question=question['question'], options=question['options'])

@app.route('/quiz_submit', methods=['POST'])
def quiz_submit():
    selected = int(request.json['selected'])
    question = quiz_questions.pop(0)  # Get the first question
    correct = question['options'][selected] == question['answer']
    score = 1 if correct else 0
    return jsonify(score=score)

if __name__ == '__main__':
    app.run(debug=True)
