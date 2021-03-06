/**
 * This JavaScript program allows the user to play or have the program solve a 16x16 Sudoku.
 *
 * This game is based on the classic 9x9 Sudoku where the basic rules is similar.
 * Place the numbers 0-9 and letters A-F into each row, column and 4x4 section once
 *
 * @author Steven Phun.
 * @since May 13, 2020.
 */


/*jshint esversion: 6 */


/*** JavaScript Classes ***/

/**
 * @class represents the Sudoku grid.
 *
 * @param board {array}    the array to initialize the game with.
 * @param blank {boolean}  true, if 'board' is blank.
 */
class Sudoku {
  constructor(board, blank = false) {

    /** HTML tag instances. */
    this.keypad = document.querySelector("#keypad");
    this.table = document.querySelector("#sudoku>table");

    /** CSS class/id instance. */
    this.colorSetter = "setter-color";
    this.colorCorrect = "correct-color";
    this.colorWrong = "wrong-color";
    this.colorSelected = "selected-color";
    this.colorInvalid = "invalid-color";

    /** class instances. */
    this.blank = blank;                              // {boolean} true if this is a blank grid.
    this.invalid = []                                // {array}   stores the coordinates of invalid pairs.
    this.size = 16;                                  // {number}  represents the 16x16 grid.
    this.empty = "";                                 // {string}  represents an empty cell.
    this.row = null;                                 // {number}  the row index of the selected cell.
    this.col = null;                                 // {number}  the column index of the selected cell.
    this.board = this.toCell(this.deepCopy(board));  // {array} a deep copy of the playing board.
    this.copy = this.deepCopy(this.board);           // {array} a solution to the board in its original state.
    this.stopwatch = new Stopwatch();                // {clock} keeps track of user's playing time.

    this.setup();
  }

  /**
   * @function catch the user's mouse events.
   *
   * @param row       {number} the row index of selected cell.
   * @param col       {number} the column index of selected cell.
   */
  getMouseEvent(row, col) {
    this.updateSelectedCell(row, col);
    this.setSelected();
  }

