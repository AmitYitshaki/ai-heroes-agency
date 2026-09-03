import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { RegionId } from '../schemas/game';
import { villainCharacterKey, villainPoseAssetId, type VillainPoseKind } from '../content/villains';
import { regions } from '../content/regions';

const ALL_REGIONS = regions.map((region) => region.id);
const ALL_POSES: VillainPoseKind[] = ['briefing', 'watching', 'reaction', 'defeated'];
const assetPath = (id: string) => join(process.cwd(), 'public', 'assets', 'characters', `${id}.webp`);

describe('battle -> villain mapping', () => {
  it('maps every villain region to its character key, and the training region to none', () => {
    expect(villainCharacterKey('fog_district')).toBe('bearach');
    expect(villainCharacterKey('no_limits_factory')).toBe('odveod');
    expect(villainCharacterKey('command_maze')).toBe('tangle');
    expect(villainCharacterKey('certainty_tower')).toBe('certainty');
    expect(villainCharacterKey('finale')).toBe('mashbesh');
    expect(villainCharacterKey('recruitment')).toBeNull(); // battle_01's training simulator has no villain
  });

  it('covers every region defined in content/regions.ts — no region is silently unmapped', () => {
    ALL_REGIONS.forEach((regionId) => {
      const key = villainCharacterKey(regionId);
      if (regionId === 'recruitment') expect(key).toBeNull();
      else expect(key).not.toBeNull();
    });
  });
});

describe('villain pose selection and fallback', () => {
  it('returns null for every pose in the training region — never renders a villain there', () => {
    ALL_POSES.forEach((pose) => expect(villainPoseAssetId('recruitment', pose)).toBeNull());
  });

  it('uses the standard idle/action/reaction/defeat_exit suffixes for the four regular villains', () => {
    const standard: Array<[RegionId, string]> = [
      ['fog_district', 'bearach'],
      ['no_limits_factory', 'odveod'],
      ['command_maze', 'tangle'],
      ['certainty_tower', 'certainty'],
    ];
    standard.forEach(([regionId, key]) => {
      expect(villainPoseAssetId(regionId, 'briefing')).toBe(`char_${key}_idle`);
      expect(villainPoseAssetId(regionId, 'watching')).toBe(`char_${key}_action`);
      expect(villainPoseAssetId(regionId, 'reaction')).toBe(`char_${key}_reaction`);
      expect(villainPoseAssetId(regionId, 'defeated')).toBe(`char_${key}_defeat_exit`);
    });
  });

  it('falls back to the finale villain\'s differently-named pose files (defeat, unverified_offer) instead of a nonexistent standard suffix', () => {
    expect(villainPoseAssetId('finale', 'briefing')).toBe('char_mashbesh_idle');
    expect(villainPoseAssetId('finale', 'watching')).toBe('char_mashbesh_unverified_offer'); // not char_mashbesh_action, which does not exist
    expect(villainPoseAssetId('finale', 'reaction')).toBe('char_mashbesh_reaction');
    expect(villainPoseAssetId('finale', 'defeated')).toBe('char_mashbesh_defeat'); // not char_mashbesh_defeat_exit, which does not exist
  });

  it('every asset id it can ever return actually exists as an optimized webp on disk', () => {
    ALL_REGIONS.forEach((regionId) => {
      ALL_POSES.forEach((pose) => {
        const assetId = villainPoseAssetId(regionId, pose);
        if (assetId === null) return;
        expect(existsSync(assetPath(assetId)), `missing asset for ${regionId}/${pose}: ${assetId}.webp`).toBe(true);
      });
    });
  });
});
