import type { RegionId } from '../schemas/game';
import { villainPoseAssetId, type VillainPoseKind } from '../content/villains';
import { CharacterArt } from './ui';

export interface VillainReactionProps {
  regionId: RegionId;
  pose: VillainPoseKind;
  /** Leave empty for a purely decorative cameo; pass a short label only when it conveys something the surrounding text doesn't already say. */
  alt?: string;
}

/**
 * A small, secondary-sized villain cameo for use *inside* a battle phase
 * (compose/outcome/victory), as opposed to the large briefing "vs" stage.
 * Renders nothing for regions with no villain (recruitment/training) or an
 * unmapped pose — callers never need their own guard for that. Never place
 * this over a question, choices, feedback, or a CTA; it is a corner accent,
 * not a source of information (see .villain-reaction--corner in styles).
 */
export function VillainReaction({ regionId, pose, alt = '' }: VillainReactionProps) {
  const assetId = villainPoseAssetId(regionId, pose);
  if (!assetId) return null;
  return <CharacterArt id={assetId} alt={alt} className="villain-reaction" />;
}