  /**
   * @function finds a solution to do the Sudoku as fast as possible, so it will
   *           not consider any user's interactions that will delay its process.
   *
   * @param board {array} the board to be solved.
   * @return {boolean} true if there is a possible solution.
   */
  fastSolve(board) {
    // recursive backtracking
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col].data === this.empty) {
          for (let val = 0; val < this.size; val++) {
            if (this.validateCell(board, row, col, val)) {
              board[row][col].data = val;
              // base case: if val leads to a solution
              if (this.fastSolve(board)) {
                return true;
                // backtrack: if the val does not lead to a solution
              } else {
                board[row][col] = new Cell(this.empty);
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @param board {array}  the board that is being validated.
   * @param row   {number} row index of the cell.
   * @param col   {number} column index of the cell.
   * @param val   {number} value of the cell.
   *
   * @return {boolean} true, if there does not exists the same 'val' in its row, column, and 4x4 section.
   */
  validateCell(board, row, col, val) {
    return this.checkRow(board, row, val) && this.checkCol(board, col, val) && this.checkSection(board, row, col, val);
  }

  /**
   * @param board {array}  the board that is being validated.
   * @param row   {number} row index of the cell.
   * @param val   {number} value of the cell.
   *
   * @return {boolean} true if there does not exists the same element in this row.
   */
  checkRow(board, row, val) {
    for (let col = 0; col < this.size; col++) {
      if (board[row][col].data === val) return false;
    }
    return true;
  }

  /**
   * @param board {array}  the board that is being validated.
   * @param col   {number} column index of the cell.
   * @param val   {number} value of the cell.
   *
   * @return {boolean} true if there does not exists the same element in this column.
   */
  checkCol(board, col, val) {
    for (let row = 0; row < this.size; row++) {
      if (board[row][col].data === val) return false;
    }
    return true;
  }

  /**
   * @param board {array}  the board that is being validated.
   * @param row   {number} row index of the cell.
   * @param col   {number} column index of the cell.
   * @param val   {number} value of the cell.
   *
   * @return {boolean} true if there does not exists the same element in this 4x4 section.
   */
  checkSection(board, row, col, val) {
    const size = Math.sqrt(this.size); // represents the 4x4 section.

    // formula for the first cell in given 4x4 section.
    const rowSect = row - (row % size);
    const colSect = col - (col % size);

    for (let i = rowSect; i < rowSect + size; i++) {
      for (let j = colSect; j < colSect + size; j++) {
        if (board[i][j].data === val) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @function this method's run time is slower because it is doing extra checks and actions.
   *              => checks for any invalid pairs.
   *              => add or remove element tags.
   *
   * @return {boolean} true if there does not exists a setter with the same 'val'
   *                   in its row, column, and 4x4 section.
   */
  slowValidate(row, col, val) {
    const size = Math.sqrt(this.size); // represents the 4x4 section.

    // formula for the first cell in given 4x4 section.
    const rowSect = row - (row % size);
    const colSect = col - (col % size);

    // check row.
    for (let i = 0; i < this.size; i++) {
      // only validate with setters and do not check itself.
      if (this.board[i][col].setter === true && row !== i) {
        if (this.board[i][col].data === val) {
          this.invalid.push({row: this.row, col: this.col, otherRow: i, otherCol: col});
          return false;
        }
      }
    }

    // check column.
    for (let j = 0; j < this.size; j++) {
      // only validate with setters and do not check itself.
      if (this.board[row][j].setter === true && col !== j) {

        if (this.board[row][j].data === val) {
          // store invalid pairs.
          this.invalid.push({row: this.row, col: this.col, otherRow: row, otherCol: j});
          return false;
        }
      }
    }

    // check section.
    for (let i = rowSect; i < rowSect + size; i++) {
      for (let j = colSect; j < colSect + size; j++) {
        // only validate with setters and do not check itself.
        if (this.board[i][j].setter === true && row !== i && col !== j) {
          if (this.board[i][j].data === val) {
            // store invalid pairs.
            this.invalid.push({row: this.row, col: this.col, otherRow: i, otherCol: j});
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * @function display the user's keyboard input to the selected cell.
   *
   * @param event is the user's keyboard key input.
   */
  getKeyboardInput(event) {
    if (this.row === null || this.col === null) return;

    if (this.board[this.row][this.col].setter === true) return;

    if (event.key === "Backspace") erase();

    if (!this.checkKeyboardInput(event.keyCode)) return;

    this.removeCurrentInvalid(this.row, this.col);

    if (this.blank) this.table.rows[this.row].cells[this.col].classList.add(this.colorSetter);

    this.board[this.row][this.col].data = this.toColor(this.toDecimal(event.keyCode));

    this.updateInvalid();
    this.updateDisplay();
  }

  /**
   * @param input is the user's keyboard input.
   *
   * @return {boolean} true if the keyboard key input is a number between 0-9 or letter A-F.
   */
  checkKeyboardInput(input) {
    // their respective key codes.
    let zero = 48, nine = 57, A = 65, F = 70;

    return (input >= zero && input <= nine) || (input >= A && input <= F);
  }

  /**
   * @function displays the value of the button clicked to given cell.
   *
   * @pram value {number} the value of the button.
   */
  getButtonInput(value) {
    if (this.row === null || this.col === null) return;

    if (this.board[this.row][this.col].setter === true) return;

    if (this.blank) this.table.rows[this.row].cells[this.col].classList.add(this.colorSetter);


    this.board[this.row][this.col].data = value;
    this.removeCurrentInvalid(this.row, this.col);
    this.board[this.row][this.col].data = this.toColor(value);
    this.updateInvalid();
    this.updateDisplay();
  }

  /**
   * @function displays every cell that is incorrect.
   */
  validate() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j].data !== this.empty) {
          if (this.board[i][j].data !== this.copy[i][j].data) {
            this.invalid.push({row: i, col: j, otherRow: i, otherCol: j});
          }
        }
      }
    }
    this.updateInvalid();
    this.deselect();
  }

  /**
   * @function solves and displays the solution to user.
   */
  solve() {
    if (this.blank) {
      this.stopwatch.tag.innerHTML = "Solving...";
      window.setTimeout(this.delaySolveFunction, 0);
    } else {
      this.resetInvalid();
      this.removeAllColorTags(this.colorWrong);
      this.board = this.deepCopy(this.copy);
    }

    window.clearInterval(this.stopwatch.time);
    this.deselect();
    this.updateDisplay();
  }

  /**
   * @function helps prompt the user before doing a time heavy task.
   */
  delaySolveFunction() {
    const check = sudoku.fastSolve(sudoku.board);

    if (check) {
      sudoku.stopwatch.tag.innerHTML = "Solution";
    } else {
      sudoku.stopwatch.tag.innerHTML = "No Solution Found";
    }

    sudoku.updateDisplay();
  }

  /**
   * @function removes the value of a non-setter cell.
   */
  erase() {
    if (this.row === null || this.col === null) return;

    if (this.board[this.row][this.col].setter === true) return;


    this.board[this.row][this.col].data = this.empty;
    this.table.rows[this.row].cells[this.col].className = this.empty;

    this.removeCurrentInvalid(this.row, this.col);
    this.updateInvalid();
    this.deselect();
    this.updateDisplay();
  }

  /**
   * @function generates the 16x16 table grid for the game.
   */
  drawGrid() {
    this.clearChildNodes(this.table);

    // insert <colgroup> and <col>.
    for (let i = 0; i < Math.sqrt(this.size) - 1; i++) {
      const colgroup = this.table.appendChild(document.createElement("colgroup"));
      for (let j = 0; j < Math.sqrt(this.size); j++) {
        const col = document.createElement("col");
        colgroup.appendChild(col);
      }
    }

    // insert <tr> and <td>
    for (let row = 0; row < this.size; row++) {
      const tempRow = this.table.insertRow();
      for (let col = 0; col < this.size; col++) {
        tempRow.insertCell();
        this.table.rows[row].cells[col].setAttribute("onclick", `getMouseEvent(${row},${col})`)
        if (this.board[row][col].setter === true) {
          this.table.rows[row].cells[col].innerHTML = this.board[row][col].data;
          this.table.rows[row].cells[col].classList.add(this.colorSetter);
        }
      }
    }
  }

  /**
   * @function generate the input buttons for the keypad numbers 0-9 and letters A-F.
   */
  drawKeypad() {
    this.clearChildNodes(this.keypad);

    for (let i = 0; i < this.size; i++) {
      const button = document.createElement("BUTTON");

      button.setAttribute("onclick", `buttonInput(${i})`);
      button.innerHTML = this.toHex(i);
      this.keypad.appendChild(button);
    }
  }

  /**
   * @function removes all child nodes from given element.
   *
   * @param node {Element} the parent element' child node that is being removed.
   */
  clearChildNodes(node) {
    while (node.hasChildNodes()) node.removeChild(node.firstChild);
  }

  /**
   * @function performs a deep copy of the given object.
   *
   * @param object {object} the object to be deep copied.
   */
  deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
  }

  /**
   * @function updates the DOM with the recent changes to each cell.
   */
  updateDisplay() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.table.rows[row].cells[col].innerHTML = this.toHex(this.board[row][col].data);
      }
    }
  }

  /**
   * @function set row and col to selected cell.
   *
   * @param row {number} row index of selected cell.
   * @param col {number} column index of selected cell.
   */
  updateSelectedCell(row, col) {
    this.row = row;
    this.col = col;
  }

  /**
   * @function sets the background color of the current selected cell.
   */
  setSelected() {
    // remove previously selected cell.
    const selectedCell = document.querySelector("." + this.colorSelected);
    if (selectedCell !== null) selectedCell.classList.remove(this.colorSelected);

    this.table.rows[this.row].cells[this.col].classList.add(this.colorSelected);
  }

  /**
   * @function removes the CSS selected background color class from current cell.
   */
  deselect() {
    if (this.row === null || this.col === null) return;

    this.table.rows[this.row].cells[this.col].classList.remove(this.colorSelected);

    this.row = null;
    this.col = null;
  }

  /**
   * @function sets the value to the given CSS color class.
   *
   * @param colorTag  {string} the CSS color tag to be added.
   *
   * @return 'tag' with the color class added.
   */
  setColorTag(colorTag) {
    this.table.rows[this.row].cells[this.col].classList.add(colorTag);
  }

  /**
   * @function removes the CSS color class from an element.
   *
   * @param colorTag    {string} the CSS color tag to be removed.
   *
   * @return 'tag' with the color class removed.
   */
  removeColorTag(colorTag) {
    this.table.rows[this.row].cells[this.col].classList.remove(colorTag)
  }

  /**
   * @function removes all given CSS color class from every cell.
   *
   * @param tag the CSS color class to be removed.
   */
  removeAllColorTags(tag) {
    const list = document.querySelectorAll("." + tag);

    for (let i = 0; i < list.length; i++) {
      list[i].classList.remove(tag);
    }
  }

  /**
   * @function removes only the current cell from the invalid array in case
   *           the other invalid pair is associated with another invalid cell.
   *
   * @param row {number} index of selected row.
   * @param col {number} index of selected column.
   */
  removeCurrentInvalid(row, col) {
    const size = this.invalid.length;

    for (let i = size - 1; i >= 0; i--) {
      if (this.invalid[i].row === row && this.invalid[i].col === col) {
        this.invalid.splice(i, 1);
      }
    }
  }

  /**
   * @function removes all CSS invalid color class from every cell.
   */
  removeAllInvalidTag() {
    const tag = document.querySelectorAll("." + this.colorInvalid);

    for (let i = 0; i < tag.length; i++) {
      tag[i].classList.remove(this.colorInvalid);
    }
  }

  /**
   * @function updates the background cell color to CSS invalid color to all invalid cells.
   */
  updateInvalid() {
    this.removeAllInvalidTag();

    for (let i = 0; i < this.invalid.length; i++) {
      this.table.rows[this.invalid[i].row].cells[this.invalid[i].col].classList.add(this.colorInvalid);
      this.table.rows[this.invalid[i].otherRow].cells[this.invalid[i].otherCol].classList.add(this.colorInvalid);
    }
  }

  /**
   * @function resets the invalid array and CSS color tags to its original state.
   */
  resetInvalid() {
    this.invalid = [];
    this.removeAllInvalidTag();
  }

  /**
   * @function converts each object in board array into Cell Objects.
   */
  toCell(array) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (array[row][col] !== this.empty) {
          array[row][col] = new Cell(array[row][col], true);
        } else {
          array[row][col] = new Cell(this.empty);
        }
      }
    }
    return array;
  }

  /**
   * @function changes the keyboard input text color.
   *
   * @param value {number} the value that will change color.
   *
   * @return 'value' with the added CSS color tag class
   *          depending if the value is valid or invalid.
   */
  toColor(value) {
    if (this.slowValidate(this.row, this.col, value)) {
      this.removeColorTag(this.colorWrong)
      this.setColorTag(this.colorCorrect);
    } else {
      this.removeColorTag(this.colorCorrect);
      this.setColorTag(this.colorWrong);
    }

    return value;
  }

  /**
   * @function converts a Decimal to Hexadecimal.
   *
   * @param num    {number} the number to be converted to Hexadecimal.
   *
   * @return       {string} 'A' if num = 10  , 'B' if num = 11 ... 'F' if num = 15.
   */
  toHex(num) {
    const decimal = 10; // represents when a Decimal needs to convert to Hexadecimal.
    const hexadecimal = 'A'.charCodeAt(0)

    if (num < decimal) return num.toString();

    return String.fromCharCode(num - decimal + hexadecimal);
  }

  /**
   * @function converts a key code to a decimal number.
   *           letters A-F will be converted to number 10-15 respectively.
   *
   * @param key the key code to be converted.
   * @return a decimal number.
   */
  toDecimal(key) {
    // their respective key codes.
    let zero = 48, nine = 57, A = 65, F = 70;
    let decimal = 10;

    if (key >= zero && key <= nine) return key - zero;

    if (key >= A && key <= F) return key - A + decimal;
  }

  /**
   * @function sets up the game grid for the user to interact with.
   */
  setup() {
    this.fastSolve(this.copy);
    this.drawGrid();
    this.drawKeypad();
    this.updateDisplay();
  }
}


