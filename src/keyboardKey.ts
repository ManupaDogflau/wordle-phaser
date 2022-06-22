// KEYBOARD KEY CLASS

import { PlayGame } from "./playGame";
import KeyboardLetter from "./keyboardLetter";

// this class extends Sprite class
export default class KeyboardKey extends Phaser.GameObjects.Sprite {

    // letter bound to the key
    boundLetter : string;

    // parent scene
    parentScene : PlayGame;

    constructor(scene : PlayGame, x : number, y : number, letter : string) {

        // different image key according if it's a letter character or '<' or '>'
        super(scene, x, y, '<>'.includes(letter) ? 'bigkey' : 'key');

        // assign parent scene
        this.parentScene = scene;

        // assign bound letter
        this.boundLetter = letter;

        // set sprite registration point to top, left
        this.setOrigin(0);

        // add the sprite to the scene
        scene.add.existing(this); 
        
        // set the sprite interactive
        this.setInteractive();

        // listener for pointer down on the sprite, to call handlePointer callback
        this.on('pointerdown', this.handlePointer);

        // add a keyboard letter accoring to 'letter value
        switch(letter) {

            // backspace
            case '<' :
                this.setFrame(0);
                break;
            
            // enter
            case '>' :
                this.setFrame(1);
                break;

            // normal key
            default :
                new KeyboardLetter(scene, x + 10, y + 10, letter, 36);
        }
    }

    // method to be called when the user clicks or taps the letter
    handlePointer() : void {

        // call 'updateWord' method on parent scene
        this.parentScene.updateWord(this.boundLetter);
    }
}