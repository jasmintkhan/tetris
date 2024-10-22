/*
 * game.js
 * 
 * main game logic for the Tetris implementation
 * handles game initialization, key event handling, game state updates, and animations
 * 
 */

// global variables for game control and timing
let requestId; // store the animation frame ID 
let time = { start: 0, elapsed: 0, level: 1000 }; // timer for dropping pieces
let isGameOver = false; // game state tracker

// canvas and context initialization for the game board, next piece display, and hold piece display
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');
const canvasHold = document.getElementById('hold');
const ctxHold = canvasHold.getContext('2d');

// game account object to track score, lines cleared, and current level
let accountValues = {
    score: 0,
    lines: 0,
    level: 1,
    combo: 0
  };
  
// proxy to automatically update the HTML display when game stats change
function updateAccount(key, value) {
    let element = document.getElementById(key);
    if (element) {
        element.textContent = value;
    }
}
  
let account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});
  
// initialize game board and movement mappings
let board = new Board(ctx, ctxNext, ctxHold);
let moves;

addEventListener(); // set up event listeners for key input
initNext(); // initialize the next piece canvas
initHold(); // initialize the hold piece canvas
updateMoves(); // update moves mapping for the first time

function updateMoves() {
    moves = {
        [KEY.LEFT]: p => ({ ...p, x: p.x - 1 }),
        [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
        [KEY.DOWN]: p => ({ ...p, y: p.y + 1 }),
        [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
        [KEY.UP]: p => board.rotate(p)
    };
}

function initNext() {
    // calculate size of canvas from board size
    ctxNext.canvas.width = 4 * BLOCK_SIZE;
    ctxNext.canvas.height = 4 * BLOCK_SIZE;

    // scale so we don't need to give size on every draw
    ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function initHold() {
    // calculate size of canvas from board size
    ctxHold.canvas.width = 4 * BLOCK_SIZE;
    ctxHold.canvas.height = 4 * BLOCK_SIZE;

    // scale so we don't need to give size on every draw
    ctxHold.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function resetGame() {
    account.score = 0;
    account.lines = 0;
    account.level = 1;
    isGameOver = false;
    board.reset();
    time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
}

// stub function for playing against an AI (not yet implemented)
function playVsAI() {
    alert('This game mode is not implemented yet.');
}

// start a solo game, reset the game state and begin animation loop
function playSolo() {
    document.getElementById('play-buttons').style.display = 'none';
    document.getElementById('game-over-message').style.display = 'none'; 
    document.getElementById('quit-buttons').style.display = 'none';
    document.getElementById('option-button').style.display = 'none';
    resetGame();
    time.start = performance.now();
    
    // cancel an old game if still running
    if (requestId) {
        cancelAnimationFrame(requestId);
    }
    
    animate();
}

// updates the game state, renders the board, and requests the next animation frame
function animate(now = 0) {
    // update elapsed time
    time.elapsed = now - time.start;

    // if elapsed time has passed time for current level
    if (time.elapsed > time.level) {
        time.start = now;
        if (!board.drop()) {
            gameOver();
            return;
        }
    }

    // clear board before drawing new state
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();

    // request animation frame
    requestId = requestAnimationFrame(animate);
} 

function gameOver() {
    cancelAnimationFrame(requestId);
    isGameOver = true;
    document.getElementById('game-over-message').style.display = 'block'; 
    document.getElementById('play-buttons').style.display = 'flex';
    document.getElementById('option-button').style.display = 'block';
}

// handles keypress events for gameplay actions, including movement, pause, and hold functionality
function addEventListener() {
    document.addEventListener('keydown', event => {
        if (document.getElementById('options-modal').style.display === 'block') {
            return; // Don't allow any keyboard input if the options modal is open
        }

        if(isGameOver) {
            return;
        }
        if(event.code === KEY.ESC) {
            pause();
            return;
        }
        if(event.code === KEY.HOLD) {
            board.holdPiece();
            return;
        }
        if(event.code === KEY.SPACE) {
            event.preventDefault(); // prevent the default action (scroll / move caret)
        }
        if (moves[event.code]) {
            event.preventDefault(); // prevent the default action (scroll / move caret)
            
            // calculate new position for piece
            let newPos = moves[event.code](board.piece);
            
            if(event.code === KEY.SPACE) {
                while (board.valid(newPos)) {
                    account.score += POINTS.HARD_DROP;
                    board.piece.move(newPos);
                    newPos = moves[KEY.DOWN](board.piece);
                }
            }
    
            // check if valid or not
            else if (board.valid(newPos)) {
                board.piece.move(newPos);
                if (event.code === KEY.DOWN) {
                    account.score += POINTS.SOFT_DROP;
                }
            }
            
        }
    });
}

// toggles the game's pause state by stopping or resuming the animation loop and displaying relevant messages
function pause() {
    if (isGameOver) {
        return;
    }

    if (!requestId) {
        document.getElementById('pause-message').style.display = 'none';
        document.getElementById('quit-buttons').style.display = 'none';
        document.getElementById('option-button').style.display = 'none';
        animate();
        return;
    }
  
    cancelAnimationFrame(requestId);
    requestId = null;
    
    document.getElementById('pause-message').style.display = 'block';
    document.getElementById('quit-buttons').style.display = 'block';
    document.getElementById('option-button').style.display = 'block';
}

  function quitGame() {
    gameOver();  // end the game by showing game over
    document.getElementById('pause-message').style.display = 'none';  // hide pause message
    document.getElementById('quit-buttons').style.display = 'none';  // hide quit button
}