import { GAME_CONFIG, GAME_STATE, INPUT_ACTION, SCENES } from "../config/gameConfig.js";
import { getDifficultyAt } from "../core/difficulty.js";
import { getHighScore } from "../core/storage.js";
import { getNextSpawnGapMs, pickFishY, pickObstacleType } from "../core/spawn.js";

export class GameplayScene extends Phaser.Scene {
  constructor() {
    super(SCENES.GAMEPLAY);
    this.state = GAME_STATE.START;
    this.runtimeSeconds = 0;
    this.score = 0;
    this.highScore = 0;
    this.lastJumpAt = -9999;
    this.nextObstacleSpawnAt = 0;
    this.nextFishSpawnAt = 0;
    this.worldSpeed = GAME_CONFIG.movement.baseSpeed;
  }

  create() {
    this.state = GAME_STATE.PLAYING;
    this.runtimeSeconds = 0;
    this.score = 0;
    this.lastJumpAt = -9999;
    this.highScore = getHighScore();
    this.setupWorld();
    this.setupPlayer();
    this.setupGroups();
    this.setupInput();
    this.setupColliders();
    this.setupHud();
    this.setupSpawnerSchedule();
    this.cameras.main.fadeIn(220, 235, 249, 255);
  }

  setupWorld() {
    const { width, height, groundY } = GAME_CONFIG.world;
    this.add.image(width * 0.5, 150, "bgSky");

    this.cloudA = this.add.image(180, 118, "snowDrift").setAlpha(0.82);
    this.cloudB = this.add.image(700, 84, "snowDrift").setAlpha(0.66).setScale(0.85);

    this.iceStripA = this.add.tileSprite(width * 0.5, groundY + 10, width, 18, "iceGround");
    this.iceStripB = this.add.tileSprite(width * 0.5, groundY + 34, width, 18, "iceGround").setAlpha(0.85);

    this.ground = this.physics.add.staticImage(width * 0.5, groundY + 24, "iceGround");
    this.ground.setVisible(false);

    this.add
      .rectangle(width * 0.5, height - 24, width, 42, 0xe7f8ff)
      .setStrokeStyle(2, 0xb3ecff, 0.7);
  }

  setupPlayer() {
    const cfg = GAME_CONFIG.player;
    this.player = this.physics.add.sprite(cfg.x, cfg.y, "penguin");
    this.player.setDepth(3);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(cfg.width, cfg.height);
    this.player.body.setOffset(1, 2);
    this.player.body.setAllowGravity(true);
    this.player.setMaxVelocity(700, 1000);
    this.player.setBounce(0);
  }

  setupGroups() {
    this.obstacles = this.physics.add.group();
    this.fish = this.physics.add.group();
  }

