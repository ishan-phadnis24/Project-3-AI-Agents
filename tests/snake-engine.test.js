import test from "node:test";
import assert from "node:assert/strict";

import {
  createInitialState,
  placeFood,
  queueDirection,
  stepGame,
} from "../src/snake-engine.js";

test("moves the snake one cell in the queued direction", () => {
  const state = createInitialState(() => 0);
  const nextState = stepGame(state, () => 0);

  assert.deepEqual(nextState.snake[0], { x: 3, y: 8 });
  assert.equal(nextState.score, 0);
});

test("prevents direct reversal into the snake body", () => {
  const state = createInitialState(() => 0);
  const nextState = queueDirection(state, "left");

  assert.equal(nextState.queuedDirection, "right");
});

test("grows and increases score when food is eaten", () => {
  const state = {
    ...createInitialState(() => 0),
    food: { x: 3, y: 8 },
  };

  const nextState = stepGame(state, () => 0);

  assert.equal(nextState.snake.length, 4);
  assert.equal(nextState.score, 1);
});

test("ends the game on wall collision", () => {
  const state = {
    ...createInitialState(() => 0),
    snake: [{ x: 15, y: 8 }],
    direction: "right",
    queuedDirection: "right",
  };

  const nextState = stepGame(state, () => 0);

  assert.equal(nextState.isGameOver, true);
});

test("places food only on open cells", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  const food = placeFood(snake, 2, () => 0);

  assert.deepEqual(food, { x: 1, y: 1 });
});
