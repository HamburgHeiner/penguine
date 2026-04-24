import { SCENES } from "../config/gameConfig.js";
import { setHighScore } from "../core/storage.js";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SCENES.GAME_OVER);
  }

  create(data) {
    const { width, height } = this.scale.gameSize;
    const score = Number.isFinite(data?.score) ? data.score : 0;
    const previousHigh = Number.isFinite(data?.highScore) ? data.highScore : 0;
    const highScore = Math.max(score, previousHigh);

    setHighScore(highScore);

    this.add.rectangle(width * 0.5, height * 0.5, width, height, 0x072f45, 0.68);

    this.add
      .text(width * 0.5, 145, "Wipeout!", {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "84px",
        color: "#ffe6a5",
        fontStyle: "bold",
        stroke: "#052436",
        strokeThickness: 10
      })
      .setOrigin(0.5);

    this.add.image(width * 0.5, 262, "penguin").setScale(2).setRotation(0.24);

    this.add
      .text(width * 0.5, 338, `Score: ${score}`, {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "42px",
        color: "#f1fdff",
        stroke: "#042f45",
        strokeThickness: 7
      })
      .setOrigin(0.5);

    this.add
      .text(width * 0.5, 388, `High Score: ${highScore}`, {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "34px",
        color: "#ffe28a",
        stroke: "#042f45",
        strokeThickness: 7
      })
      .setOrigin(0.5);

    const retryButton = this.createButton(width * 0.5, 465, "Slide Again");
    retryButton.on("pointerdown", () => {
      this.cameras.main.fadeOut(150, 235, 249, 255);
      this.time.delayedCall(150, () => this.scene.start(SCENES.GAMEPLAY));
    });

    const menuHint = this.add
      .text(width * 0.5, 515, "Press M for Menu", {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "22px",
        color: "#d2f5ff"
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-M", () => this.scene.start(SCENES.START_MENU));
    this.time.delayedCall(2200, () => {
      this.tweens.add({
        targets: menuHint,
        alpha: 0.4,
        yoyo: true,
        repeat: -1,
        duration: 650
      });
    });
  }

  createButton(x, y, text) {
    const button = this.add
      .rectangle(x, y, 278, 74, 0x0d698e, 0.92)
      .setStrokeStyle(3, 0xd7f3ff, 0.95)
      .setInteractive({ useHandCursor: true });

    const label = this.add
      .text(x, y, text, {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "30px",
        color: "#ffffff",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    button.on("pointerover", () => {
      button.setFillStyle(0x1484ae, 0.98);
    });
    button.on("pointerout", () => {
      button.setFillStyle(0x0d698e, 0.92);
    });

    button.label = label;
    return button;
  }
}
