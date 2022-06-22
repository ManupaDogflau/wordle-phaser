// BIG LETTER BOX

import BigLetter from "./bigLetter";

// this class extends Sprite class
export default class BigLetterBox extends Phaser.GameObjects.Sprite {

    // letter to show in the big letter box
    letterToShow : BigLetter;

    constructor(scene : Phaser.Scene, x : number, y : number) {
        super(scene, x, y, 'box');

        // set registration point to top left corner
        this.setOrigin(0);

        // add the letter box to the scene
        scene.add.existing(this);

        // calculate letter box bounds
        let bounds : Phaser.Geom.Rectangle = this.getBounds();

        // assign letterToShow an instance of BigLetter
        this.letterToShow = new BigLetter(scene, bounds.centerX, bounds.centerY + 8);
        
    }

    // method to set the letter
    setLetter(letter : string) : void {

        // tint letterToShow black
        this.letterToShow.setTint(0);

        // set letterToShow text according to "letter" argument
        this.letterToShow.setText(letter.toUpperCase());
    }
}