  setupInput() {
    this.inputActions = {
      [INPUT_ACTION.JUMP]: false
    };

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.on("keydown-SPACE", () => this.queueInput(INPUT_ACTION.JUMP));
    this.input.on("pointerdown", () => this.queueInput(INPUT_ACTION.JUMP));

    this.touchButton = this.add
      .circle(GAME_CONFIG.world.width - 90, GAME_CONFIG.world.height - 76, 50, 0x004f73, 0.42)
      .setDepth(20)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });
    this.touchButtonLabel = this.add
      .text(this.touchButton.x, this.touchButton.y, "JUMP", {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "20px",
        color: "#dff8ff",
        fontStyle: "bold"
      })
      .setOrigin(0.5)
      .setDepth(21)
      .setScrollFactor(0);
    this.touchButton.on("pointerdown", () => this.queueInput(INPUT_ACTION.JUMP));

    this.updateTouchVisibility();
    this.scale.on("resize", this.updateTouchVisibility, this);
  }

  setupColliders() {
    this.physics.add.collider(this.player, this.ground);

    this.physics.add.overlap(this.player, this.obstacles, (_, obstacle) => {
      if (this.state !== GAME_STATE.PLAYING) {
        return;
      }
      this.handleCrash(obstacle);
    });

    this.physics.add.overlap(this.player, this.fish, (_, fishItem) => {
      if (this.state !== GAME_STATE.PLAYING || !fishItem.active) {
        return;
      }
      this.collectFish(fishItem);
    });
  }

  setupHud() {
    this.hudScore = this.add.text(22, 18, "Score: 0", {
      fontFamily: "Trebuchet MS, sans-serif",
      fontSize: "28px",
      color: "#ecf8ff",
      stroke: "#043147",
      strokeThickness: 6
    });
    this.hudScore.setDepth(30);

    this.hudHigh = this.add.text(22, 54, `High: ${this.highScore}`, {
      fontFamily: "Trebuchet MS, sans-serif",
      fontSize: "20px",
      color: "#ffe28a",
      stroke: "#043147",
      strokeThickness: 5
    });
    this.hudHigh.setDepth(30);
  }

  setupSpawnerSchedule() {
    this.nextObstacleSpawnAt = 450;
    this.nextFishSpawnAt = 560;
  }

  queueInput(action) {
    this.inputActions[action] = true;
  }

  update(_time, delta) {
    if (this.state !== GAME_STATE.PLAYING) {
      return;
    }

    const dtSeconds = delta / 1000;
    this.runtimeSeconds += dtSeconds;

    const difficulty = getDifficultyAt(this.runtimeSeconds);
    this.worldSpeed = difficulty.currentSpeed;

    this.updateBackground(dtSeconds);
    this.handleJumpInput();
    this.updateSpawner(difficulty);
    this.updateEntities();
    this.updateScore(dtSeconds);
    this.consumeInput();
  }

  updateBackground(dtSeconds) {
    this.iceStripA.tilePositionX += this.worldSpeed * dtSeconds;
    this.iceStripB.tilePositionX += this.worldSpeed * 1.2 * dtSeconds;
    this.cloudA.x -= 14 * dtSeconds;
    this.cloudB.x -= 20 * dtSeconds;

    if (this.cloudA.x < -100) {
      this.cloudA.x = GAME_CONFIG.world.width + 100;
    }
    if (this.cloudB.x < -100) {
      this.cloudB.x = GAME_CONFIG.world.width + 100;
    }
  }

  handleJumpInput() {
    const canJump =
      this.inputActions[INPUT_ACTION.JUMP] &&
      this.player.body.blocked.down &&
      this.time.now - this.lastJumpAt >= GAME_CONFIG.player.jumpCooldownMs;

    if (canJump) {
      this.player.setVelocityY(GAME_CONFIG.player.jumpVelocity);
      this.lastJumpAt = this.time.now;
      this.player.setRotation(-0.12);
      this.tweens.add({
        targets: this.player,
        rotation: 0,
        duration: 220,
        ease: "Quad.out"
      });
      this.playAudioHook("jump");
    }
  }

  updateSpawner(difficulty) {
    if (this.time.now >= this.nextObstacleSpawnAt) {
      this.spawnObstacle();
      const gap = getNextSpawnGapMs(
        GAME_CONFIG.spawnTable.minObstacleGapMs,
        GAME_CONFIG.spawnTable.maxObstacleGapMs,
        difficulty.spawnMultiplier
      );
      this.nextObstacleSpawnAt = this.time.now + gap;
    }

    if (this.time.now >= this.nextFishSpawnAt) {
      this.spawnFish();
      const gap = getNextSpawnGapMs(
        GAME_CONFIG.spawnTable.minFishGapMs,
        GAME_CONFIG.spawnTable.maxFishGapMs,
        difficulty.spawnMultiplier
      );
      this.nextFishSpawnAt = this.time.now + gap;
    }
  }

  spawnObstacle() {
    const type = pickObstacleType(GAME_CONFIG.spawnTable);
    const texture = type === "polarBear" ? "polarBear" : "snowball";
    const y = type === "polarBear" ? GAME_CONFIG.world.groundY - 30 : GAME_CONFIG.world.groundY - 12;

    const obstacle = this.obstacles.get(
      GAME_CONFIG.world.width + Phaser.Math.Between(60, 140),
      y,
      texture
    );

    if (!obstacle) {
      return;
    }

    obstacle.setActive(true).setVisible(true).setDepth(2);
    obstacle.body.setAllowGravity(false);
    obstacle.body.setVelocityX(-(this.worldSpeed + (type === "snowball" ? 90 : 10)));
    obstacle.body.setImmovable(true);

    if (type === "polarBear") {
      obstacle.body.setSize(95, 58);
      obstacle.body.setOffset(10, 10);
      obstacle.setScale(1);
    } else {
      obstacle.body.setSize(34, 34);
      obstacle.body.setOffset(3, 3);
      obstacle.setScale(1);
      obstacle.setAngularVelocity(260);
    }
  }

  spawnFish() {
    const fishY = pickFishY(GAME_CONFIG.spawnTable, GAME_CONFIG.world.groundY);
    const fish = this.fish.get(
      GAME_CONFIG.world.width + Phaser.Math.Between(60, 180),
      fishY,
      "fish"
    );

    if (!fish) {
      return;
    }

    fish.setActive(true).setVisible(true).setDepth(2);
    fish.body.setAllowGravity(false);
    fish.body.setVelocityX(-(this.worldSpeed + 20));
    fish.body.setSize(34, 20);
    fish.body.setOffset(8, 2);
    fish.setAngle(0);
    this.tweens.add({
      targets: fish,
      y: fishY - 8,
      yoyo: true,
      duration: 420,
      repeat: -1,
      ease: "Sine.inOut"
    });
  }

  updateEntities() {
    this.obstacles.children.each((obstacle) => {
      if (obstacle.x < -120) {
        obstacle.setActive(false);
        obstacle.setVisible(false);
        obstacle.body.stop();
      } else if (obstacle.active) {
        const extra = obstacle.texture.key === "snowball" ? 90 : 10;
        obstacle.body.setVelocityX(-(this.worldSpeed + extra));
      }
    });

    this.fish.children.each((fishItem) => {
      if (fishItem.x < -80) {
        fishItem.setActive(false);
        fishItem.setVisible(false);
        fishItem.body.stop();
        this.tweens.killTweensOf(fishItem);
      } else if (fishItem.active) {
        fishItem.body.setVelocityX(-(this.worldSpeed + 20));
      }
    });
  }

  updateScore(dtSeconds) {
    if (GAME_CONFIG.scoreRules.useTimeScore) {
      this.score += GAME_CONFIG.scoreRules.timePointsPerSecond * dtSeconds;
    }
    this.hudScore.setText(`Score: ${Math.floor(this.score)}`);
  }

  consumeInput() {
    this.inputActions[INPUT_ACTION.JUMP] = false;
  }

  collectFish(fishItem) {
    fishItem.disableBody(true, true);
    this.tweens.killTweensOf(fishItem);
    this.score += GAME_CONFIG.scoreRules.fishPoints;
    this.playAudioHook("pickup");

    const pop = this.add
      .text(fishItem.x, fishItem.y - 22, "+1", {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "24px",
        color: "#fff0a5",
        stroke: "#07354d",
        strokeThickness: 5
      })
      .setOrigin(0.5)
      .setDepth(35);

    this.tweens.add({
      targets: pop,
      y: pop.y - 22,
      alpha: 0,
      duration: 360,
      onComplete: () => pop.destroy()
    });
  }

  handleCrash(obstacle) {
    this.state = GAME_STATE.GAME_OVER;
    this.player.setTint(0xff7f7f);
    this.player.setVelocityX(0);
    this.player.setVelocityY(-80);
    this.player.setAngularVelocity(300);
    obstacle.body.setVelocityX(-80);
    this.playAudioHook("crash");

    this.cameras.main.shake(180, 0.007);
    this.time.delayedCall(GAME_CONFIG.player.crashFlashMs, () => this.player.clearTint());

    this.time.delayedCall(560, () => {
      this.scene.start(SCENES.GAME_OVER, {
        score: Math.floor(this.score),
        highScore: this.highScore
      });
    });
  }

  updateTouchVisibility() {
    const width = this.scale.width;
    const shouldShow = this.sys.game.device.input.touch || width <= GAME_CONFIG.ui.touchButtonMinWidth;
    this.touchButton.setVisible(shouldShow);
    this.touchButtonLabel.setVisible(shouldShow);
  }

  playAudioHook(name) {
    const audioEnabled = this.registry.get("audioEnabled");
    if (!audioEnabled) {
      return;
    }

    if (this.sound.get(name)) {
      this.sound.play(name, { volume: 0.5 });
    }
  }
}