/**
 * @class represents each individual cells.
 */
class Cell {
  constructor(data, setter=false) {
    this.data = data;        // {int}     value of the cell
    this.setter = setter;    // {boolean} true if this cell is a setter cell
  }
}

/**
 * @class represents how long the user has been playing.
 */
class Stopwatch {
  constructor() {
    this.tag = document.querySelector("#stopwatch p");
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.time = window.setInterval(this.getTime, 1000);

    this.printTime();
  }

  /**
   * @function adds one second to the clock.
   */
  getTime() {
    sudoku.stopwatch.seconds++;
    sudoku.stopwatch.convertSeconds();
    sudoku.stopwatch.printTime();
  }

  /**
   * @function converts seconds to a standard Hours:Minutes:Seconds format.
   */
  convertSeconds() {
    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes++;
    }

    if (this.minutes === 60) {
      this.minutes = 0;
      this.hours++;
    }
  }

  /**
   * @returns {string} time in Hours:Minutes:Seconds format.
   */
  printTime() {
    // display hour and minute only when necessary
    if (this.hours !== 0) return this.tag.innerHTML = `${this.hours}H ${this.minutes}M ${this.seconds}S`;
    if (this.minutes !== 0) return this.tag.innerHTML = `${this.minutes}M ${this.seconds}S`;
    this.tag.innerHTML = this.seconds + "S";
  }
}


