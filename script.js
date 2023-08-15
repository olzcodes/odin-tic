// GAMEBOARD

const gameBoard = (() => {
  let state = [];
  const htmlElement = document.querySelector(".game-board");

  const placeMarker = function (boardPosition, marker) {
    const boardIndex = boardPosition.dataset.boardIndex;
    if (state[boardIndex]) return;
    state[boardIndex] = marker;
    boardPosition.textContent = `${marker}`;
    boardPosition.classList.remove("empty");
    boardPosition.classList.add("full");
  };

  return { state, htmlElement, placeMarker };
})();

// PLAYERS

const Player = (name, marker) => {
  const play = (boardPosition, marker) =>
    gameBoard.placeMarker(boardPosition, marker);
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
    activePlayer.play(boardPosition, activePlayer.marker);
    console.log(gameBoard.state);
    activePlayer === player1
      ? (activePlayer = player2)
      : (activePlayer = player1);
  });
})();
