# Running The Snake Game

## Start the app

From the repository root, run:

```bash
python3 -m http.server 4173
```

Then open:

- http://localhost:4173

If you have Node installed and want to run the logic tests:

```bash
node --test tests/*.test.js
```

## Manual verification checklist

- Arrow keys move the snake
- `W`, `A`, `S`, `D` also move the snake
- The snake cannot reverse directly into itself
- Eating food increases both score and snake length
- Hitting a wall ends the game
- Hitting the snake body ends the game
- `Pause` stops movement and `Resume` continues it
- `Restart` resets the game state
- On smaller screens, the on-screen control buttons work
