import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Sound assets — require'd at bundle time
const SOUND_FILES = {
  correct: require('../../assets/sounds/correct.wav'),
  wrong: require('../../assets/sounds/wrong.wav'),
  levelup: require('../../assets/sounds/levelup.wav'),
  complete: require('../../assets/sounds/complete.wav'),
  tap: require('../../assets/sounds/tap.wav'),
  badge: require('../../assets/sounds/badge.wav'),
  streak: require('../../assets/sounds/streak.wav'),
};

// Haptic patterns paired with sounds
const HAPTIC_MAP = {
  correct: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  wrong: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  levelup: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  complete: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  badge: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  streak: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
};

let players = {};
let soundEnabled = true;
let initialized = false;

async function init() {
  if (initialized) return;
  initialized = true;
  try {
    await setAudioModeAsync({
      playsInSilentModeIOS: false,
      shouldRouteThroughEarpiece: false,
    });
  } catch {
    // Audio not available (web, simulator without audio)
  }
}

async function preload() {
  await init();
  for (const [key, source] of Object.entries(SOUND_FILES)) {
    try {
      players[key] = createAudioPlayer(source);
      players[key].volume = 0.6;
    } catch {
      // Sound file couldn't load — haptics will still work
    }
  }
}

async function play(name) {
  if (!soundEnabled) return;

  // Always fire haptics (works even if sound fails)
  const haptic = HAPTIC_MAP[name];
  if (haptic && Platform.OS !== 'web') {
    haptic().catch(() => {});
  }

  const player = players[name];
  if (!player) return;

  try {
    player.seekTo(0);
    player.play();
  } catch {
    // Sound playback failed — haptic already fired
  }
}

function setEnabled(enabled) {
  soundEnabled = enabled;
}

function isEnabled() {
  return soundEnabled;
}

async function unloadAll() {
  for (const p of Object.values(players)) {
    try { p.release(); } catch {}
  }
  players = {};
  initialized = false;
}

export const SoundService = {
  preload,
  play,
  setEnabled,
  isEnabled,
  unloadAll,
};
