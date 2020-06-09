/**
 * This JavaScript program allows the user to play the classic 1990 video game of Minesweeper (Flower Field).
 *
 * Goal is to uncover all the squares on a grid that do not contain mines without being "blown up"
 * by clicking on a square with a mine underneath. Clicking on the game board will revel what is
 * hidden underneath the chosen square. Squares that contain a number (from 1-8), with each number
 * being the number of mines adjacent to the uncovered square.
 *
 * To help player avoid hitting a mine, the location of a suspected mine can be marked by flagging it
 * with the right mouse button or flag icon.
 *
 * This game has three difficulty levels:
 *          1 (Beginner)      => 10 mines board size 10x10.
 *          2 (Intermediate)  => 40 mines board size 16x16.
 *          3 (Expert)        => 99 mines board size 30x16.
 *
 *
 * @author Steven Phun
 * @since June 8, 2020.
 */


/*jshint esversion: 6 */


/*** JavaScript Classes ***/

/**
 * @classdesc represents the game board.
 */
class Minesweeper {
    constructor(level) {
        this.mines = this.setMineSize(level);            // {number} the number of mines in the game.
        this.row = this.setRowSize(level);               // {number} the number of rows for the game board.
        this.col = this.setColumnSize(level);            // {number} the number of columns for the game board.
        this.board = this.gameBoard(this.row, this.col); // {array} the grid for the game board.
    }

    /**
     * @function set the amount of mines depending on the level of the game board.
     *
     * @param level {number} the level of difficulty.
     *
     * @return {number} the mine amount.
     */
    setMineSize(level) {
        if (level === 1) return 10;
        if (level === 2) return 40;
        if (level === 3) return 99;
    }

    /**
     * @function set the number of columns depending on the level of the game board.
     *
     * @param level {number} the level of difficulty.
     *
     * @return {number} the column size.
     */
    setColumnSize(level) {
        if (level === 1) return 10;
        if (level === 2) return 16;
        if (level === 3) return 30;
    }

    /**
     * @function set the number of rows depending on the difficulty of the game board.
     *
     * @param difficulty {number} the level of difficulty.
     *
     * @return {number} the row size.
     */
    setRowSize(difficulty) {
        if (difficulty === 1) return 10;

        return 16; // difficulty 2 and 3 row size is 16
    }

    /**
     * @function generates a game board for the game.
     *
     * @param row {number} the number of rows.
     * @param col {number} the number columns.
     */
    gameBoard(row, col) {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {

            }
        }
    }
}

/**
 * @classdesc represents one individual block for the game.
 */
class Block {
    constructor() {
    }
}

/**
 * @classdesc represents the time the user has left to beat the game.
 */
class Timer {
    constructor() {
    }
}



/*** JavaScript Functions ***/