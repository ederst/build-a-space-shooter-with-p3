const Entities = require('../entities/Entities.js');

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
  }

  preload() {
    this.load.image("sprBg0", "assets/sprites/sprBg0.png");
    this.load.image("sprBg1", "assets/sprites/sprBg1.png");

    this.load.image("sprBtnPlay", "assets/sprites/sprBtnPlay.png");
    this.load.image("sprBtnPlayHover", "assets/sprites/sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "assets/sprites/sprBtnPlayDown.png");

    this.load.audio("sndBtnDown", "assets/sound/sndBtnDown.wav");
    this.load.audio("sndBtnOver", "assets/sound/sndBtnOver.wav");
  }

  create() {
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    }

    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnPlay"
    );

    this.btnPlay.setInteractive();

    this.btnPlay.on("pointerover", function() {
      this.btnPlay.setTexture("sprBtnPlayHover");
      this.sfx.btnOver.play();
    }, this);

    this.btnPlay.on("pointerup", function() {
      this.btnPlay.setTexture("sprBtnPlay");
      this.scene.start("SceneMain");
    }, this);

    this.btnPlay.on("pointerout", function() {
      this.btnPlay.setTexture("sprBtnPlay");
    }, this);

    this.btnPlay.on("pointerdown", function() {
      this.btnPlay.setTexture("sprBtnPlayDown");
      this.sfx.btnDown.play();
    }, this);

    this.title = this.add.text(this.game.config.width * 0.5, 128, "SPACE SHOOTER", {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });

    this.title.setOrigin(0.5);

    this.backgrounds = [];
    for (var i = 0; i < 5; i++) {
      var keys = ["sprBg0", "sprBg1"];
      var key = keys[Phaser.Math.Between(0, keys.length - 1)];
      var bg = new Entities.ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }
  }

  update() {
    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}

module.exports = SceneMainMenu;
