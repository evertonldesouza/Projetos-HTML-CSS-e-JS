const gameBoard = document.getElementById("game-board");
const startBtn = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const message = document.getElementById("message");
const topScores = document.getElementById("scores");
const pauseMessage = document.getElementById("pause-message"); 
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const cellSize = 25;
let scores = JSON.parse(localStorage.getItem("snakeHighScores")) || [];
let snake = [{ x: 2, y: 2 }];
let food = { x: 10, y: 10 };
let mouse = { x: 15, y: 15 };
let direction = "right";
let isGameOver = false;
let speed = 120;
let score = 0;
let foodEaten = 0;
let intervalId = null;
let interMouse = null;
let lastDirection = "right";
let isPaused = false;
let canChangeDirection = true; // TRAVA DE SEGURANÇA CONTRA O BUG DO SUICÍDIO

const audioEat = new Audio('sounds/eat.wav');
const audioGameOver = new Audio('sounds/gameover.wav');

function playSound(audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

startBtn.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

function startGame() {
  isGameOver = false;
  intervalId = setInterval(() => { move(); draw(); }, speed);
  interMouse = setInterval(generateMouse, 2500);
  modal.style.display = "none";
}

function createElement(className, x, y) {
  const element = document.createElement("div");
  element.className = className;
  element.style.left = x * cellSize + "px";
  element.style.top = y * cellSize + "px";
  gameBoard.appendChild(element);
  return element;
}

function draw() {
  gameBoard.innerHTML = "";
  const snakeHead = createElement("snake-head", snake[0].x, snake[0].y);
  snakeHead.style.transform = `rotate(${direction === "right" ? -90 : direction === "left" ? 90 : direction === "down" ? 0 : 180}deg)`;

  const taperSegments = 20; 
  const minScale = 0.3; 

  for (let i = 1; i < snake.length; i++) {
    const segmentElement = createElement("snake-body", snake[i].x, snake[i].y);
    const scale = Math.max(minScale, 1 - (i / taperSegments)); 
    segmentElement.style.transform = `scale(${scale})`;
    segmentElement.style.zIndex = -i; 
  }

  createElement("food", food.x, food.y);
  createElement("mouse", mouse.x, mouse.y);
}

function move() {
  if (isGameOver) return;
  
  canChangeDirection = true; // Liberta a trava de direção para o próximo movimento

  let newHead = { x: snake[0].x, y: snake[0].y };
  const { clientWidth, clientHeight } = gameBoard;
  
  switch (direction) {
    case "up": newHead.y--; break;
    case "down": newHead.y++; break;
    case "left": newHead.x--; break;
    case "right": newHead.x++; break;
  }
  
  if (newHead.x < 0 || newHead.x >= Math.floor(clientWidth / cellSize) || newHead.y < 0 || newHead.y >= Math.floor(clientHeight / cellSize)) { stopGame(); return; }
  if (snake.slice(1).some(s => s.x === newHead.x && s.y === newHead.y)) { stopGame(); return; }
  
  snake.unshift(newHead);
  
  const isFoodEaten = newHead.x === food.x && newHead.y === food.y;
  const isMouseEaten = newHead.x === mouse.x && newHead.y === mouse.y;
  
  if (isFoodEaten || isMouseEaten) {
    playSound(audioEat);
    score += isFoodEaten ? 150 : 350;
    updateScore();
    isFoodEaten ? (foodEaten++, updateFoodEaten(), generateFood()) : (clearInterval(interMouse), generateMouse(), interMouse = setInterval(generateMouse, 2500));
  } else { 
    snake.pop(); 
  }
  lastDirection = direction;
}

function generateFood() {
    const { clientWidth, clientHeight } = gameBoard;
    do {
        food.x = Math.floor(Math.random() * Math.floor(clientWidth / cellSize));
        food.y = Math.floor(Math.random() * Math.floor(clientHeight / cellSize));
    } while (
        snake.some(s => s.x === food.x && s.y === food.y) ||
        (food.x === mouse.x && food.y === mouse.y)
    );
}

function generateMouse() {
    const { clientWidth, clientHeight } = gameBoard;
    do {
        mouse.x = Math.floor(Math.random() * Math.floor(clientWidth / cellSize));
        mouse.y = Math.floor(Math.random() * Math.floor(clientHeight / cellSize));
    } while (
        snake.some(s => s.x === mouse.x && s.y === mouse.y) ||
        (mouse.x === food.x && mouse.y === food.y)
    );
}

function stopGame() {
  playSound(audioGameOver);
  isGameOver = true;
  clearInterval(intervalId);
  clearInterval(interMouse);
  modal.style.display = "flex";
  modalContent.style.display = "none";
  message.style.display = "flex";
  restartButton.style.display = "flex";
  addScore(score);
  displayScores();
}

function restartGame() {
  isGameOver = false;
  snake = [{ x: 2, y: 2 }];
  direction = "right";
  modal.style.display = "none";
  message.style.display = "none";
  restartButton.style.display = "none";
  gameBoard.style.opacity = 1;
  score = 0;
  foodEaten = 0;
  speed = 120;
  clearInterval(intervalId);
  updateScore();
  updateFoodEaten();
  startGame();
}

function togglePause() {
  if (isGameOver) return;
  isPaused = !isPaused; 

  if (isPaused) {
    clearInterval(intervalId); 
    clearInterval(interMouse); 
    modal.style.display = "flex";
    modalContent.style.display = "none";
    message.style.display = "none";
    pauseMessage.style.display = "flex"; 
  } else {
    modal.style.display = "none";
    pauseMessage.style.display = "none";
    intervalId = setInterval(() => { move(); draw(); }, speed);
    interMouse = setInterval(generateMouse, 2500);
  }
}

function updateFoodEaten() {
  document.getElementById("food-eaten").innerHTML = `<img src="images/apple.svg" alt="maças comidas"> ${foodEaten}`;
}

function updateScore() {
  document.getElementById("score").innerHTML = `<img src="images/trophy.svg" alt="pontuação"> ${score}`;
  if (score > 0 && score % 1000 === 0) { increaseDifficulty(); }
}

function increaseDifficulty() {
  if (speed > 50) { speed -= 8; } 
  clearInterval(intervalId);
  intervalId = setInterval(() => { move(); draw(); }, speed);
}

function addScore(playerScore) {
  scores.push(playerScore);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5); 
  localStorage.setItem("snakeHighScores", JSON.stringify(scores));
}

