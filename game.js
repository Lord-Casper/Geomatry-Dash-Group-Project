const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progressBar');
const scoreElement = document.getElementById('score');

// Game constants
const GRAVITY = 0.6;
const JUMP_STRENGTH = 12;
const PLAYER_COLOR = 'cyan';
const OBSTACLE_COLOR = 'limegreen';
const GROUND_HEIGHT = 20;
const PLAYER_DIM = 30;
const BASE_GAME_LENGTH = 3000; // Base total distance to win the game
const LEVEL_DURATION_INCREASE = 200; // Increase duration for each level

let currentLevel = 0;

// Game variables
let player = {
    x: 50,
    y: canvas.height - PLAYER_DIM - GROUND_HEIGHT,
    width: PLAYER_DIM,
    height: PLAYER_DIM,
    dy: 0,
    jumping: false
};

let obstacles = [];
let frame = 0;
let gameRunning = true;
let distanceTravelled = 0;
let levelDuration;
let score = 0;

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function setLevel(level) {
    canvas.style.backgroundColor = getRandomColor();
    gameSpeed = 6 + level; // Increase game speed by 1 for each level
    obstacleFrequency = Math.max(10, 100 - level * 10); // Decrease obstacle frequency, minimum of 10
    levelDuration = BASE_GAME_LENGTH + level * LEVEL_DURATION_INCREASE;
}

function drawPlayer() {
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function handlePlayer() {
    if (player.jumping) {
        player.dy -= GRAVITY;
        player.y -= player.dy;
        
        if (player.y > canvas.height - player.height - GROUND_HEIGHT) {
            player.jumping = false;
            player.y = canvas.height - player.height - GROUND_HEIGHT;
            player.dy = 0;
        }
    }
}

function createObstacle() {
    let height = Math.random() * 30 + 20;
    let yPosition = Math.random() < 0.5 ? canvas.height - height - GROUND_HEIGHT : canvas.height - height - GROUND_HEIGHT - 60;
    obstacles.push({
        x: canvas.width,
        y: yPosition,
        width: Math.random() * 20 + 20,
        height: height,
        color: OBSTACLE_COLOR
    });
}

function drawObstacles() {
    obstacles.forEach((obstacle, index) => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.x -= gameSpeed;

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });
}

function detectCollision() {
    for (let obstacle of obstacles) {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameRunning = false;
            alert('Game Over! Refresh to play again.');
            return;
        }
    }
}

function drawGround() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
}

function updateProgressBar() {
    let progress = (distanceTravelled / levelDuration) * 100;
    progressBar.style.width = progress + '%';
}

function updateScore() {
    scoreElement.innerText = 'Score: ' + score;
}

function checkWin() {
    if (distanceTravelled >= levelDuration) {
        currentLevel++;
        setLevel(currentLevel);
        distanceTravelled = 0;
        frame = 0;
        obstacles = [];
    }
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frame++;
    if (frame % obstacleFrequency === 0) {
        createObstacle();
        score++; // Increase score for each obstacle created
        updateScore();
    }

    drawGround();
    drawPlayer();
    handlePlayer();
    drawObstacles();
    detectCollision();

    distanceTravelled += gameSpeed;
    updateProgressBar();
    checkWin();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !player.jumping) {
        player.jumping = true;
        player.dy = JUMP_STRENGTH;
    }
});

setLevel(currentLevel);
gameLoop();

