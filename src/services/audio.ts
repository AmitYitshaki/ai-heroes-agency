type Cue = 'select' | 'dispatch' | 'feedback' | 'success' | 'stars' | 'guard' | 'equip' | 'region';

class AudioManager {
  private context: AudioContext | null = null;
  private musicTimer: number | null = null;
  private musicStep = 0;

  unlock() {
    if (!this.context) this.context = new AudioContext();
    void this.context.resume();
  }

  play(cue: Cue, enabled = true) {
    if (!enabled || !this.context) return;
    const frequencies: Record<Cue, number[]> = {
      select: [520], dispatch: [260, 390], feedback: [300], success: [392, 523, 659], stars: [659, 784], guard: [180], equip: [440, 660], region: [330, 440, 550],
    };
    frequencies[cue].forEach((frequency, index) => this.tone(frequency, 0.055, 0.08 + index * 0.09));
  }

  startMusic(enabled = true, battle = false) {
    this.stopMusic();
    if (!enabled || !this.context) return;
    const notes = battle ? [196, 247, 294, 247] : [220, 277, 330, 277];
    this.musicTimer = window.setInterval(() => {
      this.tone(notes[this.musicStep++ % notes.length], 0.018, 0, 0.28);
    }, 720);
  }

  stopMusic() {
    if (this.musicTimer !== null) window.clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  private tone(frequency: number, gainValue: number, delay = 0, duration = 0.12) {
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.value = 0;
    oscillator.connect(gain).connect(this.context.destination);
    const start = this.context.currentTime + delay;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(gainValue, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }
}

export const audio = new AudioManager();
