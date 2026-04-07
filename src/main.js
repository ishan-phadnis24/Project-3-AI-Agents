import {
  GRID_SIZE,
  INITIAL_TICK_MS,
  createInitialState,
  queueDirection,
  stepGame,
  togglePause,
} from "./snake-engine.js";

const board = document.querySelector("#game-board");
const score = document.querySelector("#score");
const message = document.querySelector("#message");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const controlButtons = document.querySelectorAll("[data-direction]");

let state = createInitialState();
let timerId = null;

renderBoard();
renderState();
startLoop();

window.addEventListener("keydown", handleKeydown);
pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  renderState();
});
restartButton.addEventListener("click", restartGame);

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateDirection(button.dataset.direction);
  });
});

function startLoop() {
  stopLoop();
  timerId = window.setInterval(() => {
    state = stepGame(state);
    renderState();
  }, INITIAL_TICK_MS);
}

function stopLoop() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function restartGame() {
  state = createInitialState();
  renderState();
  startLoop();
}

function handleKeydown(event) {
  const keyToDirection = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    a: "left",
    s: "down",
    d: "right",
  };

  if (event.key === " ") {
    event.preventDefault();
    state = togglePause(state);
    renderState();
    return;
  }

  if (event.key === "Enter" && state.isGameOver) {
    restartGame();
    return;
  }

  const direction = keyToDirection[event.key];
  if (!direction) {
    return;
  }

  event.preventDefault();
  updateDirection(direction);
}

function updateDirection(direction) {
  state = queueDirection(state, direction);
  renderState();
}

function renderBoard() {
  const cells = [];

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    cells.push(cell);
  }

  board.replaceChildren(...cells);
}

function renderState() {
  const cells = board.children;

  for (const cell of cells) {
    cell.className = "cell";
  }

  state.snake.forEach((segment, index) => {
    const cell = getCell(segment.x, segment.y);
    if (!cell) {
      return;
    }

    cell.classList.add("snake");
    if (index === 0) {
      cell.classList.add("head");
    }
  });

  if (state.food) {
    const foodCell = getCell(state.food.x, state.food.y);
    foodCell?.classList.add("food");
  }

  score.textContent = String(state.score);
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";

  if (state.isGameOver) {
    message.textContent = "Game over. Press Restart or Enter to play again.";
    stopLoop();
    return;
  }

  if (state.isPaused) {
    message.textContent = "Paused. Press Space or Resume to continue.";
    return;
  }

  message.textContent = "Use arrow keys or WASD to steer the snake.";
}

function getCell(x, y) {
  return board.children[y * GRID_SIZE + x] ?? null;
}
