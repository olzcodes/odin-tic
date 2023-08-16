// GAMEBOARD

const gameBoard = (() => {
  let state = [];
  const htmlElement = document.querySelector(".game-board");
  const messageDisplayEl = document.querySelector(".message-display");

  const placeMarker = function (boardPosition, marker) {
    const boardIndex = boardPosition.dataset.boardIndex;
    if (state[boardIndex]) return;
    state[boardIndex] = marker;
    boardPosition.textContent = `${marker}`;
    boardPosition.classList.remove("empty");
    boardPosition.classList.add("full");
  };

  const displayWinner = function (pattern, winner) {
    winningPatterns[pattern].map((boardIndex) => {
      htmlElement.children[boardIndex - 1].classList.add("win");
      messageDisplayEl.textContent = `${winner.name} WINS! 🏆`;
      messageDisplayEl.classList.remove("off");
    });
  };

  return { state, htmlElement, placeMarker, displayWinner };
})();

// PLAYERS

const Player = (name, marker) => {
  const play = (boardPosition) => gameBoard.placeMarker(boardPosition, marker);
  return { name, marker, play };
};

const player1 = Player("player1", "X");
const player2 = Player("player2", "O");

// GAME

const runGame = (function () {
  let activePlayer = player1;
  gameBoard.htmlElement.addEventListener("click", function (e) {
    const boardPosition = e.target;
    if (boardPosition.textContent) return;
    activePlayer.play(boardPosition);
    checkForWin(winningPatterns, gameBoard.state);
    activePlayer === player1
      ? (activePlayer = player2)
      : (activePlayer = player1);
  });
})();

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

const checkForWin = function (winningPatterns, state) {
  for (let pattern = 0; pattern < winningPatterns.length; pattern++) {
    const output = winningPatterns[pattern].map(
      (boardIndex) => state[boardIndex - 1]
    );
    if (output.join("") === "XXX") endGame(pattern, player1);
    if (output.join("") === "OOO") endGame(pattern, player2);
  }
};

const endGame = function (pattern, winner) {
  gameBoard.displayWinner(pattern, winner);
};
