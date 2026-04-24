import { GAME_CONFIG } from "./config/gameConfig.js";
import { BootScene } from "./scenes/BootScene.js";
import { GameplayScene } from "./scenes/GameplayScene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";
import { StartMenuScene } from "./scenes/StartMenuScene.js";

const phaserConfig = {
  type: Phaser.AUTO,
  parent: "game-root",
  backgroundColor: "#9adffd",
  width: GAME_CONFIG.world.width,
  height: GAME_CONFIG.world.height,
  scene: [BootScene, StartMenuScene, GameplayScene, GameOverScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1250, x: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(phaserConfig);
