import BigLetterBox from './bigLetterBox';

enum letterState {
    WRONG = 1,
    CORRECT,
    PERFECT
}

export class GameGrid {

    // current row where to write the letter
    currentRow: number;

    // current column where to write the letter
    currentColumn: number;

    // array to store all letter boxes
    letterBox: BigLetterBox[][];
    add: any;
    cameras: any;
    scene: Phaser.Scene; // Add scene reference
    gameOverText: Phaser.GameObjects.Text; // Text for Game Over
    winnerText: Phaser.GameObjects.Text; // Text for Winner
    overlayRect: Phaser.GameObjects.Rectangle; // Black overlay rectangle


    constructor(scene: Phaser.Scene, rows: number, firstRowX: number, firstRowY: number) {
        this.scene = scene; // Store the scene reference

        // set current row to zero
        this.currentRow = 0;

        // set current column to zero
        this.currentColumn = 0;

        // initialize letterBox array
        this.letterBox = [];

        // loop from 0 to 4
        for (let i: number = 0; i < 5; i++) {

            // initialize letterBox[i] array
            this.letterBox[i] = [];

            // loop through all rows
            for (let j: number = 0; j < rows; j++) {

                // assign to letterBox[i][j] a new BigLetterBox instance
                this.letterBox[i][j] = new BigLetterBox(scene, firstRowX + i * 110, firstRowY + j * 110);
            }
        }
        // Create black overlay rectangle
        this.overlayRect = this.scene.add.rectangle(0, 0, scene.cameras.main.width, scene.cameras.main.height, 0x000000);
        this.overlayRect.setOrigin(0);
        this.overlayRect.setAlpha(0); // Initially invisible

        // Create text objects for Game Over and Winner messages
        this.gameOverText = this.scene.add.text(350, 300, 'Game Over', { fontSize: '64px', color: '#ffffff' }).setOrigin(0.5);
        this.winnerText = this.scene.add.text(350, 300, 'Winner', { fontSize: '64px', color: '#ffffff' }).setOrigin(0.5);


        // Initially hide the text objects
        this.gameOverText.setVisible(false);
        this.winnerText.setVisible(false);



    }

    // method to add a letter
    addLetter(letter: string): void {

        // set the letter at current row and column
        this.letterBox[this.currentColumn][this.currentRow].setLetter(letter);

        // increase current column
        this.currentColumn++;
    }

    // method to remove a letter
    removeLetter(): void {

        // decrease current column
        this.currentColumn--;

        // unset the letter ant current row and column
        this.letterBox[this.currentColumn][this.currentRow].setLetter('');
    }

    // show guess result
    showResult(result: number[]): void {

        // loop through all result items
        result.forEach((element: number, index: number) => {

            // set letterBox frame according to element value
            this.letterBox[index][this.currentRow].setFrame(element);

            // paint the letter white
            this.letterBox[index][this.currentRow].letterToShow.setTint(0xffffff);
        });

        // increase current row
        this.currentRow++;

        // set current column to zero
        this.currentColumn = 0;

        // if the result is perfect, then we have won
        if (result.every((element: number) => element == letterState.PERFECT)) {
            this.overlayRect.setAlpha(1); // Show black overlay
            this.winnerText.setVisible(true); // Show the Winner text

        }

        // if the current row is 6, then we have lost
        if (this.currentRow == 6) {
            this.overlayRect.setAlpha(1); // Show black overlay
            this.gameOverText.setVisible(true); // Show the Game Over text
        }
    }
}
