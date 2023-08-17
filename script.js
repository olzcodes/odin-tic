// GAMEBOARD

const gameBoard = (() => {
  let board = [];

  const placeMarker = function (boardIndex, marker) {
    if (board[boardIndex]) return;
    board[boardIndex] = marker;
  };

  const printBoard = () => {
    console.log(board);
  };

  return { board, placeMarker, printBoard };
})();

// PLAYERS

const Player = (name, marker) => {
  const play = (boardIndex) => gameBoard.placeMarker(boardIndex, marker);
  return { name, marker, play };
};

const player1 = Player("player1", "X");
const player2 = Player("player2", "O");

// GAME

const gameController = (function () {
  const winningPatterns = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  let gameActive = true;
  let activePlayer = player1;

  const playRound = function (boardIndex) {
    if (gameActive === false) return;
    activePlayer.play(boardIndex);
    gameBoard.printBoard();
    checkForWin(gameBoard.board);
    switchPlayerTurn();
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const checkForWin = function (board) {
    for (let pattern = 0; pattern < winningPatterns.length; pattern++) {
      const output = winningPatterns[pattern].map(
        (boardIndex) => board[boardIndex - 1]
      );
      if (output.join("") === "XXX") endGame(pattern, player1);
      if (output.join("") === "OOO") endGame(pattern, player2);
    }
  };

  const endGame = function (pattern, player) {
    gameActive = false;
    console.log(`${player.name} WINS!`);
    displayController.showWinner(pattern, player);
  };

  return { playRound, winningPatterns };
})();

// DISPLAY /////////////////////////////////////////////////////////////////

const displayController = (function () {
  const gameBoardEl = document.querySelector(".game-board");
  const messageDisplayEl = document.querySelector(".message-display");

  const clickHandlerBoard = function (e) {
    const clickTarget = e.target;
    const boardIndex = clickTarget.dataset.boardIndex;
    if (clickTarget.classList.contains("full")) return;
    gameController.playRound(boardIndex);
    updateDisplay();
  };

  gameBoardEl.addEventListener("click", clickHandlerBoard);

  const updateDisplay = function () {
    for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
      const cell = gameBoardEl.children[boardIndex];
      const marker = gameBoard.board[boardIndex];
      cell.textContent = marker;
      if (cell.textContent) {
        cell.classList.remove("empty");
        cell.classList.add("full");
      }
    }
  };

  const showWinner = function (pattern, player) {
    gameController.winningPatterns[pattern].map((boardIndex) => {
      gameBoardEl.children[boardIndex - 1].classList.add("win");
      messageDisplayEl.textContent = `${player.name} WINS! 🏆`;
      messageDisplayEl.classList.remove("off");
    });
  };

  return { showWinner };
})();
