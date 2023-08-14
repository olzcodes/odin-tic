const gameBoard = (() => {
  let state = {};

  const placeMarker = function (boardIndex, marker, name) {
    if (gameBoard.state[boardIndex]) return;
    gameBoard.state[boardIndex] = marker;
    console.log(`${name} places ${marker} in [${boardIndex}]`);
  };

  return { state, placeMarker };
})();

const Player = (name, marker) => {
  const play = (boardIndex, marker) =>
    gameBoard.placeMarker(boardIndex, marker, name);
  return { name, marker, play };
};

const player1 = Player("player1", "X");
const player2 = Player("player2", "O");

const playRound = function (state, activePlayer) {
  const boardIndex = prompt(
    `${activePlayer.name} next move? \n[1][2][3]\n[4][5][6]\n[7][8][9]`
  );
  activePlayer.play(boardIndex, activePlayer.marker);

  console.log(state);
};

const runGame = (function () {
  let activePlayer = player1;

  for (let round = 1; round < 10; round++) {
    console.log(`ROUND ${round}`);
    playRound(gameBoard.state, activePlayer);
    activePlayer === player1
      ? (activePlayer = player2)
      : (activePlayer = player1);
  }
})();
