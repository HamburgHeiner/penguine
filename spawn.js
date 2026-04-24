function weightedChoice(weightTable, randomFn = Math.random) {
  const entries = Object.entries(weightTable);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const roll = randomFn() * totalWeight;
  let cursor = 0;

  for (const [name, weight] of entries) {
    cursor += weight;
    if (roll <= cursor) {
      return name;
    }
  }

  return entries[entries.length - 1][0];
}

export function pickObstacleType(spawnTable, randomFn = Math.random) {
  return weightedChoice(spawnTable.obstacleWeights, randomFn);
}

export function getNextSpawnGapMs(baseMin, baseMax, spawnMultiplier, randomFn = Math.random) {
  const adjustedMin = baseMin / spawnMultiplier;
  const adjustedMax = baseMax / spawnMultiplier;
  return adjustedMin + (adjustedMax - adjustedMin) * randomFn();
}

export function pickFishY(spawnTable, groundY, randomFn = Math.random) {
  const fishGround = randomFn() < spawnTable.fishGroundChance;
  if (fishGround) {
    return groundY - 62;
  }
  return groundY - 150;
}
