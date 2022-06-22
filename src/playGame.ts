// THE GAME ITSELF

import KeyboardKey from './keyboardKey';
import { GameOptions } from './gameOptions';
import { GameGrid } from './gameGrid';

// possible word states:
// perfect, when the letter is in the right position
// correct, when the letter exists but it's not in the right position
// wrong, when the letter does not exist
enum letterState {
    WRONG = 1,
    CORRECT,
    PERFECT  
}

// keyboard layout, as a string array, each item is a row of keys
// > represents Enter
// < represents Backspace
const keyboardLayout : string[] = ['QWERTYUIOP','ASDFGHJKL','>ZXCVBNM<'];

// this class extends Scene class
export class PlayGame extends Phaser.Scene {

    // array with all possible words
    words : string[];

    // string where to store the current word
    currentWord : string;

    // string where to store the word to guess
    wordToGuess : string;

    // variable where to store game width
    gameWidth : number;

    // main game grid
    gameGrid : GameGrid;

    // virtual keyboard, as an array of KeyboardKey instances
    virtualKeyboard : KeyboardKey[][];
   
    // constructor
    constructor() {
        super({
            key: 'PlayGame'
        });
    }

    // method to be executed when the scene has been created
    create() : void {        

        // set gameWidth to actual game width
        this.gameWidth = this.game.config.width as number;

        // store JSON loaded words into words array
        this.words = this.cache.json.get('words');

        // at the beginning, current word is empty
        this.currentWord = '';

        // pick a random word to guess
        this.wordToGuess = this.words[Phaser.Math.Between(0, this.words.length - 1)].toUpperCase();

        // let's display somewhere the word to guess
        console.log(this.wordToGuess);

        // initialize virtual keyboard
        this.virtualKeyboard = [];

        // loop through keyboardLayout array
        keyboardLayout.forEach((row : string, index : number) => {

            // initialize virtual keyboard row
            this.virtualKeyboard[index] = [];
            
            // determine position of key sprites
            // some values are still hardcoded, and need to be optimized
            let rowWidth : number = 70 * row.length;
            let firstKeyPosition : number = (this.game.config.width as number - rowWidth) / 2;

            // loop through string
            for (let i : number = 0; i < row.length; i ++) {

                // get the i-th character
                let letter : string = row.charAt(i);

                // add the keyboard key
                this.virtualKeyboard[index][i] = new KeyboardKey(this, firstKeyPosition + i * 70 - (letter == '>' ? 35 : 0), 900 + index * 90, row.charAt(i));
            }
        });

        // add the game grid
        this.gameGrid = new GameGrid(this, GameOptions.rows, (this.gameWidth - 540) / 2, GameOptions.firstRowY);

        // waiting for keyboard input
        this.input.keyboard.on('keydown', this.onKeyDown, this);
    }
    
    // method to process a key pressed
    onKeyDown(e : KeyboardEvent) : void {

        // store key pressed in key variable
        var key : string = e.key;
        
        // if the key is space, restart the game
        if (key == ' ') {
            this.scene.start('PlayGame');
            return;
        }

        // backspace
        if (key == 'Backspace') {
            this.updateWord('<');
            return;
        }

        // regular expression saying "I want one letter"
        const regex = /^[a-zA-Z]{1}$/;

        // letter a-z or A-Z
        if (regex.test(key)) {
            this.updateWord(key);
            return;
        }

        // enter
        if (key == 'Enter') {
            this.updateWord('>');
        }
    }

    //method to be called each time we need to update a word
    updateWord(s : string) : void {
        switch(s) {

            // backsace
            case '<' :

                // if the word has at least one character, remove the last character
                if (this.currentWord.length > 0) {

                    // remove last current word character
                    this.currentWord = this.currentWord.slice(0, -1);

                    // call gameGrid's removeLetter method
                    this.gameGrid.removeLetter();
                }
                break;

            // enter
            case '>' :
                
                // if the word is 5 characters long, proceed to verify the result
                if (this.currentWord.length == 5) {

                    // if the word is a valid word, proceed to verify the result
                    if (this.words.includes(this.currentWord.toLowerCase())) {

                        // at the beginning we se the result as a series of wrong characters
                        let result : number[] = Array(5).fill(letterState.WRONG);

                        // creation of a temp string with the word to guess
                        let tempWord : string = this.wordToGuess;

                        // loop through all word characters
                        for (let i : number = 0; i < 5; i ++) {

                            // do i-th char of the current word and i-th car of the word to guess match?
                            if (this.currentWord.charAt(i) == tempWord.charAt(i)) {

                                // this is a PERFECT result
                                result[i] = letterState.PERFECT;

                                // remove the i-th character from temp word
                                tempWord = this.removeChar(tempWord, i);
                            }

                            // i-th char of the current word and i-th car of the word to guess do not match
                            else {

                                // loop through all character of the word to guess
                                for (let j : number = 0; j < 5; j ++) {

                                    // do i-th char of the current word and j-th car of the word to guess match,
                                    // and don't j-th char of the current word and j-th car of the word to guess match?
                                    if (this.currentWord.charAt(i) == this.wordToGuess.charAt(j) && this.currentWord.charAt(j) != this.wordToGuess.charAt(j)) {
                                        
                                        // this is a correct result
                                        result[i] = letterState.CORRECT;

                                        // remove the i-th character from temp word
                                        tempWord = this.removeChar(tempWord, j);
                                        break;    
                                    }
                                }   
                            }    
                        }

                        // loop through all result items and compose result string accordingly
                        result.forEach((element : number, index : number) => {
                            
                            // get letter position in our virtual keyboard
                            let position : Phaser.Math.Vector2 = this.getLetterPosition(this.currentWord.charAt(index));

                            // if the key of the virtual keyboard has not already been painted, then paint it.
                            if (parseInt(this.virtualKeyboard[position.x][position.y].frame.name) < element) {
                                this.virtualKeyboard[position.x][position.y].setFrame(element);
                            }
                        });

                        // reset current word
                        this.currentWord = '';
                      
                        // call gameGrid's showResult method
                        this.gameGrid.showResult(result);
                    }
                }
                break;
            
            // a-z or A-Z
            default :

                // if the word is less than 5 characters long, remove last character
                if (this.currentWord.length < 5) {

                    // add the letter
                    this.gameGrid.addLetter(s);

                    // update current word
                    this.currentWord += s.toUpperCase();
                   
                }                
        }
    }

    // method to get the position the virtual keyboard key, given a letter
    getLetterPosition(letter : string) : Phaser.Math.Vector2 {
        
        // set row to zero
        let row : number = 0;

        // set column to zero
        let column : number = 0;

        // loop though all keyboardLayout array
        keyboardLayout.forEach((currentRow : string, index : number) => {
            
            // does current row include the letter?
            if (currentRow.includes(letter)) {

                // set row to index
                row = index; 

                // set column to letter position inside current row
                column = currentRow.indexOf(letter);   
            }
        })     

        // return the coordinate as a 2D vector
        return new Phaser.Math.Vector2(row, column);
    }

    // simple method to change the index-th character of a string with '_'
    // just to have an unmatchable character
    removeChar(initialString : string, index : number) : string {
        return initialString.substring(0, index) + '_' + initialString.substring(index + 1);
    }
}