// MAIN GAME FILE

// modules to import
import Phaser from 'phaser';
import { PreloadAssets } from './preloadAssets';
import { PlayGame } from './playGame';

// object to initialize the Scale Manager
const scaleConfig : Phaser.Types.Core.ScaleConfig = {
    mode : Phaser.Scale.FIT,
    autoCenter : Phaser.Scale.CENTER_BOTH,
    parent : 'game',
    width : 700,
    height : 1244
}

// game configuration object
const gameConfig : Phaser.Types.Core.GameConfig = {
    type : Phaser.AUTO,
    backgroundColor : 0xffffff,
    scale : scaleConfig,
    scene : [PreloadAssets, PlayGame]
}

// the game itself
new Phaser.Game(gameConfig);