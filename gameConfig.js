export const GAME_CONFIG = {
  world: {
    width: 960,
    height: 540,
    groundY: 460
  },
  player: {
    x: 180,
    y: 420,
    width: 84,
    height: 54,
    jumpVelocity: -560,
    jumpCooldownMs: 130,
    crashFlashMs: 130
  },
  movement: {
    baseSpeed: 260,
    maxSpeed: 680
  },
  difficultyCurve: {
    speedPerSecond: 12,
    spawnRatePerSecond: 0.025,
    maxSpawnMultiplier: 2.35
  },
  spawnTable: {
    minObstacleGapMs: 800,
    maxObstacleGapMs: 1600,
    minFishGapMs: 520,
    maxFishGapMs: 1260,
    obstacleWeights: {
      polarBear: 0.52,
      snowball: 0.48
    },
    fishGroundChance: 0.58
  },
  scoreRules: {
    fishPoints: 1,
    useTimeScore: true,
    timePointsPerSecond: 0.6
  },
  storage: {
    highScoreKey: "penguin-slide-high-score-v1",
    audioEnabledKey: "penguin-slide-audio-enabled-v1"
  },
  ui: {
    touchButtonMinWidth: 900
  }
};

export const SCENES = {
  BOOT: "boot",
  START_MENU: "start-menu",
  GAMEPLAY: "gameplay",
  GAME_OVER: "game-over"
};

export const GAME_STATE = {
  START: "start",
  PLAYING: "playing",
  GAME_OVER: "gameover"
};

export const INPUT_ACTION = {
  JUMP: "jump"
};
