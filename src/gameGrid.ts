// GAME GRID

import BigLetterBox from './bigLetterBox';

export class GameGrid {

    // current row where to write the letter
    currentRow : number;

    // current column where to write the letter
    currentColumn : number;

    // array to store all letter boxes
    letterBox : BigLetterBox[][];

    constructor(scene : Phaser.Scene, rows : number, firstRowX : number, firstRowY : number) {
        
        // set current row to zero
        this.currentRow = 0;

        // set current column to zero
        this.currentColumn = 0;

        // initialize letterBox array
        this.letterBox = [];

        // loop from 0 to 4
        for (let i: number = 0; i < 5; i ++) {
            
            // initialize letterBox[i] array
            this.letterBox[i] = []; 

            // loop through all rows
            for (let j : number = 0; j < rows; j ++) {

                // assign to letterBox[i][j] a new BigLetterBox instance
                this.letterBox[i][j] = new BigLetterBox(scene, firstRowX + i * 110, firstRowY + j * 110);
            }  
        }  
    }

    // method to add a latter
    addLetter(letter : string) : void {

        // set the letter at current row and column
        this.letterBox[this.currentColumn][this.currentRow].setLetter(letter);

        // increase current column
        this.currentColumn ++;
    }

    // method to remove a letter
    removeLetter() : void {

        // decrease current column
        this.currentColumn --;

        // unset the letter ant current row and column
        this.letterBox[this.currentColumn][this.currentRow].setLetter('');    
    }

    // show guess result
    showResult(result : number[]) : void {

        // loop through all result items
        result.forEach((element : number, index : number) => {

            // set letterBox frame according to element value
            this.letterBox[index][this.currentRow].setFrame(element);

            // paint the letter white
            this.letterBox[index][this.currentRow].letterToShow.setTint(0xffffff);
        });

        // increase current row
        this.currentRow ++;

        // set current column to zero
        this.currentColumn = 0;
    }
}