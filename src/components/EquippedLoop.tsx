import type { ComponentType } from 'react';
import { Antenna, CircleDot, Crown, Eye, Orbit, Shield, ShieldCheck, ShieldHalf, Sparkles, Star, Waves, Zap } from 'lucide-react';
import { cosmetics } from '../content/catalog';
import type { CampaignProgressV1 } from '../schemas/game';
import { CharacterArt } from './ui';

/**
 * Central visual manifest (one place, not per-screen): every cosmetic
 * item id -> the existing lucide-react icon (already a dependency — no new
 * assets, no graphics library) that renders it. Positioning is per *slot*
 * (see .cosmetic-badge--<slot> in styles/index.css), color comes from the
 * item's own `swatch`. Where an item's name has no literal icon (e.g. "שער
 * סגול" — a purple portal), its swatch color plus a shape distinct from its
 * slot-siblings is what carries the style, per the item's own description.
 */
const COSMETIC_ICONS: Record<string, ComponentType<{ 'aria-hidden'?: boolean }>> = {
  head_signal: Antenna, head_visor: Eye, head_crown: Crown,
  armor_mist: Shield, armor_factory: ShieldHalf, armor_prism: ShieldCheck,
  move_spark: Zap, move_wave: Waves, move_portal: CircleDot,
  emblem_star: Star, emblem_shield: Orbit, emblem_hero: Sparkles,
};

export interface EquippedLoopProps {
  poseId: string;
  alt: string;
  equipped: CampaignProgressV1['equippedCosmetics'];
  className?: string;
}

const SLOTS = ['head', 'armor', 'movement', 'emblem'] as const;

/**
 * Wraps Loop's character art with whatever the child has actually equipped
 * — every slot is a small badge anchored to a fixed spot just outside the
 * artwork (never over the face/body or any on-screen text), positioned and
 * colored per slot/item via CSS custom properties. Equipping armor also
 * adds a colored outline ring around the whole frame. Any animation lives
 * entirely in CSS and is neutralized by the existing global
 * prefers-reduced-motion / .reduced-motion rules — this component doesn't
 * need to know about that setting itself.
 */
export function EquippedLoop({ poseId, alt, equipped, className = '' }: EquippedLoopProps) {
  const armorItem = equipped.armor ? cosmetics.find((item) => item.itemId === equipped.armor) : undefined;
  const style = armorItem ? ({ '--armor-color': armorItem.swatch } as React.CSSProperties) : undefined;
  return <div className={`equipped-loop ${armorItem ? 'equipped-loop--armored' : ''} ${className}`} style={style}>
    <CharacterArt id={poseId} alt={alt} />
    {SLOTS.map((slot) => {
      const itemId = equipped[slot];
      const item = itemId ? cosmetics.find((candidate) => candidate.itemId === itemId) : undefined;
      if (!item) return null;
      const Icon = COSMETIC_ICONS[item.itemId];
      return <span key={slot} className={`cosmetic-badge cosmetic-badge--${slot}`} style={{ '--cosmetic-color': item.swatch } as React.CSSProperties} role="img" aria-label={`מצויד: ${item.label}`}>
        <Icon aria-hidden />
      </span>;
    })}
  </div>;
}
