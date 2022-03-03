// Constants
const MAX_GUESSES = 10;
const PEGS_PER_GUESS = 4;
const CODE_PEG_COLORS = ['black', 'blue', 'purple', 'green', 'orange', 'red', 'white', 'yellow'];
const RED_KEY_PEG = 1;
const WHITE_KEY_PEG = -1;


class Match {
    constructor() {
        this.codebreaker = null;
        this.codemakerPoints = 0;
        this.games = [];
    }

    startNewGame() {

    }
}


class GameController {
    constructor() {
        this.model = new BoardModel(MAX_GUESSES, PEGS_PER_GUESS, CODE_PEG_COLORS);
        this.view = new BoardView();
        
        this.startGame();
    }

    startGame() {
        this.view.activateSlot();

        // wait for player to submit a guess

    }

    onPegClick(peg) {
        console.log('Selected peg', peg);
 
        this.view.fillActiveSlot(peg);
        this.view.nextSlot();

    }

    onUndoClick() {
        console.log('UNDO')
        this.view.emptyActiveSlot();
        this.view.prevSlot();
    }

    onGuessClick() {
        console.log('GUESS')
        // get current row # (guess #) from model
        // retrieve players' selections from view
        // pass guess into model, get key pegs returned
        // pass key pegs into view and update screen
    }

    updateGame() {

    }

     
}


class BoardModel {
    constructor(rows, cols, pegColors) {
        this.rows = rows;
        this.cols = cols;
        this.pegColors = pegColors;
        this.availableCodePegs = this.initCodePegs(this.pegColors);
        this.secretCode = this.generateNewCode();
        this.currentGuessNum = 0;
    }

    initCodePegs(pegColors) {
        const pegData = {};
        pegColors.forEach(pegColor => pegData[pegColor] = 18);
        return pegData;
    }

    generateNewCode() {
        const secretCode = [];
        for (let i = 0; i < this.cols; i++) {
            let random = Math.floor(Math.random() * this.pegColors.length)
            secretCode.push(random);
            this.availableCodePegs[this.pegColors[random]]--;
        }
        return secretCode;
    }

    get getSecretCode() {
        return this.secretCode;
    }

    get getNumPegType() {
        return this.pegColors.length;
    }

    submitGuess(guess) {
        const keyPegs = [];
        const unfoundPegs = [...this.secretCode];

        guess.forEach((peg, i) => {
            if (this.secretCode[i] === peg) {
                keyPegs.push(RED_KEY_PEG);
                unfoundPegs.splice(unfoundPegs.findIndex(p => p === peg), 1)
            } else if (unfoundPegs.includes(peg)) {
                keyPegs.push(WHITE_KEY_PEG);
                unfoundPegs.splice(unfoundPegs.findIndex(p => p === peg), 1)
            }
        });

        console.log(keyPegs);
        return keyPegs;
    }
}


class BoardView {
    constructor() {
        this.currentActiveRow = 0;
        this.currentActiveSlot = 0;

        this.boardEl = document.querySelector('.board');
        this.pegBinEl = document.querySelector('.peg-bin');
        this.guessBtnEl = document.getElementById('guessBtn');
        this.undoBtnEl = document.getElementById('undoBtn');

        this.render();
        this.addListeners();
    }

    render() {

        // Main board
        for (let i = 0; i < MAX_GUESSES; i++) {
            const rowEl = this.createElement('div', 'row');
            const codeRowEl = this.createElement('div', 'code-row');
            const keyRowEl = this.createElement('div', 'key-row');
            rowEl.append(codeRowEl, keyRowEl);

            for (let j = 0; j < PEGS_PER_GUESS; j++) {
                const codeSlotEl = this.createElement('div', 'code-row__slot');
                codeRowEl.append(codeSlotEl);

                const keySlotEl = this.createElement('div', 'key-row__slot');
                keyRowEl.append(keySlotEl);
            }

            this.boardEl.append(rowEl);
            this.rowEls = [...document.querySelectorAll('.row')].reverse();
        }

        // Peg bin
        for (let i = 0; i < CODE_PEG_COLORS.length; i++) {
            const pegEl = this.createElement('div', 'peg--code');
            pegEl.setAttribute('id', `peg-${i}`);
            pegEl.setAttribute('data-color', (CODE_PEG_COLORS[i]));
            pegEl.classList.add(pegEl.dataset.color);
            this.pegBinEl.append(pegEl);
        }
    }

    getActiveRowEl() {
        return this.rowEls[this.currentActiveRow];
    }

    getActivePegSlot() {
        return this.getActiveRowEl().querySelectorAll('.code-row__slot')[this.currentActiveSlot];
    }

    fillActiveSlot(colorID) {
        const pegSlot = this.getActivePegSlot();
        if (pegSlot) { 
            pegSlot.classList.remove(pegSlot.dataset.color)
            pegSlot.setAttribute('data-color', CODE_PEG_COLORS[colorID]);
            pegSlot.classList.add(pegSlot.dataset.color); 
        }
    }

    emptyActiveSlot() {
        const pegSlot = this.getActivePegSlot();
        if (pegSlot.hasAttribute('data-color')) { 
            pegSlot.classList.remove(pegSlot.dataset.color);
            pegSlot.removeAttribute('data-color')
        }
    }
    
    nextSlot() {
        if (this.currentActiveSlot < PEGS_PER_GUESS - 1) {
            this.deactivateSlot();
            this.currentActiveSlot++;
            this.activateSlot();
        } 
    }

    prevSlot() {
        if (this.currentActiveSlot > 0) {
            this.deactivateSlot();
            this.currentActiveSlot--;
            this.activateSlot();
        }
    }
    
    activateSlot() {
        const pegSlot = this.getActivePegSlot();
        pegSlot.classList.add('active');
    }

    deactivateSlot() {
        const pegSlot = this.getActivePegSlot();
        pegSlot.classList.remove('active');
    }

    getPlayerGuess() {

    }

    addListeners() {
        this.pegBinEl.addEventListener('click', e => { 
            if (e.target.classList.contains('peg--code')) {
                const id = Number(e.target.id.replace('peg-', ''));
                game.onPegClick(id);
            }
        });

        this.undoBtnEl.addEventListener('click', () => game.onUndoClick())
        this.guessBtnEl.addEventListener('click', () => game.onGuessClick());
    }

    createElement(tag, className) {
        const el = document.createElement(tag);
        el.classList.add(className);
        return el;
    }

    

}


let game = new GameController();
window.game = game;
console.log(game);