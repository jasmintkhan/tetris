/*
 * board.js
 * 
 * manages the Tetris game board, including the grid, current and next tetromino pieces,
 *      piece movement, collision detection, line clearing, and the hold feature
 * handles the drawing and updating of the board and its elements
 */

class Board {
    ctx;       // canvas context for the game board
    ctxNext;   // canvas context for the next piece display
    ctxHold;   // canvas context for the hold piece display
    grid;      // 2D array representing the game board
    piece;     // current active tetromino piece
    next;      // next tetromino piece
    requestId; // animation frame request ID for game control
    time;      // timer for tracking piece fall speed
    hold;      // tetromino piece in hold
    canHold;   // flag to track if the player can hold a piece

    constructor(ctx, ctxNext, ctxHold) {
        this.ctx = ctx;
        this.ctxNext = ctxNext;
        this.ctxHold = ctxHold;
        this.init();
    }

    // initialize the board canvas size and scaling
    init() {
        // calculate size of canvas from board size
        this.ctx.canvas.width = COLS * BLOCK_SIZE;
        this.ctx.canvas.height = ROWS * BLOCK_SIZE;

        // scale so we don't need to give size on every draw
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    setPiece(piece) {
        this.piece = piece;
    }

    // reset board when new game
    reset() {
        this.grid = this.getEmptyBoard(); // initialize an empty board
        this.piece = new Piece(this.ctx); // spawn a new piece
        this.piece.setStartingPosition(); // set starting position for the piece
        this.getNewPiece(); // prepare the next piece
        this.canHold = true; // allow holding pieces
        this.hold = null;    // reset hold piece
        this.ctxHold.clearRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);  // clear hold display
    }

    // generate a new random piece for the "next" display
    getNewPiece() {
        this.next = new Piece(this.ctxNext);

        const offsetX = Math.floor((4 - this.next.shape[0].length) / 2);
        const offsetY = Math.floor((4 - this.next.shape.length) / 2);

        this.ctxNext.clearRect(
            0, 
            0, 
            this.ctxNext.canvas.width, 
            this.ctxNext.canvas.height
        );
        this.next.x = 0;
        this.next.y = 0;
        this.next.draw();
    }

    // draw the current game state, including ghost piece and board
    draw() {
        this.drawGhostPiece();
        this.piece.draw();
        this.drawBoard();
    }

    // get matrix filled with zeros
    getEmptyBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    // check if move is valid (no collision and within bounds)
    valid(p) {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return (
                    value === 0 || // Empty cell in shape
                    (this.insideWalls(x) && this.aboveFloor(y) && !this.occupied(x, y))
                );
            });
        });
    }
    
    // check if piece is within walls
    insideWalls(x) {
        return x >= 0 && x < COLS;
    }

    // check if piece is above the floor (within board)
    aboveFloor(y) {
        return y < ROWS;
    }

    // check if a cell is occupied
    occupied(x, y) {
        return this.grid[y] && this.grid[y][x] !== 0;
    }

    // moves the piece down by one step or freezes it if it can't move further
    drop() {
        // move the piece down
        let p = moves[KEY.DOWN](this.piece);
        if (this.valid(p)) {
            this.piece.move(p);
        } else {
            // freeze piece if it cant move down
            this.freeze();
            this.clearLines();
            if(this.piece.y === 0) {
                return false;  // game over
            }
            this.piece = this.next;
            this.piece.ctx = this.ctx;
            this.piece.setStartingPosition();
            this.getNewPiece();
            this.canHold = true;
        }
        return true;
    }

    // freeze the piece onto the board
    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = {
                        value: value,
                        color: this.piece.color
                    }
                }
            });
        });
    }

    // draw the board
    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell && cell.value > 0) {
                    this.ctx.fillStyle = cell.color;
                    this.ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    // rotate the piece
    rotate(piece) {
        // clone piece for immutability
        let clone = JSON.parse(JSON.stringify(piece));

        // transpose matrix
        for(let y = 0; y < clone.shape.length; ++y) {
            for(let x = 0; x < y; ++x) {
                [clone.shape[x][y], clone.shape[y][x]] = [clone.shape[y][x], clone.shape[x][y]];
            }
        }

        // reverse rows for clockwise rotation
        clone.shape.forEach(row => row.reverse());
        return clone;
    }

    // clear line if full
    clearLines() {
        let lines = 0;
        this.grid.forEach((row, y) => {
            if (row.every(cell => cell && cell.value > 0)) {
                lines++;
                // remove the row
                this.grid.splice(y, 1);
                // add zero filled row at the top
                this.grid.unshift(Array(COLS).fill(0));
            }
        });
        if(lines > 0) {
            account.score += this.getLineClearPoints(lines) * account.level;
            account.lines += lines;
            
            if(lines === 4) {
                account.combo++;
                account.score += 50 * account.level * account.combo;
            }
            else {
                account.combo = 0;
            }
            // if we have reached the lines for next level
            if(account.lines >= LINES_PER_LEVEL) {
                account.level++;
                account.lines -= LINES_PER_LEVEL;
                time.level = LEVEL[account.level];
            }
        }
    }

    // get points for clearing lines
    getLineClearPoints(lines) {
        return lines === 1 ? POINTS.SINGLE :
               lines === 2 ? POINTS.DOUBLE :
               lines === 3 ? POINTS.TRIPLE :
               lines === 4 ? POINTS.TETRIS : 
               0;
      }

    // allows the player to hold the current piece and swap it with the hold piece, if available
    holdPiece() {
        if (!this.canHold) {
            return;  // Don't allow holding more than once per piece
        }
    
        // If there's already a piece in the hold box, swap it with the current piece
        if (this.hold) {
            let temp = this.hold;
            this.hold = this.piece;
            this.hold.shape = SHAPES[this.hold.typeId];
            this.piece = temp;
            this.piece.ctx = this.ctx;  // Reassign the piece's context
            this.piece.setStartingPosition();
        } else {
            // Put the current piece into hold and spawn a new one
            this.hold = this.piece;
            this.hold.shape = SHAPES[this.hold.typeId];
            this.piece = this.next;
            this.piece.ctx = this.ctx;  // Reassign the piece's context
            this.piece.setStartingPosition();
            this.getNewPiece();
        }
    
        this.hold.ctx = this.ctxHold;  // Set the hold piece's context
        this.ctxHold.clearRect(
            0, 
            0, 
            this.ctxHold.canvas.width, 
            this.ctxHold.canvas.height
        );  // Clear the hold box
        this.hold.x = 0;
        this.hold.y = 0;
        this.hold.draw(0, 0);
    
        this.canHold = false;  // Prevent holding again until next piece spawns
    }
    
    // get the ghost piece's location based on the current piece's drop position
    getDropPosition(piece) {
        // clone the current piece to test its position
        let p = { ...piece };
    
        // continuously move the piece down until it collides
        while (this.valid(moves[KEY.DOWN](p))) {
            p = moves[KEY.DOWN](p); // Move down
        }
    
        return p;  // return the last valid position (where it would land)
    }

    // draw the ghost piece that shows where the current piece will land
    drawGhostPiece() {
        const ghostPiece = this.getDropPosition(this.piece); // Get landing position
    
        // Set the ghost piece color to a lighter/transparent version of the current piece
        this.ctx.strokeStyle = this.piece.color;
        this.ctx.lineWidth = 0.05;
    
        // Draw the ghost piece at the landing position
        ghostPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.strokeRect(ghostPiece.x + x, ghostPiece.y + y, 1, 1);
                }
            });
        });
    }
    
}

