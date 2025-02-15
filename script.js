// script.js
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'black', 'white'];
let currentColor;
let score = 0;
let level = 1;
let timeLeft;
let timer;
let bonusMultiplier = 1;
let consecutiveCorrect = 0;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const screen = document.getElementById('screen');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const levelElement = document.getElementById('level');
const bonusElement = document.getElementById('bonus');
const startButton = document.getElementById('start-btn');
const modal = document.getElementById('game-over-modal');
const finalScoreElement = document.getElementById('final-score');
const playerNameInput = document.getElementById('player-name');
const saveScoreButton = document.getElementById('save-score-btn');
const playAgainButton = document.getElementById('play-again-btn');
const bonusIndicator = document.querySelector('.bonus-indicator');

function startGame() {
    score = 0;
    level = 1;
    timeLeft = 10;
    bonusMultiplier = 1;
    consecutiveCorrect = 0;
    
    scoreElement.textContent = score;
    levelElement.textContent = level;
    bonusElement.textContent = `x${bonusMultiplier}`;
    
    startButton.disabled = true;
    modal.classList.add('hidden');
    
    updateGame();
    startTimer();
    updateHighScoresDisplay();
}

function updateGame() {
    currentColor = colors[Math.floor(Math.random() * colors.length)];
    screen.style.backgroundColor = currentColor;
    
    // Random chance for bonus round
    if (Math.random() < 0.1) { // 10% chance
        activateBonusRound();
    }
}

function activateBonusRound() {
    bonusMultiplier = 2;
    bonusElement.textContent = `x${bonusMultiplier}`;
    bonusIndicator.classList.remove('hidden');
    
    setTimeout(() => {
        bonusMultiplier = 1;
        bonusElement.textContent = `x${bonusMultiplier}`;
        bonusIndicator.classList.add('hidden');
    }, 3000);
}

function createScorePopup(points) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${points}`;
    screen.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1000);
}

function checkColor(selectedColor) {
    if (!timeLeft) return;

    if (selectedColor === currentColor) {
        const pointsEarned = 1 * bonusMultiplier;
        score += pointsEarned;
        consecutiveCorrect++;
        
        createScorePopup(pointsEarned);
        scoreElement.textContent = score;
        
        // Add correct answer animation
        screen.classList.add('correct-answer');
        setTimeout(() => screen.classList.remove('correct-answer'), 500);

        if (consecutiveCorrect >= 5) {
            timeLeft += 2; // Bonus time for consistent performance
            timerElement.textContent = timeLeft;
            consecutiveCorrect = 0;
        }

        if (score % 10 === 0) {
            level++;
            levelElement.textContent = level;
            timeLeft = Math.max(10 - level, 3);
        }

        updateGame();
    } else {
        consecutiveCorrect = 0;
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
    finalScoreElement.textContent = score;
    modal.classList.remove('hidden');
}

function saveHighScore() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) return;

    const newScore = {
        name: playerName,
        score: score,
        date: new Date().toLocaleDateString()
    };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5); // Keep only top 5 scores

    localStorage.setItem('highScores', JSON.stringify(highScores));
    updateHighScoresDisplay();
    modal.classList.add('hidden');
}

function updateHighScoresDisplay() {
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = highScores
        .map((score, index) => `
            <div>${index + 1}. ${score.name} - ${score.score} points (${score.date})</div>
        `)
        .join('');
}

// Event Listeners
startButton.addEventListener('click', startGame);
saveScoreButton.addEventListener('click', saveHighScore);
playAgainButton.addEventListener('click', startGame);

document.querySelectorAll('.color-btn').forEach((btn, index) => {
    btn.style.backgroundColor = colors[index];
    btn.addEventListener('click', () => checkColor(colors[index]));
});

// Initialize the high scores display
updateHighScoresDisplay();