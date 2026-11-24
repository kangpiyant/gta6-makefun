// audio.js - tiny WebAudio bleeps, no audio files needed
let ctx = null;
export function beep(freq = 440, dur = 0.08, type = 'square', vol = 0.04) {
  try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.value = vol; o.connect(g); g.connect(ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); o.stop(ctx.currentTime + dur); } catch {}
}
export function soundPickup() { beep(880, 0.12); }
export function soundCash() { beep(660, 0.08); setTimeout(() => beep(990, 0.12), 70); }
export function soundSiren() { beep(520, 0.1, 'sawtooth', 0.02); }
