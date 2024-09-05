function searchPlant() {
    let query = document.getElementById('search').value;
    fetch(`/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerHTML = data.result;
        });
}

function uploadImage() {
    let formData = new FormData();
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        formData.append('file', e.target.files[0]);
        fetch('/upload', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                document.getElementById('result').innerHTML = `Plant: ${data.plant_name}<br>Information: ${data.info}`;
                document.getElementById('image').innerHTML = `<img src="${data.image_url}" alt="Plant Image">`;
            });
    };
    input.click();
}

function clearResults() {
    document.getElementById('result').innerHTML = '';
    document.getElementById('image').innerHTML = '';
    document.getElementById('status-bar').innerText = 'Ready';
}

function startQuiz() {
    fetch('/quiz')
        .then(response => response.json())
        .then(data => {
            document.getElementById('quiz-question').innerText = data.question;
            let optionsHTML = '';
            data.options.forEach((option, i) => {
                optionsHTML += `<input type="radio" name="option" value="${i}">${option}<br>`;
            });
            document.getElementById('quiz-options').innerHTML = optionsHTML;
            document.getElementById('quiz').style.display = 'block';
            updateProgressBar(0);  // Start the progress bar at 0
        });
}

function submitQuiz() {
    let selectedOption = document.querySelector('input[name="option"]:checked').value;
    fetch(`/quiz_submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected: selectedOption })
    })
        .then(response => response.json())
        .then(data => {
            alert(`Score: ${data.score}`);
            document.getElementById('quiz').style.display = 'none';
        });
}

function updateProgressBar(progress) {
    let progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;
}
