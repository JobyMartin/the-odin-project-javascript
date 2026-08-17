const gameboard = (function () {
  const EMPTY = null;
  const SIZE = 9;

  const cells = Array(SIZE).fill(EMPTY);

  const getCells = () => [...cells];

  const isValidIndex = (index) =>
    Number.isInteger(index) && index >= 0 && index < SIZE;

  const placeMark = (index, mark) => {
    if (!isValidIndex(index)) return false;
    if (cells[index] !== EMPTY) return false;

    cells[index] = mark;
    return true;
  };

  const reset = () => {
    cells.fill(EMPTY);
  };

  return { EMPTY, SIZE, getCells, placeMark, reset };
})();

const createPlayer = (name, mark) => {
  return { name, mark };
};

const gameController = (function () {
  const WINNING_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const DEFAULT_NAMES = { X: "Player X", O: "Player O" };

  let players = [];
  let activePlayer = null;
  let winner = null;
  let gameOver = false;

  const start = (nameX = DEFAULT_NAMES.X, nameO = DEFAULT_NAMES.O) => {
    players = [createPlayer(nameX, "X"), createPlayer(nameO, "O")];

    gameboard.reset();
    activePlayer = players[0];
    winner = null;
    gameOver = false;
  };

  const findWinner = () => {
    const cells = gameboard.getCells();

    const winningLine = WINNING_LINES.find(([a, b, c]) => {
      return (
        cells[a] !== gameboard.EMPTY &&
        cells[a] === cells[b] &&
        cells[a] === cells[c]
      );
    });

    if (!winningLine) return null;

    return players.find((player) => player.mark === cells[winningLine[0]]);
  };

  const isBoardFull = () =>
    gameboard.getCells().every((cell) => cell !== gameboard.EMPTY);

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playRound = (index) => {
    if (gameOver) return false;
    if (!gameboard.placeMark(index, activePlayer.mark)) return false;

    winner = findWinner();

    if (winner || isBoardFull()) {
      gameOver = true;
    } else {
      switchActivePlayer();
    }

    return true;
  };

  const restart = () => start(players[0].name, players[1].name);

  const getActivePlayer = () => activePlayer;

  const getResult = () => ({
    over: gameOver,
    winner,
    tie: gameOver && winner === null,
  });

  start();

  return { start, playRound, restart, getActivePlayer, getResult };
})();

const displayController = (function () {
  const board = document.querySelector(".board");
  const status = document.querySelector(".game__status");
  const restartButton = document.querySelector(".game__restart");
  const playerForm = document.querySelector(".game__players");
  const resultModal = document.querySelector(".result-modal");
  const resultMessage = document.querySelector(".result-modal__message");
  const playAgainButton = document.querySelector(".result-modal__play-again");
  const newGameButton = document.querySelector(".result-modal__new-game");

  const statusText = () => {
    const { winner, tie } = gameController.getResult();

    if (tie) return "It's a tie!";
    if (winner) return `${winner.name} wins!`;

    return `${gameController.getActivePlayer().name}'s turn`;
  };

  const render = () => {
    const cells = gameboard.getCells();
    const { over } = gameController.getResult();

    board.replaceChildren(
      ...cells.map((cell, index) => {
        const button = document.createElement("button");
        button.dataset.index = index;
        button.textContent = cell ?? "";
        button.disabled = over || cell !== gameboard.EMPTY;
        return button;
      })
    );

    const message = statusText();

    status.textContent = message;
    resultMessage.textContent = message;
    resultModal.classList.toggle("modal-wrapper--active", over);
  };

  const restartGame = () => {
    gameController.restart();
    render();
  };

  const newGame = () => {
    gameController.start();
    playerForm.reset();
    playerForm.hidden = false;
    render();
  };

  board.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (gameController.playRound(Number(button.dataset.index))) render();
  });

  restartButton.addEventListener("click", restartGame);
  playAgainButton.addEventListener("click", restartGame);
  newGameButton.addEventListener("click", newGame);

  playerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const names = new FormData(playerForm);

    gameController.start(
      names.get("playerX").trim() || undefined,
      names.get("playerO").trim() || undefined
    );

    playerForm.hidden = true;
    render();
  });

  return { render };
})();

displayController.render();