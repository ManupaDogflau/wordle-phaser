// CLASS TO PRELOAD ASSETS

// this class extends Scene class
export class PreloadAssets extends Phaser.Scene {

    // constructor    
    constructor() {
        super({
            key : 'PreloadAssets'
        });
    }

    // method to be execute during class preloading
    preload(): void {

        // this is how we preload a JSON object
        this.load.json('words', 'assets/words.json');

        // preload images
        this.load.spritesheet('key', 'assets/key.png', {
            frameWidth: 70,
            frameHeight: 90
        });
        this.load.spritesheet('bigkey', 'assets/bigkey.png', {
            frameWidth: 105,
            frameHeight: 90
        });
        this.load.spritesheet('box', 'assets/box.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        // this is how we preload a bitmap font
        this.load.bitmapFont('font', 'assets/font.png', 'assets/font.fnt');
        this.load.bitmapFont('bigfont', 'assets/bigfont.png', 'assets/bigfont.fnt');
	}

    // method to be called once the instance has been created
	create(): void {

        // call PlayGame class
        this.scene.start('PlayGame');
	}
}