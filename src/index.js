import Phaser from 'phaser';
import SceneMainMenu from './scenes/SceneMainMenu.js'
import SceneMain from './scenes/SceneMain.js'
import SceneGameOver from './scenes/SceneGameOver.js';

var config = {
  type: Phaser.WEBGL,
  width: 480,
  height: 640,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
        gravity: { x: 0, y: 0 }
    }
  },
  scene: [
    SceneMainMenu,
    SceneMain,
    SceneGameOver
  ],
  pixelArt: true,
  roundPixels: true
};

const game = new Phaser.Game(config);
