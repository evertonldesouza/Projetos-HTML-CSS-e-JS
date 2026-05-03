
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let playerOne = "x"
let playerTwo = "o";
let gameOver = false;
let turn = 1;
let scoreX = 0;
let scoreO = 0;
let soloGame = false;
let isCpuThinking = false;
let cpuTimer = null; 

let tabl = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
]

const player1Scoreboard = document.querySelector(".player1-score");
const player2Scoreboard = document.querySelector(".player2-score");
const cpuButton = document.getElementById("cpu-button"); 
const radioX = document.getElementById("croix"); 
const radioO = document.getElementById("circle"); 


function play(elem) {
    
    if (gameOver || isCpuThinking) return; 

    const index = elem.dataset.index;
    const i = Math.floor(index / 3);
    const j = index % 3;

    
    if (tabl[i][j] !== "") return;

    if (turn === 1) {
        disableOptions();
    }

    const currentPlayer = (turn % 2 !== 0) ? playerOne : playerTwo;

    tabl[i][j] = currentPlayer;
    elem.classList.add(currentPlayer);

    turn++;
    checkWinner();
    updateTurnIndicator();

    
    if (soloGame && turn % 2 === 0 && !gameOver) {
        isCpuThinking = true; 
        
        cpuTimer = setTimeout(() => {
            versusCpu();
            isCpuThinking = false; 
        }, 500);
    }
}

function checkWinner() {
    let winner = 0;

    for (let i = 0; i < tabl.length; i++) {
        if (tabl[i][0] === playerOne && tabl[i][1] === playerOne && tabl[i][2] === playerOne) {
            triggerWin(playerOne, i * 3, i * 3 + 1, i * 3 + 2);
            winner = playerOne;
        } else if (tabl[i][0] === playerTwo && tabl[i][1] === playerTwo && tabl[i][2] === playerTwo) {
            triggerWin(playerTwo, i * 3, i * 3 + 1, i * 3 + 2);
            winner = playerTwo;
        }
    }

    for (let i = 0; i < tabl.length; i++) {
        if (tabl[0][i] === playerOne && tabl[1][i] === playerOne && tabl[2][i] === playerOne) {
            triggerWin(playerOne, i, i + 3, i + 6);
            winner = playerOne;
        } else if (tabl[0][i] === playerTwo && tabl[1][i] === playerTwo && tabl[2][i] === playerTwo) {
            triggerWin(playerTwo, i, i + 3, i + 6);
            winner = playerTwo;
        }
    }

    if (tabl[0][0] === playerOne && tabl[1][1] === playerOne && tabl[2][2] === playerOne) {
        triggerWin(playerOne, 0, 4, 8);
        winner = playerOne;
    } else if (tabl[0][0] === playerTwo && tabl[1][1] === playerTwo && tabl[2][2] === playerTwo) {
        triggerWin(playerTwo, 0, 4, 8);
        winner = playerTwo;
    }

    if (tabl[0][2] === playerOne && tabl[1][1] === playerOne && tabl[2][0] === playerOne) {
        triggerWin(playerOne, 2, 4, 6);
        winner = playerOne;
    } else if (tabl[0][2] === playerTwo && tabl[1][1] === playerTwo && tabl[2][0] === playerTwo) {
        triggerWin(playerTwo, 2, 4, 6);
        winner = playerTwo;
    }

    if (turn == 10 && gameOver == false) {
        document.querySelector(".result").style.display = "flex";
        document.querySelector(".result").innerHTML = "EMPATE!";
        document.querySelector(".result").classList.add("win-message"); // <-- NOVA LINHA AQUI
        gameOver = true;
    }

    if (gameOver == true) {
        incrementScore(winner);
        updateTurnIndicator(); 
    }
}

function triggerWin(player, i1, i2, i3) {
    document.querySelector(".result").style.display = "flex";
    document.querySelector(".result").innerHTML = player.toUpperCase() + " VENCEU!";
    gameOver = true;
    highlightWinner(i1, i2, i3);
}

function highlightWinner(i1, i2, i3) {
    const cases = document.querySelectorAll(".case");
    cases[i1].classList.add("winning-square");
    cases[i2].classList.add("winning-square");
    cases[i3].classList.add("winning-square");
    document.querySelector(".result").classList.add("win-message");
}

function playAgain() {
    clearTimeout(cpuTimer); 
    isCpuThinking = false;
    turn = 1;
    
    tabl = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    let cases = document.querySelectorAll(".case");
    cases.forEach(function (caseElem) {
        caseElem.textContent = ""; 
        caseElem.classList.remove("x", "o", "winning-square");
    });

    let resultElem = document.querySelector(".result");
    resultElem.textContent = "";
    resultElem.style.display = "none";
    resultElem.classList.remove("win-message");

    gameOver = false;
    updateTurnIndicator();
    enableOptions();
}

