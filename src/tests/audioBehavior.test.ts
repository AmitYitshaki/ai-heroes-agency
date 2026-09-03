import { describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
  instances: [] as Array<{ play: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn>; fade: ReturnType<typeof vi.fn>; unload: ReturnType<typeof vi.fn> }>,
}));

vi.mock('howler', () => {
  class FakeHowl {
    play = vi.fn();
    stop = vi.fn();
    fade = vi.fn();
    unload = vi.fn();
    constructor(_options: unknown) { mockState.instances.push(this); }
  }
  return { Howl: FakeHowl, Howler: { ctx: { state: 'running', resume: vi.fn() } } };
});

import { audio } from '../services/audio';

describe('AudioManager release invariants', () => {
  it('does not play before unlock, prevents same-cue overlap, and stops active effects on mute', () => {
    audio.play('success', true);
    audio.startMusic(true, 'headquarters');
    expect(mockState.instances).toHaveLength(0);

    vi.stubGlobal('AudioContext', class {
      currentTime = 0;
      destination = {};
      resume = vi.fn();
    });
    audio.unlock();
    audio.play('success', true);
    const effect = mockState.instances[0];
    expect(effect.stop).toHaveBeenCalledTimes(1);
    expect(effect.play).toHaveBeenCalledTimes(1);

    audio.play('success', true);
    expect(mockState.instances).toHaveLength(1);
    expect(effect.stop).toHaveBeenCalledTimes(2);
    expect(effect.play).toHaveBeenCalledTimes(2);

    audio.stopEffects();
    expect(effect.stop).toHaveBeenCalledTimes(3);

    audio.startMusic(true, 'headquarters');
    const music = mockState.instances[1];
    expect(music.play).toHaveBeenCalledTimes(1);
    audio.startMusic(true, 'headquarters');
    expect(mockState.instances).toHaveLength(2);
    audio.startMusic(false, 'headquarters');
    expect(music.stop).toHaveBeenCalledTimes(1);
    expect(music.unload).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
