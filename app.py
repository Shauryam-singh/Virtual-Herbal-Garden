from flask import Flask, render_template, request, jsonify, url_for, send_from_directory
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
        options = [info['info']] + random.sample([i['info'] for i in plant_info.values()], 3)
        random.shuffle(options)
        quiz_questions.append({"question": question, "options": options, "answer": info['info']})

generate_questions(plant_info)

@app.route('/')
def index():
    return render_template('template.html')

@app.route('/plant_images/<filename>')
def serve_image(filename):
    return send_from_directory('data/plant_images', filename)

@app.route('/search')
def search():
    query = request.args.get('q', '').lower()
    results = {plant: info for plant, info in plant_info.items() if query in plant.lower() or query in info['info'].lower()}
    
    if results:
        result_html = ""
        for plant, data in results.items():
            plant_title = plant.title()
            plant_info_text = data['info']
            scientific_name = data.get('scientific_name', 'No scientific name available')
            habitat = data.get('habitat', 'Habitat information not available')
            image_url = url_for('serve_image', filename=data['image'])
            result_html += (f'<div><strong>{plant_title}</strong>: {plant_info_text}<br>'
                            f'<em>Scientific Name:</em> {scientific_name}<br>'
                            f'<em>Habitat:</em> {habitat}<br>'
                            f'<img src="{image_url}" alt="{plant_title}" style="max-width: 150px; max-height: 150px;"></div><br>')
        return jsonify(result=result_html)
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
    
    try:
        file.save(filepath)

        # Classify the plant
        plant_name, info = classify_plant(filepath)

        if plant_name is None:
            raise ValueError('Unable to classify plant.')

        # Get the plant info from the plant_info dictionary
        plant_data = plant_info.get(plant_name, {})
        info_text = plant_data.get('info', 'No information available')
        scientific_name = plant_data.get('scientific_name', 'No scientific name available')
        habitat = plant_data.get('habitat', 'Habitat information not available')
        
        # Generate the image URL
        image_url = url_for('static', filename=f'plant_images/{file.filename}')
        
        return jsonify(plant_name=plant_name, info=info_text, scientific_name=scientific_name, habitat=habitat, image_url=image_url)

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify(error=str(e))

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
