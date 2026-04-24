import { GAME_CONFIG } from "../config/gameConfig.js";

function safeReadStorageNumber(key, fallback = 0) {
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) {
      return fallback;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  } catch (_) {
    return fallback;
  }
}

function safeReadStorageBoolean(key, fallback = true) {
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) {
      return fallback;
    }
    return value === "true";
  } catch (_) {
    return fallback;
  }
}

function safeWriteStorage(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch (_) {
    return;
  }
}

export function getHighScore() {
  return safeReadStorageNumber(GAME_CONFIG.storage.highScoreKey, 0);
}

export function setHighScore(score) {
  safeWriteStorage(GAME_CONFIG.storage.highScoreKey, Math.max(0, Math.floor(score)));
}

export function getAudioEnabled() {
  return safeReadStorageBoolean(GAME_CONFIG.storage.audioEnabledKey, true);
}

export function setAudioEnabled(enabled) {
  safeWriteStorage(GAME_CONFIG.storage.audioEnabledKey, Boolean(enabled));
}
