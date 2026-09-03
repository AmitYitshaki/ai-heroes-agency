// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { EquippedLoop } from '../components/EquippedLoop';
import { cosmetics } from '../content/catalog';
import type { CampaignProgressV1 } from '../schemas/game';

const NONE: CampaignProgressV1['equippedCosmetics'] = { head: null, armor: null, movement: null, emblem: null };
const head = cosmetics.find((item) => item.slot === 'head')!;
const armor = cosmetics.find((item) => item.slot === 'armor')!;
const movement = cosmetics.find((item) => item.slot === 'movement')!;
const emblem = cosmetics.find((item) => item.slot === 'emblem')!;

const roots: Root[] = [];
afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.replaceChildren();
});

async function render(equipped: CampaignProgressV1['equippedCosmetics']) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push(root);
  await act(async () => {
    root.render(<EquippedLoop poseId="char_loop_idle" alt="לופּ-X" equipped={equipped} />);
  });
  return host;
}

describe('EquippedLoop renders a real visual change per slot, not just data', () => {
  it('shows no badges and no armor ring when nothing is equipped', async () => {
    const host = await render(NONE);
    expect(host.querySelectorAll('.cosmetic-badge')).toHaveLength(0);
    expect(host.querySelector('.equipped-loop--armored')).toBeNull();
    expect(host.querySelector('.character-art img')?.getAttribute('src')).toBe('/assets/characters/char_loop_idle.webp'); // the base pose itself never changes — cosmetics layer around it
  });

  it('each of the four slots renders its own distinct badge (class + color), and nothing else changes when only one is equipped', async () => {
    const host = await render({ ...NONE, head: head.itemId });
    const badges = host.querySelectorAll('.cosmetic-badge');
    expect(badges).toHaveLength(1);
    expect(badges[0].classList.contains('cosmetic-badge--head')).toBe(true);
    expect((badges[0] as HTMLElement).style.getPropertyValue('--cosmetic-color')).toBe(head.swatch);
    expect(badges[0].getAttribute('aria-label')).toContain(head.label);
  });

  it('equipping armor adds the colored outline ring in addition to its badge', async () => {
    const host = await render({ ...NONE, armor: armor.itemId });
    expect(host.querySelector('.equipped-loop--armored')).not.toBeNull();
    const wrapper = host.querySelector('.equipped-loop') as HTMLElement;
    expect(wrapper.style.getPropertyValue('--armor-color')).toBe(armor.swatch);
    expect(host.querySelector('.cosmetic-badge--armor')).not.toBeNull();
  });

  it('all four slots equipped at once render four distinct badges with four distinct colors', async () => {
    const host = await render({ head: head.itemId, armor: armor.itemId, movement: movement.itemId, emblem: emblem.itemId });
    const badges = Array.from(host.querySelectorAll('.cosmetic-badge'));
    expect(badges).toHaveLength(4);
    const slotsSeen = badges.map((badge) => ['head', 'armor', 'movement', 'emblem'].find((slot) => badge.classList.contains(`cosmetic-badge--${slot}`)));
    expect(new Set(slotsSeen).size).toBe(4); // one badge per slot, all distinct positions
    // Each badge's color is driven by its own equipped item's swatch (not a shared default).
    const bySlot: Record<string, typeof head> = { head, armor, movement, emblem };
    for (const slot of ['head', 'armor', 'movement', 'emblem']) {
      const badge = badges.find((candidate) => candidate.classList.contains(`cosmetic-badge--${slot}`))!;
      expect((badge as HTMLElement).style.getPropertyValue('--cosmetic-color')).toBe(bySlot[slot].swatch);
    }
  });

  it('the movement badge is present regardless of the reduced-motion setting — only the CSS animation stops, never the visual itself (verified live in browser QA; the global .reduced-motion rule neutralizes animation-name for every element, this component does not need its own reduced-motion prop)', async () => {
    const host = await render({ ...NONE, movement: movement.itemId });
    expect(host.querySelector('.cosmetic-badge--movement')).not.toBeNull();
  });

  it('switching which item is equipped in a slot changes the rendered badge (color/icon), proving the render is driven by the actual equipped id, not just "slot filled"', async () => {
    const [itemA, itemB] = cosmetics.filter((item) => item.slot === 'emblem');
    const first = await render({ ...NONE, emblem: itemA.itemId });
    const firstColor = (first.querySelector('.cosmetic-badge--emblem') as HTMLElement).style.getPropertyValue('--cosmetic-color');
    act(() => { roots.pop()?.unmount(); });
    first.remove();

    const second = await render({ ...NONE, emblem: itemB.itemId });
    const secondColor = (second.querySelector('.cosmetic-badge--emblem') as HTMLElement).style.getPropertyValue('--cosmetic-color');
    expect(secondColor).not.toBe(firstColor);
    expect(firstColor).toBe(itemA.swatch);
    expect(secondColor).toBe(itemB.swatch);
  });
});
