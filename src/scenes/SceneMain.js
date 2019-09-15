const Entities = require('../entities/Entities.js');
//const Player = Entities.Player;
//const GunShip = Entities.GunShip;

class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
  }

  preload() {
    this.load.image("sprBg0", "assets/sprites/sprBg0.png");
    this.load.image("sprBg1", "assets/sprites/sprBg1.png");
    this.load.image("sprEnemy1", "assets/sprites/sprEnemy1.png");
    this.load.image("sprLaserEnemy0", "assets/sprites/sprLaserEnemy0.png");
    this.load.image("sprLaserPlayer", "assets/sprites/sprLaserPlayer.png");

    this.load.spritesheet("sprExplosion", "assets/sprites/sprExplosion.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("sprEnemy0", "assets/sprites/sprEnemy0.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("sprEnemy2", "assets/sprites/sprEnemy2.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("sprPlayer", "assets/sprites/sprPlayer.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.audio("sndExplode0", "assets/sound/sndExplode0.wav");
    this.load.audio("sndExplode1", "assets/sound/sndExplode1.wav");
    this.load.audio("sndLaser", "assets/sound/sndLaser.wav");
  }

  create() {
    this.anims.create({
      key: "sprEnemy0",
      frames: this.anims.generateFrameNumbers("sprEnemy0"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "sprEnemy2",
      frames: this.anims.generateFrameNumbers("sprEnemy2"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "sprExplosion",
      frames: this.anims.generateFrameNumbers("sprExplosion"),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: "sprPlayer",
      frames: this.anims.generateFrameNumbers("sprPlayer"),
      frameRate: 20,
      repeat: -1
    });

    this.sfx = {
      explosions: [
        this.sound.add("sndExplode0"),
        this.sound.add("sndExplode1")
      ],
      laser: this.sound.add("sndLaser")
    };

    this.player = new Entities.Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprPlayer"
    );

    this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyShoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    this.time.addEvent({
      delay: 100,
      callback: function() {
        var enemy = new Entities.GunShip(
          this,
          Phaser.Math.Between(0, this.game.config.width),
          0
        );
        this.enemies.add(enemy);
      },
      callbackScope: this,
      loop: true
    });
  }

  update() {
    this.player.update();

    if (this.keyUp.isDown){
      this.player.moveUp();
    } else if(this.keyDown.isDown) {
      this.player.moveDown();
    }

    if (this.keyLeft.isDown){
      this.player.moveLeft();
    } else if(this.keyRight.isDown) {
      this.player.moveRight();
    }
  }
}

module.exports = SceneMain;
