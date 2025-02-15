// script.js
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'black', 'white'];
let currentColor;
let score = 0;
let level = 1;
let timeLeft;
let timer;
let gameInterval;

const screen = document.getElementById('screen');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const levelElement = document.getElementById('level');
const startButton = document.getElementById('start-btn');

// Initialize color buttons
document.querySelectorAll('.color-btn').forEach((btn, index) => {
    btn.style.backgroundColor = colors[index];
    btn.addEventListener('click', () => checkColor(colors[index]));
});

function startGame() {
    score = 0;
    level = 1;
    timeLeft = 10;
    scoreElement.textContent = score;
    levelElement.textContent = level;
    startButton.disabled = true;
    
    updateGame();
    startTimer();
}

function updateGame() {
    currentColor = colors[Math.floor(Math.random() * colors.length)];
    screen.style.backgroundColor = currentColor;
}

function checkColor(selectedColor) {
    if (!timeLeft) return;

    if (selectedColor === currentColor) {
        score++;
        scoreElement.textContent = score;

        if (score % 10 === 0) {
            level++;
            levelElement.textContent = level;
            timeLeft = Math.max(10 - level, 3); // Minimum 3 seconds per round
        }

        updateGame();
    } else {
        endGame();
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    alert(`Game Over! Your score: ${score}`);
    startButton.disabled = false;
}

startButton.addEventListener('click', startGame);

// Initialize color buttons
const buttons = document.querySelectorAll('.color-btn');
buttons.forEach((btn, index) => {
    btn.style.backgroundColor = colors[index];
});
