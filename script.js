const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const btnPlayer = document.getElementById("btnPlayer");
const btnComputer = document.getElementById("btnComputer");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "player";

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Event Listeners
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
btnPlayer.addEventListener("click", () => setMode('player'));
btnComputer.addEventListener("click", () => setMode('computer'));

function setMode(mode) {
    gameMode = mode;
    restartGame();
    statusText.textContent = mode === "computer" ? "Player X Turn (Vs Computer)" : "Player X Turn";
}

function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    updateCell(e.target, index, currentPlayer);

    if (checkWinner()) return;

    switchPlayer();

    if (gameMode === "computer" && currentPlayer === "O" && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function updateCell(cell, index, player) {
    board[index] = player;
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
}

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer} Turn`;
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            [a, b, c].forEach(idx => cells[idx].classList.add("winner"));
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
        gameActive = false;
        return true;
    }

    if (!board.includes("")) {
        statusText.textContent = "🤝 Match Draw!";
        gameActive = false;
        return true;
    }
    return false;
}

function computerMove() {
    let emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (emptyCells.length === 0) return;

    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    updateCell(cells[randomIndex], randomIndex, "O");

    if (checkWinner()) return;
    switchPlayer();
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = gameMode === "computer" ? "Player X Turn (Vs Computer)" : "Player X Turn";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner");
    });
}