function displayScores() {
  const scoreList = document.getElementById("scores-list");
  scoreList.innerHTML = "";
  scores.forEach((playerScore, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Pontuação ${index + 1} : ${playerScore}`;
    scoreList.appendChild(listItem);
  });
}

function handleInput(newDirection) {
    if (isPaused || !canChangeDirection) return;
    
    if (newDirection === "up" && lastDirection !== "down") {
        direction = "up";
        canChangeDirection = false;
    } else if (newDirection === "down" && lastDirection !== "up") {
        direction = "down";
        canChangeDirection = false;
    } else if (newDirection === "left" && lastDirection !== "right") {
        direction = "left";
        canChangeDirection = false;
    } else if (newDirection === "right" && lastDirection !== "left") {
        direction = "right";
        canChangeDirection = false;
    }
}

upButton.addEventListener("click", () => handleInput("up"));
downButton.addEventListener("click", () => handleInput("down"));
leftButton.addEventListener("click", () => handleInput("left"));
rightButton.addEventListener("click", () => handleInput("right"));

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Escape": togglePause(); break;
    case "z":
    case "ArrowUp": handleInput("up"); break;
    case "s":
    case "ArrowDown": handleInput("down"); break;
    case "q":
    case "ArrowLeft": handleInput("left"); break;
    case "d":
    case "ArrowRight": handleInput("right"); break;
  }
});

updateScore();
updateFoodEaten();