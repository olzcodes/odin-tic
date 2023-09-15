const gameBoard = (() => {
  let board = [];

  const placeMarker = function (boardIndex, marker) {
    if (board[boardIndex]) return;
    board[boardIndex] = marker;
  };

  const printBoard = function () {
    console.log(board);
  };

  const getBoard = function () {
    return board;
  };

  const resetBoard = function () {
    board = [];
  };

  return { board, placeMarker, printBoard, getBoard, resetBoard };
})();

const players = (() => {
  const nameInputs = document.querySelectorAll(".input-name");
  const nameInputPlayer1 = document.querySelector(`.name-player1`);
  const nameInputPlayer2 = document.querySelector(`.name-player2`);

  const Player = (name, marker) => {
    const play = function (boardIndex) {
      gameBoard.placeMarker(boardIndex, marker);
    };
    return { name, marker, play };
  };

  let player1 = Player("player1", "X");
  let player2 = Player("player2", "O");

  const updatePlayerNames = function () {
    player1.name = nameInputPlayer1.value || "player1";
    player2.name = nameInputPlayer2.value || "player2";
  };

  nameInputs.forEach((element) => {
    element.addEventListener("focusout", updatePlayerNames);
  });

  return { player1, player2 };
})();

const gameController = (() => {
  let { player1, player2 } = players;
  let gameActive;
  let round;
  let activePlayer;
  let winner;

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

  const initializeVariables = function () {
    gameActive = true;
    round = 1;
    activePlayer = player1;
    winner = "";
  };

  initializeVariables();

  const playRound = function (boardIndex) {
    if (gameActive === false) return;
    activePlayer.play(boardIndex);
    gameBoard.printBoard();
    checkForWin(gameBoard.getBoard());
    checkForDraw();
    switchPlayerTurn();
    round++;
  };

  const switchPlayerTurn = function () {
    activePlayer = activePlayer === player1 ? player2 : player1;
    displayController.showActivePlayer(activePlayer);
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
    winner = player;
    gameActive = false;
    console.log(`${player.name} WINS!`);
    displayController.showWinningPattern(pattern);
    displayController.showMessage(`${player.name} WINS! 🏆`);
  };

  const checkForDraw = function () {
    if (round === 9 && winner === "") {
      gameActive = false;
      console.log(`DRAW`);
      displayController.showMessage(`DRAW`);
    }
  };

  const restartGame = function () {
    gameBoard.resetBoard();
    gameBoard.printBoard();
    initializeVariables();
    displayController.showActivePlayer(activePlayer);
  };

  const gameStatusActive = function () {
    return gameActive;
  };

  return { playRound, winningPatterns, restartGame, gameStatusActive };
})();

const displayController = (() => {
  const player1MarkerEl = document.querySelector(".x");
  const player2MarkerEl = document.querySelector(".o");
  const btnRestartEl = document.querySelector(".btn-restart");
  const iconRestartEl = document.querySelector(".icon-restart");
  const messageDisplayEl = document.querySelector(".message-display");
  const gameBoardEl = document.querySelector(".game-board");

  const clickHandlerBoard = function (e) {
    const clickTarget = e.target;
    const boardIndex = clickTarget.dataset.boardIndex;
    if (!clickTarget.classList.contains("game-cell")) return;
    if (clickTarget.classList.contains("full")) return;
    gameController.playRound(boardIndex);
    updateDisplay();
  };

  gameBoardEl.addEventListener("click", clickHandlerBoard);

  const showActivePlayer = function (player) {
    if (!gameController.gameStatusActive()) {
      player1MarkerEl.classList.remove("active");
      player2MarkerEl.classList.remove("active");
      return;
    }
    if (player === players.player1) {
      player1MarkerEl.classList.add("active");
      player2MarkerEl.classList.remove("active");
    }
    if (player === players.player2) {
      player1MarkerEl.classList.remove("active");
      player2MarkerEl.classList.add("active");
    }
  };

  const updateDisplay = function () {
    const board = gameBoard.getBoard();
    for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
      const cell = gameBoardEl.children[boardIndex];
      const marker = board[boardIndex];
      cell.textContent = marker;
      if (cell.textContent) {
        cell.classList.remove("empty");
        cell.classList.add("full");
      } else {
        cell.classList.add("empty");
        cell.classList.remove("full");
      }
    }
  };

  const showWinningPattern = function (pattern) {
    gameController.winningPatterns[pattern].map((boardIndex) => {
      gameBoardEl.children[boardIndex - 1].classList.add("win");
    });
  };

  const clearWinningPattern = function () {
    for (let child of gameBoardEl.children) {
      child.classList.remove("win");
    }
  };

  const showMessage = function (message) {
    messageDisplayEl.textContent = `${message}`;
    messageDisplayEl.classList.remove("off");
    iconRestartEl.classList.remove("off");
  };

  const clickHandlerRestart = function () {
    if (gameController.gameStatusActive() === true) return;
    gameController.restartGame();
    updateDisplay();
    clearWinningPattern();
    messageDisplayEl.textContent = "";
    messageDisplayEl.classList.add("off");
    iconRestartEl.classList.add("off");
  };

  btnRestartEl.addEventListener("click", clickHandlerRestart);

  return { showActivePlayer, showWinningPattern, showMessage };
})();
