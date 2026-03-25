#!/usr/bin/env node
/**
 * Generate lightweight WAV sound effects for LoopLearn
 * Run: node scripts/generate-sounds.js
 * Creates: assets/sounds/*.wav
 */

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 22050;
const BITS = 16;
const CHANNELS = 1;

function generateWav(samples) {
  const dataSize = samples.length * 2; // 16-bit = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataSize);

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * CHANNELS * (BITS / 8), 28);
  buffer.writeUInt16LE(CHANNELS * (BITS / 8), 32);
  buffer.writeUInt16LE(BITS, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(val * 32767), 44 + i * 2);
  }
  return buffer;
}

function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}

function envelope(t, attack, sustain, release, total) {
  if (t < attack) return t / attack;
  if (t < attack + sustain) return 1;
  const releaseStart = attack + sustain;
  if (t < total) return 1 - (t - releaseStart) / release;
  return 0;
}

// ✅ Correct answer — bright sparkle ding (C6 + E6 quick)
function generateCorrect() {
  const duration = 0.25;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.005, 0.08, 0.165, duration);
    // Two-tone sparkle: C6 (1047) + E6 (1319) with slight delay
    const tone1 = sine(1047, t) * 0.5;
    const tone2 = t > 0.03 ? sine(1319, t) * 0.4 : 0;
    const shimmer = sine(2637, t) * 0.1 * Math.max(0, 1 - t * 8);
    samples[i] = (tone1 + tone2 + shimmer) * env * 0.7;
  }
  return generateWav(samples);
}

// ❌ Wrong answer — soft low thump (gentle, not punishing)
function generateWrong() {
  const duration = 0.2;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.005, 0.03, 0.165, duration);
    // Low tone with slight wobble
    const freq = 220 - t * 100; // descending
    const tone = sine(freq, t) * 0.6;
    const sub = sine(110, t) * 0.2;
    samples[i] = (tone + sub) * env * 0.5;
  }
  return generateWav(samples);
}

// 🎉 Level up — celebratory ascending chime
function generateLevelUp() {
  const duration = 0.6;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let val = 0;
    notes.forEach((freq, idx) => {
      const noteStart = idx * 0.12;
      const noteT = t - noteStart;
      if (noteT >= 0) {
        const noteEnv = Math.max(0, 1 - noteT * 3) * (idx === notes.length - 1 ? 1.2 : 0.8);
        val += sine(freq, t) * noteEnv * 0.3;
        val += sine(freq * 2, t) * noteEnv * 0.1; // harmonic
      }
    });
    samples[i] = val * 0.7;
  }
  return generateWav(samples);
}

// ✨ Loop complete — gentle whoosh/glow sound
function generateComplete() {
  const duration = 0.5;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.02, 0.15, 0.33, duration);
    // Rising shimmer
    const freq = 800 + t * 600;
    const tone = sine(freq, t) * 0.3;
    const harmony = sine(freq * 1.5, t) * 0.15;
    const sub = sine(440, t) * 0.2 * Math.max(0, 1 - t * 4);
    samples[i] = (tone + harmony + sub) * env * 0.65;
  }
  return generateWav(samples);
}

// 👆 Button tap — tiny bubble click
function generateTap() {
  const duration = 0.06;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.max(0, 1 - t * 20);
    const tone = sine(1200, t) * 0.3 + sine(800, t) * 0.2;
    samples[i] = tone * env * 0.4;
  }
  return generateWav(samples);
}

// 🏅 Badge earned — magical twinkle
function generateBadge() {
  const duration = 0.45;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  const sparkleFreqs = [1568, 1976, 2349, 2637]; // G6, B6, D7, E7
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let val = 0;
    sparkleFreqs.forEach((freq, idx) => {
      const delay = idx * 0.08;
      const nt = t - delay;
      if (nt >= 0) {
        const e = Math.max(0, 1 - nt * 4) * 0.3;
        val += sine(freq, t) * e;
      }
    });
    samples[i] = val * 0.6;
  }
  return generateWav(samples);
}

// 🔥 Streak — quick ascending boop
function generateStreak() {
  const duration = 0.15;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.005, 0.04, 0.105, duration);
    const freq = 600 + t * 2000; // quick sweep up
    samples[i] = sine(freq, t) * env * 0.45;
  }
  return generateWav(samples);
}

// Generate all sounds
const outDir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sounds = {
  correct: generateCorrect(),
  wrong: generateWrong(),
  levelup: generateLevelUp(),
  complete: generateComplete(),
  tap: generateTap(),
  badge: generateBadge(),
  streak: generateStreak(),
};

Object.entries(sounds).forEach(([name, buf]) => {
  const file = path.join(outDir, `${name}.wav`);
  fs.writeFileSync(file, buf);
  console.log(`✓ ${name}.wav (${(buf.length / 1024).toFixed(1)} KB)`);
});

console.log(`\nDone! ${Object.keys(sounds).length} sounds generated in assets/sounds/`);
