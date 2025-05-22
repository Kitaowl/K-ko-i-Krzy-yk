// Pobranie elementów z DOM
const gameContainer = document.getElementById("game");
const message = document.getElementById("message");
const resetBtn = document.getElementById("reset");
const canvas = document.getElementById("line");
const ctx = canvas.getContext("2d");

let playerMode = 2; // Domyślnie tryb dla 2 graczy

// Stałe gry
const boardSize = 3;
let board = Array(boardSize * boardSize).fill(""); // Tablica 3x3 wypełniona pustymi polami
let currentPlayer = "X"; // X zaczyna
let gameActive = true; // Flaga, czy gra trwa

// Kombinacje zwycięskie
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // poziomo
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // pionowo
  [0, 4, 8],
  [2, 4, 6], // diagonalnie
];

// Obsługa przycisków wyboru liczby graczy
document.getElementById("one-player").addEventListener("click", () => {
  playerMode = 1;
  startGame();
});

document.getElementById("two-players").addEventListener("click", () => {
  playerMode = 2;
  startGame();
});

// Tworzenie planszy 3x3
function createBoard() {
  gameContainer.innerHTML = ""; // Wyczyść stare pola
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = index;
    div.addEventListener("click", handleClick); // Dodaj obsługę kliknięcia
    gameContainer.appendChild(div);
  });

  resizeCanvas(); // Dostosuj rozmiar canvas do planszy
}

// Obsługa kliknięcia pola gry
function handleClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || board[index]) return; // Jeśli gra nieaktywna lub pole zajęte — ignoruj

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner()) {
    message.textContent = `Gracz ${currentPlayer} wygrał!`;
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    message.textContent = "Remis!";
    gameActive = false;
    return;
  }

  // Zmiana gracza
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Jeśli AI ma ruch
  if (playerMode === 1 && currentPlayer === "O") {
    setTimeout(aiMove, 500); // Krótkie opóźnienie dla naturalności
  }
}

// Sprawdzenie, czy jest zwycięzca
function checkWinner() {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      drawWinLine(combo); // Rysuj linię przez zwycięskie pola
      return true;
    }
  }
  return false;
}

// Rysowanie czerwonej linii zwycięstwa
function drawWinLine([a, b, c]) {
  const cells = document.querySelectorAll(".cell");
  const start = cells[a].getBoundingClientRect();
  const end = cells[c].getBoundingClientRect();

  const gameRect = gameContainer.getBoundingClientRect();

  // Oblicz współrzędne względem planszy
  const startX = start.left + start.width / 2 - gameRect.left;
  const startY = start.top + start.height / 2 - gameRect.top;
  const endX = end.left + end.width / 2 - gameRect.left;
  const endY = end.top + end.height / 2 - gameRect.top;

  // Rysowanie linię
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

// Reset gry i powrót do wyboru trybu
function resetGame() {
  board = Array(boardSize * boardSize).fill(""); // Wyczyść planszę
  currentPlayer = "X";
  gameActive = true;
  message.textContent = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Czyść canvas
  gameContainer.innerHTML = ""; // Usuń pola
  document.getElementById("player-select").style.display = "block"; // Pokaż wybór graczy
  document.getElementById("reset").style.display = "none"; // Ukryj reset
}

// Uruchomienie gry po wyborze graczy
function startGame() {
  document.getElementById("player-select").style.display = "none"; // Ukryj wybór
  document.getElementById("reset").style.display = "inline-block"; // Pokaż reset
  board = Array(boardSize * boardSize).fill(""); // Zresetuj planszę
  currentPlayer = "X";
  gameActive = true;
  message.textContent = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Czyść canvas
  createBoard(); // Stwórz planszę
}

// Dopasowanie rozmiaru canvas do planszy
function resizeCanvas() {
  const rect = gameContainer.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvas.style.top = rect.top + "px";
  canvas.style.left = rect.left + "px";
}

// Nasłuchiwanie na reset i zmianę rozmiaru okna
resetBtn.addEventListener("click", resetGame);
window.addEventListener("resize", resizeCanvas);

// AI (Minimax) dla trybu 1 gracza

// Ruch AI jako O
function aiMove() {
  const bestMove = getBestMove();
  const cell = document.querySelector(`.cell[data-index='${bestMove}']`);
  board[bestMove] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWinner()) {
    message.textContent = `Gracz ${currentPlayer} wygrał!`;
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    message.textContent = "Remis!";
    gameActive = false;
    return;
  }

  currentPlayer = "X"; // Po ruchu AI wraca do gracza
}

// Znalezienie najlepszego ruchu
function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

// Algorytm Minimax
function minimax(boardState, depth, isMaximizing) {
  const result = checkWinState(boardState);
  if (result !== null) {
    const scores = { X: -1, O: 1, tie: 0 };
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Sprawdzenie zwycięzcy dla Minimax
function checkWinState(tempBoard) {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (tempBoard[a] && tempBoard[a] === tempBoard[b] && tempBoard[b] === tempBoard[c]) {
      return tempBoard[a]; // Zwraca "X" lub "O"
    }
  }

  if (!tempBoard.includes("")) {
    return "tie"; // Remis
  }

  return null; // Gra nadal trwa
}