/*** JavaScript Functions ***/

/**
 * @function returns the row and column index of the selected game board cell.
 *
 * @param row {number} the row index of selected cell.
 * @param col {number} the column index of selected cell.
 */
const getMouseEvent = (row, col) => {
  sudoku.getMouseEvent(row, col)
}

/**
 * @function displays user's keyboard input in given cell.
 *
 * @param event is the user's keyboard key input.
 */
const getKeyboardInput = (event) => sudoku.getKeyboardInput(event);

/**
 * @function displays the value of the button clicked in given cell.
 *
 * @pram value {number} the value of the button.
 */
const buttonInput = (value) => sudoku.getButtonInput(value);

/**
 * @function reset the current board to its original state.
 */
const restartGame = () => {
  let custom = false;
  if (currentBoard === 0) custom = true;

  setBoard(getBoard()[currentBoard], custom);
}

/**
 * @function prompts the user for any cells that are incorrect.
 */
const validate = () => {
  if (sudoku.blank) return;

  sudoku.validate();
}

/**
 * @function display the solution to the user.
 */
const solve = () => sudoku.solve();

/**
 * @function removes the value of a non-setter selected cell.
 */
const erase =() => sudoku.erase();

/**
 * @function generate a blank Sudoku board.
 */
const makeCustomBoard = () => {
  currentBoard = 0; // index 0 is an empty board.

  setBoard(getBoard()[currentBoard], true);
}

