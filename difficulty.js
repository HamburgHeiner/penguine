import { GAME_CONFIG } from "../config/gameConfig.js";

export function getDifficultyAt(runtimeSeconds) {
  const curve = GAME_CONFIG.difficultyCurve;
  const movement = GAME_CONFIG.movement;

  const currentSpeed = Math.min(
    movement.maxSpeed,
    movement.baseSpeed + runtimeSeconds * curve.speedPerSecond
  );

  const spawnMultiplier = Math.min(
    curve.maxSpawnMultiplier,
    1 + runtimeSeconds * curve.spawnRatePerSecond
  );

  return {
    currentSpeed,
    spawnMultiplier
  };
}
