export const GRID_SIZE = 16;
export const INITIAL_DIRECTION = "right";
export const INITIAL_TICK_MS = 160;

const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createInitialState(random = Math.random) {
  const snake = [
    { x: 2, y: 8 },
    { x: 1, y: 8 },
    { x: 0, y: 8 },
  ];

  return {
    gridSize: GRID_SIZE,
    snake,
    direction: INITIAL_DIRECTION,
    queuedDirection: INITIAL_DIRECTION,
    food: placeFood(snake, GRID_SIZE, random),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection]) {
    return state;
  }

  if (state.snake.length > 1 && OPPOSITES[state.direction] === nextDirection) {
    return state;
  }

  return {
    ...state,
    queuedDirection: nextDirection,
  };
}

export function stepGame(state, random = Math.random) {
  if (state.isGameOver || state.isPaused) {
    return state;
  }

  const direction = state.queuedDirection;
  const vector = DIRECTION_VECTORS[direction];
  const head = state.snake[0];
  const nextHead = {
    x: head.x + vector.x,
    y: head.y + vector.y,
  };

  const willEat = positionsEqual(nextHead, state.food);
  const nextSnake = [nextHead, ...state.snake];

  if (!willEat) {
    nextSnake.pop();
  }

  if (hitsBoundary(nextHead, state.gridSize) || hitsSelf(nextHead, nextSnake)) {
    return {
      ...state,
      direction,
      isGameOver: true,
    };
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    queuedDirection: direction,
    food: willEat ? placeFood(nextSnake, state.gridSize, random) : state.food,
    score: willEat ? state.score + 1 : state.score,
  };
}

export function togglePause(state) {
  if (state.isGameOver) {
    return state;
  }

  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function placeFood(snake, gridSize, random = Math.random) {
  const openCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const occupied = snake.some((segment) => segment.x === x && segment.y === y);
      if (!occupied) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.floor(random() * openCells.length);
  return openCells[index];
}

function hitsBoundary(position, gridSize) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}

function hitsSelf(head, snake) {
  return snake.slice(1).some((segment) => positionsEqual(segment, head));
}

function positionsEqual(a, b) {
  return a?.x === b?.x && a?.y === b?.y;
}