let retryButton = document.querySelector(".retry button");
retryButton.addEventListener("click", playAgain);

function choice(elem) {
    document.getElementsByName("shape").forEach((elem) => {
        if (elem.checked) {
            playerOne = elem.value;
            if (elem.value == "x") {
                document.querySelector('.croix-label').classList.add('croix-label-active');
                document.querySelector('.circle-label').classList.remove('circle-label-active');
            } else {
                document.querySelector('.croix-label').classList.remove('croix-label-active');
                document.querySelector('.circle-label').classList.add('circle-label-active');
            }
        }
        if (!elem.checked) {
            playerTwo = elem.value;
        }
    })
    playAgain();
}

choice();
updateTurnIndicator(); 

function incrementScore(winner) {
    if (winner === "x") {
        scoreX++;
        document.querySelector("#score-x").innerHTML = scoreX;
    } else if (winner === "o") {
        scoreO++;
        document.querySelector("#score-o").innerHTML = scoreO;
    }
}

function updateTurnIndicator() {
  if (gameOver) {
    player1Scoreboard.classList.remove("turn-active");
    player2Scoreboard.classList.remove("turn-active");
  } else if (turn % 2 !== 0) { 
    player1Scoreboard.classList.add("turn-active");
    player2Scoreboard.classList.remove("turn-active");
  } else { 
    player1Scoreboard.classList.remove("turn-active");
    player2Scoreboard.classList.add("turn-active");
  }
}

function disableOptions() {
  radioX.disabled = true;
  radioO.disabled = true;
  cpuButton.disabled = true;
  document.querySelector(".options").classList.add("disabled");
  cpuButton.classList.add("disabled");
}

function enableOptions() {
  radioX.disabled = false;
  radioO.disabled = false;
  cpuButton.disabled = false;
  document.querySelector(".options").classList.remove("disabled");
  cpuButton.classList.remove("disabled");
}

function chooseMode() {
    soloGame = !soloGame; 
    if (soloGame) {
        cpuButton.textContent = "Jogar 1v1";
        cpuButton.classList.add("cpu-active"); 
    } else {
        cpuButton.textContent = "Jogar contra o PC";
        cpuButton.classList.remove("cpu-active"); 
    }
    playAgain(); 
}


function findBestMove(board, aiPlayer, humanPlayer) {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === "") {
                board[i][j] = aiPlayer;
                let score = minimax(board, 0, false, aiPlayer, humanPlayer);
                board[i][j] = "";

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { i, j };
                }
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing, aiPlayer, humanPlayer) {
    let result = checkWinnerForAI(board, aiPlayer, humanPlayer);
    
    if (result !== null) {
        if (result.score === 10) return result.score - depth;
        if (result.score === -10) return result.score + depth;
        return 0; // Empate
    }

    if (isMaximizing) { 
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    board[i][j] = aiPlayer;
                    let score = minimax(board, depth + 1, false, aiPlayer, humanPlayer);
                    board[i][j] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else { 
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    board[i][j] = humanPlayer;
                    let score = minimax(board, depth + 1, true, aiPlayer, humanPlayer);
                    board[i][j] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function isBoardFull(board) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === "") {
                return false;
            }
        }
    }
    return true;
}

function checkWinnerForAI(board, aiPlayer, humanPlayer) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            if (board[i][0] === aiPlayer) return { score: 10 };
            if (board[i][0] === humanPlayer) return { score: -10 };
        }
    }
    for (let j = 0; j < 3; j++) {
        if (board[0][j] !== "" && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
            if (board[0][j] === aiPlayer) return { score: 10 };
            if (board[0][j] === humanPlayer) return { score: -10 };
        }
    }
    if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        if (board[0][0] === aiPlayer) return { score: 10 };
        if (board[0][0] === humanPlayer) return { score: -10 };
    }
    if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        if (board[0][2] === aiPlayer) return { score: 10 };
        if (board[0][2] === humanPlayer) return { score: -10 };
    }
    if (isBoardFull(board)) {
        return { score: 0 };
    }
    return null;
}

function versusCpu() {
    if (gameOver) return; 

    const morpion = document.querySelectorAll(".case");
    const cpuPlayer = (playerOne === "x") ? "o" : "x";
    const humanPlayer = playerOne;

    const bestMove = findBestMove(tabl, cpuPlayer, humanPlayer);

    if (bestMove) {
        tabl[bestMove.i][bestMove.j] = cpuPlayer;
        const index = bestMove.i * 3 + bestMove.j; 
        morpion[index].classList.add(cpuPlayer);

        turn++;
        checkWinner();
        updateTurnIndicator();
    }
}