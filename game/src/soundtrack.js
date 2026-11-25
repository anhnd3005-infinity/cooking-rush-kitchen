// Procedural acoustic cafe soundtrack and ambient kitchen generative audio.
// Synthesizes warm jazz chord progressions and subtle kitchen atmosphere using Web Audio API oscillators.

export class BistroSoundtrack {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentChord = 0;
    this.timer = null;

    // Cozy jazz chord voicings (Hz frequencies)
    // Cmaj7 -> Am7 -> Dm7 -> G7 (bistro culinary cafe progression)
    this.chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7: C4, E4, G4, B4
      [220.00, 261.63, 329.63, 392.00], // Am7:   A3, C4, E4, G4
      [146.83, 220.00, 261.63, 349.23], // Dm7:   D3, A3, C4, F4
      [196.00, 246.94, 293.66, 349.23], // G7:    G3, B3, D4, F4
    ];
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChord(frequencies) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 2.4;

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Warm soft envelope attack and gentle acoustic release
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04 / (idx + 1), now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  start() {
    if (this.isPlaying) return;
    this.initContext();
    this.isPlaying = true;

    const step = () => {
      if (!this.isPlaying) return;
      this.playChord(this.chords[this.currentChord]);
      this.currentChord = (this.currentChord + 1) % this.chords.length;
      this.timer = setTimeout(step, 2400);
    };

    step();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
