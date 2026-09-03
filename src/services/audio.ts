import { Howl, Howler } from 'howler';

export type MusicCue = 'onboarding' | 'headquarters' | 'zone_fog' | 'zone_factory' | 'zone_maze' | 'zone_tower_finale' | 'certification';
export type SfxCue = 'select' | 'dispatch' | 'feedback' | 'success' | 'stars' | 'guard' | 'equip' | 'region' | 'ceremony' | 'boss';

const musicSources: Record<MusicCue, string> = {
  onboarding: '/audio/music/onboarding.mp3',
  headquarters: '/audio/music/headquarters.mp3',
  zone_fog: '/audio/music/zone-fog.mp3',
  zone_factory: '/audio/music/zone-factory.mp3',
  zone_maze: '/audio/music/zone-maze.mp3',
  zone_tower_finale: '/audio/music/zone-tower-finale.mp3',
  certification: '/audio/music/certification.mp3',
};

// Only cues with a genuine licensed-file upgrade are listed here — see
// docs/AUDIO_TECH_DECISION.md for why 'select'/'dispatch'/'feedback'/'guard'/
// 'equip'/'region' stay on the lightweight synthesized tones below instead.
const sfxSources: Partial<Record<SfxCue, string>> = {
  success: '/audio/sfx/success.mp3',
  stars: '/audio/sfx/stars.mp3',
  ceremony: '/audio/sfx/ceremony.mp3',
  boss: '/audio/sfx/boss.mp3',
};

const synthesizedFrequencies: Partial<Record<SfxCue, number[]>> = {
  select: [520], dispatch: [260, 390], feedback: [300], guard: [180], equip: [440, 660], region: [330, 440, 550],
};

const MUSIC_VOLUME = 0.35;
const MUSIC_FADE_MS = 600;
const DUCK_RATIO = 0.4;
const DUCK_OUT_MS = 180;
const DUCK_HOLD_MS = 900;
const DUCK_IN_MS = 260;

class AudioManager {
  private context: AudioContext | null = null;
  private unlocked = false;
  private currentMusic: Howl | null = null;
  private currentMusicCue: MusicCue | null = null;
  private sfxCache = new Map<SfxCue, Howl>();
  private activeOscillators = new Set<OscillatorNode>();

  /** Must run inside a user-gesture handler — browsers block audio until one occurs. */
  unlock() {
    this.unlocked = true;
    try {
      if (!this.context) this.context = new AudioContext();
      void Promise.resolve(this.context.resume()).catch(() => undefined);
      if (Howler.ctx && Howler.ctx.state === 'suspended') void Promise.resolve(Howler.ctx.resume()).catch(() => undefined);
    } catch {
      /* AudioContext unsupported or blocked (e.g. some in-app browsers); the
         game stays fully playable, just silent — see A11Y-AUD-02. */
    }
  }

  play(cue: SfxCue, enabled = true) {
    if (!enabled || !this.unlocked) return;
    const src = sfxSources[cue];
    if (src) { this.playFile(cue, src); return; }
    this.playSynthesized(cue);
  }

  startMusic(enabled: boolean, cue: MusicCue) {
    if (!enabled) { this.stopMusic(true); this.currentMusicCue = cue; return; }
    if (!this.unlocked) { this.currentMusicCue = cue; return; }
    if (this.currentMusicCue === cue && this.currentMusic) return; // already playing this cue
    const outgoing = this.currentMusic;
    this.currentMusic = null;
    this.currentMusicCue = cue;
    if (outgoing) {
      try { outgoing.fade(MUSIC_VOLUME, 0, MUSIC_FADE_MS); } catch { /* ignore */ }
      setTimeout(() => { try { outgoing.stop(); outgoing.unload(); } catch { /* ignore */ } }, MUSIC_FADE_MS + 50);
    }
    try {
      const incoming = new Howl({
        src: [musicSources[cue]],
        loop: true,
        volume: 0,
        onloaderror: () => { if (this.currentMusic === incoming) this.currentMusic = null; },
        onplayerror: () => { if (this.currentMusic === incoming) this.currentMusic = null; },
      });
      incoming.play();
      incoming.fade(0, MUSIC_VOLUME, MUSIC_FADE_MS);
      this.currentMusic = incoming;
    } catch {
      this.currentMusic = null; // playable without music; nothing else in the game depends on it
    }
  }

  stopMusic(immediate = false) {
    const outgoing = this.currentMusic;
    this.currentMusic = null;
    this.currentMusicCue = null;
    if (!outgoing) return;
    if (immediate) {
      try { outgoing.stop(); outgoing.unload(); } catch { /* ignore */ }
      return;
    }
    try { outgoing.fade(MUSIC_VOLUME, 0, 300); } catch { /* ignore */ }
    setTimeout(() => { try { outgoing.stop(); outgoing.unload(); } catch { /* ignore */ } }, 350);
  }

  /** Immediately silences file-backed and synthesized effects when muted. */
  stopEffects() {
    this.sfxCache.forEach((howl) => { try { howl.stop(); } catch { /* ignore */ } });
    this.activeOscillators.forEach((oscillator) => { try { oscillator.stop(); } catch { /* already stopped */ } });
    this.activeOscillators.clear();
  }

  private playFile(cue: SfxCue, src: string) {
    try {
      let howl = this.sfxCache.get(cue);
      if (!howl) {
        howl = new Howl({ src: [src], volume: 0.7, onloaderror: () => this.sfxCache.delete(cue) });
        this.sfxCache.set(cue, howl);
      }
      this.duckMusic();
      howl.stop();
      howl.play();
    } catch {
      this.playSynthesized(cue);
    }
  }

  /** Briefly lowers the background loop so a stinger (ceremony, boss, stars, success) reads clearly. */
  private duckMusic() {
    const music = this.currentMusic;
    if (!music) return;
    try {
      music.fade(MUSIC_VOLUME, MUSIC_VOLUME * DUCK_RATIO, DUCK_OUT_MS);
      setTimeout(() => { if (this.currentMusic === music) music.fade(MUSIC_VOLUME * DUCK_RATIO, MUSIC_VOLUME, DUCK_IN_MS); }, DUCK_HOLD_MS);
    } catch { /* ignore */ }
  }

  private playSynthesized(cue: SfxCue) {
    if (!this.context) return;
    const set = synthesizedFrequencies[cue];
    if (!set) return;
    set.forEach((frequency, index) => this.tone(frequency, 0.055, 0.08 + index * 0.09));
  }

  private tone(frequency: number, gainValue: number, delay = 0, duration = 0.12) {
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.value = 0;
    oscillator.connect(gain).connect(this.context.destination);
    this.activeOscillators.add(oscillator);
    oscillator.addEventListener('ended', () => this.activeOscillators.delete(oscillator), { once: true });
    const start = this.context.currentTime + delay;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(gainValue, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }
}

export const audio = new AudioManager();
