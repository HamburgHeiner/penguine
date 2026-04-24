import { SCENES } from "../config/gameConfig.js";
import { getAudioEnabled, getHighScore, setAudioEnabled } from "../core/storage.js";

export class StartMenuScene extends Phaser.Scene {
  constructor() {
    super(SCENES.START_MENU);
  }

  create() {
    const { width, height } = this.scale.gameSize;
    const highScore = getHighScore();
    const audioEnabled = getAudioEnabled();
    this.registry.set("audioEnabled", audioEnabled);

    this.add.rectangle(width * 0.5, height * 0.5, width, height, 0x0a4a6e, 0.56);

    this.add
      .text(width * 0.5, 120, "Penguin Slide", {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "72px",
        color: "#f5fdff",
        fontStyle: "bold",
        stroke: "#032b3f",
        strokeThickness: 10
      })
      .setOrigin(0.5);

    this.add
      .text(width * 0.5, 182, "Dodge. Jump. Collect Fish. Survive.", {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "28px",
        color: "#d7f4ff"
      })
      .setOrigin(0.5);

    this.add.image(width * 0.5, 280, "penguin").setScale(2.3).setRotation(-0.08);

    this.add
      .text(width * 0.5, 356, `High Score: ${highScore}`, {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "34px",
        color: "#ffe28a",
        stroke: "#04354d",
        strokeThickness: 6
      })
      .setOrigin(0.5);

    const playButton = this.createButton(width * 0.5, 430, "Play");
    playButton.on("pointerdown", () => {
      this.cameras.main.fadeOut(160, 235, 249, 255);
      this.time.delayedCall(160, () => this.scene.start(SCENES.GAMEPLAY));
    });

    const audioButton = this.createButton(width - 130, 48, audioEnabled ? "Audio: On" : "Audio: Off", 190, 56);
    audioButton.on("pointerdown", () => {
      const next = !this.registry.get("audioEnabled");
      this.registry.set("audioEnabled", next);
      setAudioEnabled(next);
      audioButton.label.setText(next ? "Audio: On" : "Audio: Off");
    });

    this.add
      .text(width * 0.5, 488, "Jump with Space, click, tap, or the on-screen button.", {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "22px",
        color: "#d2f4ff"
      })
      .setOrigin(0.5);
  }

  createButton(x, y, text, width = 240, height = 72) {
    const buttonBg = this.add
      .rectangle(x, y, width, height, 0x0d698e, 0.92)
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

    buttonBg.on("pointerover", () => {
      buttonBg.setFillStyle(0x1484ae, 0.98);
    });
    buttonBg.on("pointerout", () => {
      buttonBg.setFillStyle(0x0d698e, 0.92);
    });

    buttonBg.label = label;
    return buttonBg;
  }
}
