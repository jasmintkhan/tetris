# Tetris

A browser-based implementation of the classic **Tetris** game, developed using JavaScript, HTML5, and CSS. This version includes modern features like **custom key bindings**, real-time **piece movement**, a dynamic **scoring system**, and a **dark mode toggle**. While the game already includes many Tetris mechanics, an AI mode is in development and will be coming soon!

<img width="1440" alt="Screenshot 2024-10-22 at 9 54 20 AM" src="https://github.com/user-attachments/assets/ad0c278b-8571-4f7a-adab-76fed8cfd29c">

## Features

### 1. **Game Mechanics**
- **Classic Tetris Rules:** The goal is to clear lines by completing rows of blocks, which are created from falling tetrominoes.
- **Seven Tetrominoes:** All traditional shapes are supported (I, J, L, O, S, T, Z pieces).
- **Real-Time Piece Movement:** Pieces can be moved left, right, or down, rotated, and hard-dropped for faster gameplay.
- **Ghost Piece:** A shadow piece is displayed at the lowest possible landing position, allowing you to better strategize your moves.
- **Hold Queue:** Players can hold one tetromino and swap it out later.
- **Next Piece Preview:** The next tetromino to fall is shown to help players plan ahead.

https://github.com/user-attachments/assets/2c44bb2a-54b0-4333-8d11-fc942449a6f5

### 2. **Custom Key Bindings**
- **Rebindable Controls:** Players can customize their movement keys (left, right, down, rotate, hold, drop, and pause). This allows for a personalized and comfortable gaming experience.
- **Reset to Defaults:** The controls can be reset to their default bindings at any time.
  
<img width="1440" alt="Screenshot 2024-10-24 at 2 39 28 PM" src="https://github.com/user-attachments/assets/fe317e02-12bd-4dcb-9430-f117d42a486e">

### 3. **Dark Mode**
- **Dark Mode Option:** Players can toggle between light and dark modes via a button in settings. This feature provides a more comfortable viewing experience in low-light environments.
- **Theme Persistence:** The game remembers your dark mode preference between sessions using `localStorage`.
  
<img width="1440" alt="Screenshot 2024-10-24 at 2 38 24 PM" src="https://github.com/user-attachments/assets/140629c8-0328-4c3b-87ce-f81db025551e">

### 4. **Scoring System**
- **Points:** Points are awarded for different actions:
  - **Soft Drop:** 1 point per cell.
  - **Hard Drop:** 2 points per cell.
  - **Line Clears:** 
    - Single Line: 100 points
    - Double Line: 300 points
    - Triple Line: 500 points
    - Tetris (Four Lines): 800 points
- **Combos:** Bonus points are awarded for back-to-back Tetrises.
- **Level Progression:** The game speeds up as players clear more lines. Levels increase every 10 cleared lines, with each level speeding up tetromino drops.

### 5. **Game States**
- **Pause and Resume:** The game can be paused and resumed.
- **Game Over:** The game ends if tetrominoes stack above the top of the grid.
- **New Game:** Players can restart at any time.
  
<img width="1440" alt="Screenshot 2024-10-22 at 9 55 48 AM" src="https://github.com/user-attachments/assets/7d5ce114-1e4e-4229-be8c-9945cae7db59">

<img width="1440" alt="Screenshot 2024-10-22 at 9 58 28 AM" src="https://github.com/user-attachments/assets/52c3113d-d91c-4994-9904-e906c88c8598">

### 6. **Planned Features**
- **AI Mode:** A challenging AI opponent is in development, allowing players to test their skills against an advanced computer player.

<img width="1440" alt="Screenshot 2024-10-22 at 9 56 07 AM" src="https://github.com/user-attachments/assets/cd239d81-1dfe-4402-b987-f5638a7a07bf">

## Setup and Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/jasmintkhan/tetris.git
2. **Navigate into directory:**
   ```bash
   cd tetris
3. **Run the game:** Simply open index.html in your preferred browser to start playing.

## Key Files
- **index.html:** The main HTML file that sets up the game structure and user interface.
- **style.css:** The CSS file that handles the visual design of the game.
- **game.js:** Contains the core game logic including piece movement, scoring, and game state.
- **board.js:** Manages the game board, piece placement, line clearing, and rendering.
- **piece.js:** Defines the behavior and properties of individual tetrominoes.
- **options.js:** Handles the customization of key bindings and game options.
- **constants.js:** Contains essential constants like tetromino shapes, color definitions, and key mappings.

## Controls (Default)
- **Move Left:** Left Arrow
- **Move Right:** Right Arrow
- **Move Down (Soft Drop):** Down Arrow
- **Rotate:** Up Arrow
- **Hard Drop:** Space
- **Hold:** C
- **Pause:** Escape

## License
This project is licensed under GNU GPLv3
