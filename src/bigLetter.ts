// BIG LETTER

// this class extends BitmapText class
export default class BigLetter extends Phaser.GameObjects.BitmapText {
    
    constructor(scene : Phaser.Scene, x : number, y : number) {    
        super(scene, x, y, 'bigfont', '');

        // set registration point to center
        this.setOrigin(0.5);

        // add the letter to the scene
        scene.add.existing(this);
    }
}