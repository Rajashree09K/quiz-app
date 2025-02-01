const startButton = document.getElementById('start-quiz');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-quiz');

let currentQuestionIndex = 0;
let score = 0;
let quizData = [];

// Fetch quiz data from the local JSON file
async function fetchQuizData() {
    try {
        const response = await fetch('quiz-data.json'); // Fetch from the local JSON file
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        quizData = data.questions; // Assuming the structure of your JSON file
        startQuiz();
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        alert('Failed to load quiz data. Please try again later.');
    }
}

// Start the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startButton.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    showQuestion(quizData[currentQuestionIndex]);
}

// Show a question
function showQuestion(question) {
    questionElement.innerText = question.question; // Display the question
    answerButtons.innerHTML = ''; // Clear previous answers
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text; // Display the answer text
        button.classList.add('answer-button');
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtons.appendChild(button);
    });
}

// Handle answer selection
function selectAnswer(answer) {
    if (answer.correct) { // Check if the answer is correct
        score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion(quizData[currentQuestionIndex]);
    } else {
        showResults();
    }
}

// Get feedback message based on score
function getFeedbackMessage(score, totalQuestions) {
    const percentage = (score / totalQuestions) * 100;

    if (percentage === 100) {
        return "Excellent! Perfect score!";
    } else if (percentage >= 80) {
        return "Awesome! Great job!";
    } else if (percentage >= 60) {
        return "Good effort! Keep it up!";
    } else if (percentage >= 40) {
        return "Not bad! You can do better!";
    } else {
        return "Keep trying! Practice makes perfect!";
    }
}

// Show results
function showResults() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.innerText = `${score} out of ${quizData.length}`;
    
    // Get feedback message based on score
    const feedbackMessage = getFeedbackMessage(score, quizData.length);
    
    // Display feedback message
    const feedbackElement = document.createElement('p');
    feedbackElement.innerText = feedbackMessage;
    resultContainer.appendChild(feedbackElement);
}

// Restart the quiz
restartButton.addEventListener('click', () => {
    fetchQuizData();
});

// Start the quiz when the page loads
startButton.addEventListener('click', fetchQuizData);