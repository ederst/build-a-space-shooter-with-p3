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

    this.backgrounds = [];
    for (var i = 0; i < 5; i++) {
      var bg = new Entities.ScrollingBackground(this, "sprBg0", i * 10);
      this.backgrounds.push(bg);
    }

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
      delay: 1000,
      callback: function() {
        var enemy = null;

        if (Phaser.Math.Between(0, 10) >= 3) {
          enemy = new Entities.GunShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        } else if (Phaser.Math.Between(0, 10) >= 5) {
          if (this.getEnemiesByType("ChaserShip").length < 5) {
            enemy = new Entities.ChaserShip(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0
            );
          }
        } else {
          enemy = new Entities.CarrierShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        }

        if (enemy !== null) {
          enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
          this.enemies.add(enemy);
        }
      },
      callbackScope: this,
      loop: true
    });

    this.physics.add.collider(this.playerLasers, this.enemies, function(playerLaser, enemy) {
      if (enemy) {
        if (enemy.onDestroy !== undefined) {
          enemy.onDestroy();
        }
        enemy.explode(true);
        playerLaser.destroy();
      }
    });

    this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
      if (!player.getData("isDead") && !enemy.getData("isDead")) {
        player.explode(false);
        enemy.explode(true);

        player.onDestroy();
      }
    });

    this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
      if (!player.getData("isDead") && !laser.getData("isDead")) {
        player.explode(false);
        laser.destroy();

        player.onDestroy();
      }
    });
  }

  getEnemiesByType(type) {
    var arr = [];
    for (var i =0; i < this.enemies.getChildren().length; i++) {
      var enemy = this.enemies.getChildren()[i];

      if (enemy.getData("type") == type) {
        arr.push(enemy);
      }
    }

    return arr;
  }

  update() {

    if (!this.player.getData("isDead")) {
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

      if (this.keyShoot.isDown) {
        this.player.setData("isShooting", true);
      } else {
        this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
        this.player.setData("isShooting", false);
      }
    }

    for (var i = 0; i < this.enemies.getChildren().length; i++) {
      var enemy = this.enemies.getChildren()[i];

      enemy.update();

      if (enemy.x < -enemy.displayWidth ||
        enemy.x > this.game.config.width + enemy.displayWidth ||
        enemy.y < -enemy.displayHeight * 4 ||
        enemy.y > this.game.config.height + enemy.displayHeight) {

        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }

          enemy.destroy();
        }
      }
    }

    for (var i = 0; i < this.enemyLasers.getChildren().length; i++) {
      var laser = this.enemyLasers.getChildren()[i];
      laser.update();

      if (laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (var i = 0; i < this.playerLasers.getChildren().length; i++) {
      var laser = this.playerLasers.getChildren()[i];
      laser.update();

      if (laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }

  }
}

module.exports = SceneMain;
