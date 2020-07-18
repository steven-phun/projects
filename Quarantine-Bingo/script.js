/**
 * This JavaScript program allows the user to play the game Bingo with Quarantine as its theme.
 *
 * @author Steven Phun
 * @since July 17, 2020.
 */

/*jshint esversion: 6 */


/*** JavaScript Classes ***/


/**
 * @class represents the bingo scorecard.
 */
class Bingo {
    constructor() {
        /** HTML tag instances*/
        this.scorecard = document.querySelector("#scorecard>table");
        this.display = document.querySelector("#question>label");

        /** CSS class/id instances */
        this.selected = "selected-cell";

        /** class instances. */
        this.copy1 = this.getQuestions(); // {array} a copy of the collection of questions to fill the scorecard with.
        this.copy2 = this.getQuestions(); // {array} a copy of the collection of questions to display to user.
        this.center = "FREE SPACE (wore a mask)"; // {string} represents the innerHTML for the center square.
        this.row = null; // {number} the row index of selected cell.
        this.col = null; // {number} the column index of selected cell.
        this.size = 5; // {number} represents the width and length of the scorecard.

        this.buildScorecard();
    }

    /**
     * @function generate a bingo scorecard.
     */
    buildScorecard() {
        const center = Math.floor(this.size / 2);

        for (let i = 0; i < this.size; i++) {
            const row = this.scorecard.insertRow(); // insert <tr>.
            for (let j = 0; j < this.size; j++) {
                row.insertCell(); // insert <td>.
                this.scorecard.rows[i].cells[j].setAttribute("onclick", `getCell(${i},${j})`);
                if (!(i === center && j === center))
                    this.scorecard.rows[i].cells[j].innerHTML = this.getRandomQuestion(this.copy1);
            }
        }
        this.scorecard.rows[center].cells[center].innerHTML = this.center;
    }

    /**
     * @function fill the array with questions.
     *
     * @return {array} of questions.
     */
    getQuestions() {
        const q1 = "slept in past noon";
        const q2 = "baked for fun";
        const q3 = "watched more than 3 episodes of a show in one day";
        const q4 = "took a walk outside to exercise";
        const q5 = "video called wearing sweats, shorts, or pajama bottoms";
        const q6 = "started a workout routine or health regime";
        const q7 = "had to cancel a planned celebration or trip";
        const q8 = "made an unnecessary online purchase";
        const q9 = "started a puzzle";
        const q10 = "video called to hangout with friends";
        const q11 = "purchased hand sanitizer or hand soap";
        const q12 = "did not leave home property for more than 5 days in a row";
        const q13 = "cleaned or organized something at home";
        const q14 = "made a tik-tok video or participated in one";
        const q15 = "forgot to unmute yourself in a video call";
        const q16 = "got an at home or DIY haircut";
        const q17 = 'joined the Facebook group "Zoom Memes for Self-Quaranteens"';
        const q18 = "disconnected from a Zoom call because of bad connectivity";
        const q19 = "picked up a new hobby";
        const q20 = "started a new book";
        const q21 = "did not know what Zoom was before March 2020";
        const q22 = "had food delivered to your house";
        const q23 = "went to sleep past 2am";
        const q24 = 'asked "what day is it?"';

        return [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13,
            q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24];
    }

    /**
     * @function display a random question on scorecard.
     */
    displayRandomQuestion() {
        this.display.innerHTML = this.getRandomQuestion(this.copy2);
    }

    /**
     * @function get a random unique question from selected theme.
     *
     * @param array {array} the array that contains the questions.
     *
     * @return {string} a question.
     */
    getRandomQuestion(array) {
        const index = this.getRandomInt(array.length);

        const question = array[index];

        array.splice(index, 1);

        return question;
    }

    /**
     * @function get a random integer;
     *
     * @param max {number} the max number the random generator will go up to.
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


    /**
     * @function get the selected cell's index.
     *
     * @param row {number} the row index of selected cell.
     * @param col {number} the column index of selected cell.
     */
    getCell(row, col) {
        this.row = row;
        this.col = col;

        this.toggleSelected();
    }

    /**
     * @function toggle between selected and deselected cell.
     */
    toggleSelected() {
        if (this.scorecard.rows[this.row].cells[this.col].classList.contains(this.selected)) {
            this.removeClass(this.selected);
            return;
        }

        this.addClass(this.selected);
    }

    /**
     * @function add given class to selected cell.
     *
     * @param text {string} given class to add.
     */
    addClass(text) {
        this.scorecard.rows[this.row].cells[this.col].classList.add(text);
    }

    /**
     * @function remove given class from selected cell.
     *
     * @param text {string} given class to remove.
     */
    removeClass(text) {
        this.scorecard.rows[this.row].cells[this.col].classList.remove(text);
    }

}


/**
 * @class represents one individual cell on the scorecard.
 */
class Square {

}



/*** JavaScript Functions ***/
/**
 * @function get the selected cell's index.
 *
 * @param row {number} the row index of selected cell.
 * @param col {number} the column index of selected cell.
 */
const getCell = (row, col) => bingo.getCell(row, col);

/**
 * @function catch the events when the use selects the dice button.
 */
const getQuestion = () => bingo.displayRandomQuestion();


// global instance
const bingo = new Bingo;