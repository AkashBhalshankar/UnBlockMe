/**
 * Procedural Web Audio API Synthesizer
 * Zero external audio files (.mp3, .wav, .ogg).
 * Generates tactile physical clicks, friction notches, seal cracks,
 * dampening thuds, and resolution chords purely on the client.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  getContext() {
    if (this.muted) return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  /**
   * Subtle high-precision tactile tick for sliders & toggles
   */
  playTick(freq = 520, duration = 0.015, volume = 0.1) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  /**
   * Drag notch haptic audio at 25%, 50%, 75% thresholds
   */
  playDragNotch(step = 1) {
    const freqs = { 1: 380, 2: 480, 3: 580, 4: 720 };
    const freq = freqs[step] || 480;
    this.playTick(freq, 0.02, 0.14);
  }

  /**
   * Rebound dampening thud when slider is released below unlock threshold
   */
  playThud() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // Ignore
    }
  }

  /**
   * Brittle analog wax fracture / seal crack sound
   */
  playWaxCrack() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const bufferSize = Math.floor(ctx.sampleRate * 0.045);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Ignore
    }
  }

  /**
   * Tactile unlock pop
   */
  playUnlockPop() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      this.playTick(880, 0.03, 0.16);
      setTimeout(() => {
        this.playTick(1240, 0.04, 0.14);
      }, 25);
    } catch {
      // Ignore
    }
  }

  /**
   * Resolution Chord: C Major 7 Harmonic Chord
   * C4 (261.63Hz), E4 (329.63Hz), G4 (392.00Hz), B4 (493.88Hz), C5 (523.25Hz)
   * Played with an ethereal, calming acoustic envelope.
   */
  playResolutionChord() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const chord = [261.63, 329.63, 392.0, 493.88, 523.25];
      chord.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.getContext()) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Gentle chime attack and long calming decay
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }, idx * 65);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Wax Seal debossing impression sound (dull heavy stamp)
   */
  playSealStamp() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new AudioSynthesizer();
export default soundEngine;
