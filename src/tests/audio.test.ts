import { describe, expect, it } from 'vitest';
import { resolveMusicCue } from '../services/musicRouting';
import { audio } from '../services/audio';

describe('music route mapping', () => {
  it('maps onboarding and ceremony screens to their dedicated tracks', () => {
    expect(resolveMusicCue('/')).toBe('onboarding');
    expect(resolveMusicCue('/recruit')).toBe('onboarding');
    expect(resolveMusicCue('/finale')).toBe('certification');
  });

  it('maps the hub screens (map, workshop, bonus, settings) to the headquarters loop', () => {
    expect(resolveMusicCue('/map')).toBe('headquarters');
    expect(resolveMusicCue('/workshop/2')).toBe('headquarters');
    expect(resolveMusicCue('/bonus/1')).toBe('headquarters');
    expect(resolveMusicCue('/settings')).toBe('headquarters');
  });

  it('maps every battle to its region soundtrack, including the tutorial and the finale', () => {
    expect(resolveMusicCue('/battle/battle_01')).toBe('headquarters'); // recruitment region — first activation
    expect(resolveMusicCue('/battle/battle_02')).toBe('zone_fog');
    expect(resolveMusicCue('/battle/battle_07')).toBe('zone_fog');
    expect(resolveMusicCue('/battle/battle_08')).toBe('zone_factory');
    expect(resolveMusicCue('/battle/battle_13')).toBe('zone_factory');
    expect(resolveMusicCue('/battle/battle_14')).toBe('zone_maze');
    expect(resolveMusicCue('/battle/battle_18')).toBe('zone_maze');
    expect(resolveMusicCue('/battle/battle_19')).toBe('zone_tower_finale');
    expect(resolveMusicCue('/battle/battle_22')).toBe('zone_tower_finale');
    expect(resolveMusicCue('/battle/battle_23')).toBe('zone_tower_finale');
  });

  it('falls back to the hub loop for an unknown battle id instead of throwing', () => {
    expect(resolveMusicCue('/battle/not-a-real-battle')).toBe('headquarters');
  });
});

describe('AudioManager resilience', () => {
  it('never throws from play/startMusic/stopMusic/unlock even without a prior unlock (no AudioContext yet)', () => {
    expect(() => audio.play('select', true)).not.toThrow();
    expect(() => audio.play('success', true)).not.toThrow(); // file-backed cue, no network in this environment
    expect(() => audio.play('boss', false)).not.toThrow(); // disabled — must be a no-op
    expect(() => audio.startMusic(true, 'headquarters')).not.toThrow();
    expect(() => audio.startMusic(false, 'onboarding')).not.toThrow();
    expect(() => audio.stopMusic()).not.toThrow();
    expect(() => audio.unlock()).not.toThrow();
  });

  it('a disabled sound effect never plays (no side effect to assert on directly, but must not throw or hang)', () => {
    expect(() => audio.play('stars', false)).not.toThrow();
  });
});
