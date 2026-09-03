import type { RegionId } from '../schemas/game';

/**
 * Narrative moment a villain's art should reflect, decoupled from which
 * physical pose asset backs it — see `POSE_SUFFIX`/`POSE_OVERRIDES` below,
 * the single place that maps a kind to an actual file per character.
 */
export type VillainPoseKind = 'briefing' | 'watching' | 'reaction' | 'defeated';

// Which villain character (asset filename prefix `char_<key>_...`) owns each
// region. `recruitment` (battle 1's training simulator) deliberately has no
// entry — it is the one battle with no villain, by design (see
// `isTrainingBattle` in content/battles.ts).
const CHARACTER_KEY: Partial<Record<RegionId, string>> = {
  fog_district: 'bearach',
  no_limits_factory: 'odveod',
  command_maze: 'tangle',
  certainty_tower: 'certainty',
  finale: 'mashbesh',
};

// The asset manifest's standard 4-pose set per villain (`idle`, `action`,
// `reaction`, `defeat_exit` — see docs/handoff/source/07_ASSET_MANIFEST.md
// "Villains: 5 characters, each idle/action/reaction/defeat/exit").
const POSE_SUFFIX: Record<VillainPoseKind, string> = {
  briefing: 'idle',
  watching: 'action',
  reaction: 'reaction',
  defeated: 'defeat_exit',
};

// The finale villain (מַשְׁבֵּש) was delivered with a differently-named set
// (`defeat` not `defeat_exit`, `unverified_offer` not `action`) — see the
// actual files in public/assets/characters/. `unverified_offer` doubles
// perfectly as his "watching" pose: he's mid-tempting-offer while the child
// works (compare FinalBattlePage's existing "כדאי להוסיף מופע בלונים!" lure).
const POSE_OVERRIDES: Record<string, Partial<Record<VillainPoseKind, string>>> = {
  mashbesh: { watching: 'unverified_offer', defeated: 'defeat' },
};

/** The villain character (asset key) for a region, or null for the one villain-free region (recruitment/training). */
export function villainCharacterKey(regionId: RegionId): string | null {
  return CHARACTER_KEY[regionId] ?? null;
}

/** The character-art asset id for this region's villain in the given narrative moment, or null when the region has no villain at all. */
export function villainPoseAssetId(regionId: RegionId, pose: VillainPoseKind): string | null {
  const key = villainCharacterKey(regionId);
  if (!key) return null;
  const suffix = POSE_OVERRIDES[key]?.[pose] ?? POSE_SUFFIX[pose];
  return `char_${key}_${suffix}`;
}
