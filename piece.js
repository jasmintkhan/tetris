/*
 * piece.js
 * 
 * handles the creation, movement, and rendering of individual tetromino pieces in Tetris 
 * each piece has a shape, color, and behavior for spawning and drawing on the canvas
 */

class Piece {
    x;          // x-coordinate of the piece on the board
    y;          // y-coordinate of the piece on the board
    color;      // color of the tetromino
    shape;      // shape matrix representing the tetromino
    typeId;     // ID representing the type of tetromino
    ctx;        // canvas rendering context

    constructor(ctx) {
        this.ctx = ctx;
        this.spawn(); // spawn a new random piece
    }

    // spawn a new random piece by randomizing the type and setting its initial properties
    spawn() {
        this.typeId = this.randomizeTetrominoType(COLORS.length - 1);
        this.shape = SHAPES[this.typeId];
        this.color = COLORS[this.typeId];

        // starting position of the piece
        this.x = 0;
        this.y = 0;
    }

    // randomize the tetromino type based on the number of available types
    randomizeTetrominoType(noOfTypes) {
        return Math.floor(Math.random() * (noOfTypes + 1));
    }

    // draw the tetromino on the canvas at its current position
    draw(offsetX = 0, offsetY = 0) {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value,x) => {
                // if call is not empty, draw it
                if(value > 0) {
                    this.ctx.fillRect(this.x + x + offsetX, this.y + y + offsetY, 1, 1);
                }
            });
        });
    }

    // move the tetromino piece to a new position
    move(p) {
        this.x = p.x;  // update x-coordinate
        this.y = p.y;  // update y-coordinate
        this.shape = p.shape;  // update shape (for rotations)
    }
    
    // set the starting position of the piece based on its type
    setStartingPosition() {
        this.x = this.typeId === 4 ? 4 : 3; // O piece starts in the middle, others to the left
        this.y = this.typeId === 0 ? -1 : 0; // I piece starts higher up to prevent overlap
    }
}