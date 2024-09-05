
// Function to search for a plant by query
function searchPlant() {
    let query = document.getElementById('search').value;
    if (query.trim() === '') {
        document.getElementById('status-bar').innerText = 'Please enter a search query.';
        return;
    }
    document.getElementById('status-bar').innerText = 'Searching...';
    fetch(`/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerHTML = data.result;
            document.getElementById('status-bar').innerText = 'Search complete.';
        })
        .catch(error => {
            document.getElementById('status-bar').innerText = 'Error occurred while searching.';
            console.error(error);
        });
}

function displayPlantInfo(data) {
    document.getElementById('result').innerHTML = `
        <strong>Plant:</strong> ${data.plant_name}<br>
        <strong>Information:</strong> ${data.info}<br>
        <strong>Scientific Name:</strong> ${data.scientific_name}<br>
        <strong>Habitat:</strong> ${data.habitat}<br>
        <img src="${data.image_url}" alt="Plant Image" style="max-width: 200px; max-height: 200px;">
    `;
}

function uploadImage() {
    let formData = new FormData();
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
        if (e.target.files.length === 0) {
            document.getElementById('status-bar').innerText = 'No file selected.';
            return;
        }

        formData.append('file', e.target.files[0]);
        document.getElementById('status-bar').innerText = 'Uploading and classifying...';
        
        fetch('/upload', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                displayPlantInfo(data);
                document.getElementById('status-bar').innerText = 'Image classification complete.';
            })
            .catch(error => {
                document.getElementById('status-bar').innerText = 'Error occurred during image upload.';
                console.error(error);
            });
    };
    input.click();
}

// Function to clear search results, image, and status bar
function clearResults() {
    document.getElementById('result').innerHTML = '';
    document.getElementById('image').innerHTML = '';
    document.getElementById('status-bar').innerText = 'Ready';
}

// Function to start the quiz
function startQuiz() {
    document.getElementById('status-bar').innerText = 'Starting quiz...';
    fetch('/quiz')
        .then(response => response.json())
        .then(data => {
            document.getElementById('quiz-question').innerText = data.question;
            let optionsHTML = '';
            data.options.forEach((option, i) => {
                optionsHTML += `<input type="radio" name="option" value="${i}"> ${option}<br>`;
            });
            document.getElementById('quiz-options').innerHTML = optionsHTML;
            document.getElementById('quiz').style.display = 'block';
            updateProgressBar(0);  // Reset the progress bar
            document.getElementById('status-bar').innerText = 'Quiz started.';
        })
        .catch(error => {
            document.getElementById('status-bar').innerText = 'Error occurred while starting quiz.';
            console.error(error);
        });
}

// Function to submit quiz answers
function submitQuiz() {
    let selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        document.getElementById('status-bar').innerText = 'Please select an option.';
        return;
    }

    fetch('/quiz_submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected: selectedOption.value })
    })
        .then(response => response.json())
        .then(data => {
            alert(`Your Score: ${data.score}`);
            document.getElementById('quiz').style.display = 'none';
            document.getElementById('status-bar').innerText = 'Quiz completed.';
        })
        .catch(error => {
            document.getElementById('status-bar').innerText = 'Error occurred while submitting quiz.';
            console.error(error);
        });
}

// Function to update the quiz progress bar
function updateProgressBar(progress) {
    let progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;
}
