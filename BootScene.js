import { SCENES, GAME_CONFIG } from "../config/gameConfig.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENES.BOOT);
  }

  preload() {
    this.createPlaceholderTextures();
  }

  create() {
    this.scene.start(SCENES.START_MENU);
  }

  createPlaceholderTextures() {
    const graphics = this.add.graphics();

    graphics.clear();
    graphics.fillStyle(0x053f63, 1);
    graphics.fillRoundedRect(0, 0, GAME_CONFIG.world.width, 300, 28);
    graphics.generateTexture("bgSky", GAME_CONFIG.world.width, 300);

    graphics.clear();
    graphics.fillStyle(0xeff8ff, 1);
    graphics.fillRect(0, 0, 160, 80);
    graphics.fillStyle(0xffffff, 0.7);
    graphics.fillCircle(32, 18, 16);
    graphics.fillCircle(74, 26, 20);
    graphics.fillCircle(122, 22, 15);
    graphics.generateTexture("snowDrift", 160, 80);

    graphics.clear();
    graphics.fillStyle(0x1e5f7a, 1);
    graphics.fillEllipse(42, 28, 76, 50);
    graphics.fillStyle(0xf0fbff, 1);
    graphics.fillEllipse(45, 34, 34, 26);
    graphics.fillStyle(0xffb347, 1);
    graphics.fillTriangle(68, 27, 80, 33, 68, 38);
    graphics.fillStyle(0x111318, 1);
    graphics.fillCircle(59, 24, 3);
    graphics.generateTexture("penguin", 86, 58);

    graphics.clear();
    graphics.fillStyle(0xf8fdff, 1);
    graphics.fillRoundedRect(0, 0, 114, 72, 24);
    graphics.fillStyle(0x212229, 1);
    graphics.fillCircle(24, 23, 6);
    graphics.fillCircle(44, 23, 6);
    graphics.fillStyle(0x2d2f36, 1);
    graphics.fillRect(17, 40, 78, 24);
    graphics.generateTexture("polarBear", 116, 74);

    graphics.clear();
    graphics.fillStyle(0xf7ffff, 1);
    graphics.fillCircle(20, 20, 20);
    graphics.fillStyle(0xd9f4ff, 1);
    graphics.fillCircle(20, 20, 16);
    graphics.generateTexture("snowball", 40, 40);

    graphics.clear();
    graphics.fillStyle(0x2ac4f3, 1);
    graphics.fillEllipse(22, 12, 36, 20);
    graphics.fillTriangle(36, 12, 48, 4, 48, 20);
    graphics.fillStyle(0xffffff, 0.9);
    graphics.fillCircle(12, 9, 3);
    graphics.generateTexture("fish", 50, 24);

    graphics.clear();
    graphics.fillStyle(0x72d3ff, 1);
    graphics.fillRoundedRect(0, 0, GAME_CONFIG.world.width, 18, 8);
    graphics.generateTexture("iceGround", GAME_CONFIG.world.width, 18);

    graphics.destroy();
  }
}
