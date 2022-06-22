// KEYBOARD LETTER

import { PlayGame } from "./playGame";

// this class extends BitmapText class
export default class KeyboardLetter extends Phaser.GameObjects.BitmapText {
    constructor(scene : PlayGame, x : number, y : number, text : string, size : number) {
        super(scene, x, y, 'font', text, size);
        
        // add the keyboard letter to the scene
        scene.add.existing(this);
    }
}