/*
 * constants.js
 * 
 * contains constant values used throughout Tetris
 * including key mappings, shape definitions, game point values, and timing for levels
 */

// dimensions for the game grid and block size
const ROW = ROWS = 20;            // number of rows in the game board
const COL = COLUMN = COLS = 10;   // number of columns in the game board
const SQ = squareSize = 30;       // size of a single square block
const BLOCK_SIZE = 30;            // standard block size for rendering
const LINES_PER_LEVEL = 10;       // number of cleared lines needed to level up

// color array for different tetromino shapes
const COLORS = [
    'cyan',   // I piece
    'blue',   // J piece
    'orange', // L piece
    'yellow', // O piece
    'green',  // S piece
    'purple', // T piece
    'red'     // Z piece
];

// definitions of the 7 tetromino shapes used in the game
const SHAPES = [  
    [ // I piece
      [0, 0, 0, 0], 
      [1, 1, 1, 1],
      [0, 0, 0, 0], 
      [0, 0, 0, 0]
    ],
    [ // J piece
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0]
    ],
    [ // L piece
      [0, 0, 3],
      [3, 3, 3],
      [0, 0, 0]
    ],
    [ // O piece
      [4, 4],
      [4, 4]
    ],
    [ // S piece
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0]
    ],
    [ // T piece
      [0, 6, 0],
      [6, 6, 6],
      [0, 0, 0]
    ],
    [ // Z piece
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0]
    ]
];

// key mappings for controlling the game
const KEY = {
    LEFT: 'ArrowLeft',   // move piece left
    RIGHT: 'ArrowRight', // move piece right
    DOWN: 'ArrowDown',   // soft drop
    SPACE: 'Space',      // hard drop
    UP: 'ArrowUp',       // rotate piece
    ESC: 'Escape',       // pause game
    HOLD: 'KeyC',        // hold current piece
};
// no object freeze to allow customization of key mappings

// default key mappings for resetting controls
const DEFAULT_KEY = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  DROP: 'Space',
  UP: 'ArrowUp',
  ESC: 'Escape',
  HOLD: 'KeyC',
};
Object.freeze(DEFAULT_KEY); // prevent changes to default keys

// point values for different actions in the game
const POINTS = {
    SINGLE: 100,        // clearing one line
    DOUBLE: 300,        // clearing two lines
    TRIPLE: 500,        // clearing three lines
    TETRIS: 800,        // clearing four lines (Tetris)
    SOFT_DROP: 1,       // points per cell for soft drop
    HARD_DROP: 2        // points per cell for hard drop
};
Object.freeze(POINTS); // prevent changes to point values

// timing for each level (in milliseconds per drop interval)
const LEVEL = {
    1: 720,  // Level 1 drop speed
    2: 630,
    3: 550,
    4: 470,
    5: 380,
    6: 300,
    7: 220,
    8: 130,
    9: 100,
    10: 80,
    11: 80,  
    12: 80,
    13: 70,
    14: 70,
    15: 70,
    16: 50,
    17: 50,
    18: 50,
    19: 30,
    20: 30,  // Level 20 max speed
    // 29+ is 20ms
};
Object.freeze(LEVEL); // prevent changes to level timings