/**
 * @function generate a game with a new board.
 */
const newGame = () => {
  currentBoard = (currentBoard + 1) % getBoard().length;

  // skip board[0] because it is an empty board.
  if (currentBoard === 0) {
    currentBoard = (currentBoard + 1) % getBoard().length;
  }

  setBoard(getBoard()[currentBoard]);
}

/**
 * @function set the sudoku grid with given board.
 *
 * @param board {array} the board to initialize the game.
 * @param blank {boolean} if array is empty.
 */
const setBoard = (board, blank=false) => {
  window.clearInterval(sudoku.stopwatch.time);
  sudoku = new Sudoku(board, blank);
}

/**
 * @function an array of available game boards for the game.
 *
 * @return an array that represents the sudoku board to initialize the game with.
 */
const getBoard = () => {
  let board = []   // array that will hold the sudoku boards.
  let size = 16;   // represents the 16x16 grid.
  let empty = "";  // represents an empty cell.

  // index 0 will represent an empty board.
  let tempBoard = [];
  for (let i = 0; i < size; i++) {
    tempBoard.push([]);
    for (let j = 0; j < size; j++) {
      tempBoard[i].push(empty);
    }
  }
  board.push(tempBoard);

  board.push([[empty, 5, empty, empty, empty, empty, empty, 7, 10, empty, empty, 14, 13, empty, empty, 15],
    [14, 10, empty, empty, empty, 15, 13, empty, empty, empty, 11, empty, empty, 5, empty, empty],
    [12, empty, 8, 11, empty, empty, empty, empty, 2, 15, 13, empty, 14, 10, 9, empty],
    [1, empty, 15, empty, 10, empty, 14, 9, 0, empty, empty, empty, empty, empty, empty, empty],
    [empty, 14, 10, 9, empty, empty, 15, 1, 12, 7, 8, 11, empty, empty, empty, empty],
    [11, 12, empty, empty, 3, 0, 4, 5, 1, 2, empty, empty, empty, empty, 10, 9],
    [4, empty, 5, 0, 11, empty, 8, empty, 14, 10, 9, 6, 15, empty, empty, 2],
    [empty, 1, empty, empty, empty, 9, empty, 10, 5, empty, 4, empty, empty, 12, empty, 8],
    [9, 6, 14, 10, 15, empty, empty, empty, 11, 12, empty, empty, empty, empty, empty, 5],
    [8, empty, empty, empty, empty, empty, 0, empty, empty, 1, empty, 15, 9, empty, empty, 10],
    [0, empty, 3, 5, 8, 12, empty, empty, 6, empty, 10, empty, 2, 15, empty, empty],
    [15, 13, empty, empty, 6, empty, 9, 14, 3, 5, 0, empty, empty, empty, 12, 7],
    [10, 9, empty, 14, empty, empty, empty, 15, 8, 11, 12, empty, empty, 0, 4, 3],
    [empty, empty, 11, empty, 0, 3, 5, empty, 15, empty, empty, empty, 10, 9, empty, empty],
    [empty, empty, 4, empty, 7, 11, 12, empty, 9, empty, empty, 10, 1, empty, empty, 13],
    [2, 15, empty, empty, 9, empty, empty, 6, empty, empty, 5, empty, empty, empty, 11, empty]]);

  board.push([[empty, empty, 4, empty, 3, 7, empty, empty, empty, empty, 12, 11, 0, 1, empty, empty],
    [empty, empty, 11, empty, 2, 4, empty, empty, 10, 1, 9, 0, empty, 5, empty, empty],
    [0, 10, 3, 5, empty, empty, empty, empty, empty, empty, empty, empty, 7, 6, empty, 9],
    [13, empty, 1, 2, 15, 9, empty, empty, empty, empty, 4, empty, 10, 14, empty, empty],
    [1, 11, empty, empty, empty, empty, 5, 10, 9, 14, empty, empty, empty, empty, 3, 15],
    [5, 2, empty, 13, 14, empty, empty, empty, empty, empty, empty, empty, 8, empty, 9, 6],
    [empty, 9, empty, empty, 8, 15, 1, 7, 2, 0, empty, 6, empty, empty, 11, empty],
    [empty, 3, 0, 12, 9, empty, 2, empty , empty, 15, empty, 5, empty, empty, 7, empty],
    [empty, 4, empty, empty, 5, empty, 0, empty, empty, 10, empty, 14, empty, empty, 15, empty],
    [empty, 5, empty, empty, 11, empty, 7, 15, 4, 3, empty, 8, empty, empty, 1, empty],
    [15, 8, empty, 1, empty, 3, empty, empty, empty, empty, empty, empty, 12, empty, 10, 13],
    [9, 14, empty, empty, empty, empty, 13, 2, 15, 12, empty, empty, empty, empty, 0, 5],
    [empty, empty, 5, 6, empty, 2, empty, empty, empty, empty, 10, empty, 13, 7, empty, empty],
    [11, empty, 2, 15, empty, empty, empty, empty, empty, empty, empty, empty, 1, 3, empty, 4],
    [empty, empty, empty, empty, 13, 14, 12, 11, 7, 6, 8, 2, empty, empty, empty, empty],
    [empty, empty, 9, empty, 7, 5, empty, empty, empty, empty, 0, 3, empty, 12, empty, empty]]);

  board.push([[empty, 14, empty, 0, empty, 1, 9, 13, 11, empty, empty, empty, 15, empty, 3, empty],
    [empty, 5, 2, 15, 11, empty, 7, 3, 13, 14, 0, empty, 1, empty, empty, empty],
    [13, empty, 8, 6, 10, 2, 14, empty, empty, empty, 15, empty, empty, 9, empty, empty],
    [3, 12, 1, 11, empty, empty, empty, empty, 5, empty, empty, empty, empty, 14, empty, empty],
    [empty, empty, 5, empty, 13, 0, 10, 6, 2, 4, 9, empty, empty, 7, empty, 11],
    [2, 15, empty, empty, 1, 3, empty, empty, empty, 13, 6, 12, empty, empty, 4, 14],
    [10, empty, 4, empty, empty, empty, empty, empty, empty, 8, 3, empty, empty, 5, empty, empty],
    [empty, empty, empty, empty, 12, empty, 15, 4, 14, empty, empty, 11, empty, empty, empty, empty],
    [empty, empty, 15, empty, 8, empty, 0, 11, empty, 7, 2, 9, 10, empty, 14, empty],
    [1, 11, empty, 10, empty, empty, 13, 2, 4, 3, empty, empty, empty, empty, 8, empty],
    [5, 2, empty, 3, empty, empty, 12, empty, empty, 10, 8, 0, empty, 11, 15, 1],
    [empty, empty, 9, 8, empty, empty, empty, empty, empty, empty, 11, empty, 7, empty, 5, 6],
    [11, 7, empty, empty, 15, empty, empty, 9, empty, 12, empty, empty, empty, 4, empty, empty],
    [4, empty, empty, empty, 2, empty, 3, 5, empty, 0, 14, empty, empty, empty, empty, empty],
    [empty, 8, 0, 5, empty, 13, empty, 10, empty, empty, 1, empty, empty, empty, 9, 7],
    [empty, 13, empty, empty, empty, 12, 8, empty, 3, 11, 10, 7, empty, empty, 1, empty]]);

  board.push([[empty, 0, 8, 11, empty, 4, empty, empty, 5, empty, empty, empty, empty, 2, 12, empty],
    [empty, 12, 2, empty, 0, 11, empty, empty, 8, 15, empty, 4, empty, 3, empty, empty],
    [6, 5, empty, 9, empty, empty, empty, empty, empty, 0, 7, empty, 13, empty, 1, empty],
    [15, 14, empty, empty, 10, empty, 3, 7, empty, 12, empty, empty, empty, empty, empty, 11],
    [empty, 9, 7, 10, empty, 2, empty, empty, empty, empty, 6, 12, empty, 8, 13, 5],
    [empty, 11, 14, empty, empty, 9, 7, empty, empty, empty, empty, empty, 15, 1, 4, empty],
    [13, 1, empty, 2, 8, 12, 6, empty, empty, 9, empty, 0, empty, 7, empty, empty],
    [empty, empty, empty, 15, empty, 14, empty, 5, 7, empty, empty, 13, empty, empty, empty, empty],
    [1, empty, empty, 7, 4, empty, empty, 14, 12, empty, 8, empty, 6, empty, empty, empty],
    [12, empty, 0, empty, 2, empty, 13, empty, empty, 1, 4, 9, 10, empty, 15, empty],
    [empty, 13, 10, 14, empty, empty, empty, empty, empty, 6, 2, empty, empty, 12, 3, empty],
    [4, 8, 15, empty, 12, 1, empty, empty, empty, empty, 0, empty, 7, 14, 2, empty],
    [14, empty, empty, empty, empty, empty, empty, empty, 2, 13, empty, 1, empty, empty, 6, 7],
    [empty, 15, empty, 4, empty, 5, 2, empty, empty, empty, empty, empty, 1, empty, 11, 3],
    [empty, empty, 13, empty, 7, empty, 1, 12, empty, empty, 14, 6, empty, 4, empty, empty],
    [empty, 7, 1, empty, empty, empty, empty, 13, empty, empty, 10, empty, 0, 9, 5, empty]]);

  board.push([[7, empty, 8, empty, 9, empty, empty, 11, 15, empty, 14, 12, empty, 10, empty, 3],
    [empty, empty, 14, empty, 8, 15, 4, empty, empty, 6, empty, 9, empty, empty, 12, empty],
    [1, empty, empty, 9, empty, 5, empty, 3, empty, empty, 8, empty, empty, 15, empty, 13],
    [empty, 5, empty, 2, empty, 14, 13, empty, 4, empty, 10, empty, 8, empty, 9, empty],
    [2, empty, 12, empty, empty, 8, empty, empty, 0, empty, empty, 1, empty, empty, 13, 6],
    [10, empty, 11, empty, 13, empty, 14, 5, empty, 7, empty, 15, empty, 12, empty, empty],
    [empty, 6, empty, 15, empty, 1, empty, empty, 11, empty, 12, empty, empty, 14, 0, empty],
    [empty, 13, empty, 4, 7, empty, empty, 12, empty, 2, empty, 5, 15, empty, empty, 8],
    [11, empty, 3, empty, 15, empty, 6, empty, 12, empty, 7, empty, 10, empty, empty, empty],
    [empty, 4, empty, 7, empty, 12, empty, 9, empty, 15, empty, 3, 13, empty, 11, empty],
    [15, empty, 13, empty, 11, empty, 8, empty, 5, empty, empty, 10, empty, 0, empty, 2],
    [0, empty, 9, 8, 2, empty, empty, 4, 13, empty, 11, empty, 5, empty, 15, empty],
    [13, empty, 6, empty, 14, empty, 9, empty, empty, 11, empty, 8, empty, 7, 1, empty],
    [empty, 15, empty, 11, empty, 13, empty, 2, empty, 14, empty, empty, 12, empty, empty, 10],
    [4, 9, empty, empty, 5, empty, 10, empty, empty, empty, 13, empty, empty, 6, empty, empty],
    [14, empty, 0, empty, empty, 7, empty, 1, empty, 5, empty, 4, empty, 13, empty, 11]]);

  return board;
}


// global instance and window listener functions.
let currentBoard = 1; // keeps track of what board to initialize the game with.
let sudoku = new Sudoku(getBoard()[currentBoard]);
window.addEventListener("keydown", getKeyboardInput);
