// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('howler', () => {
  class FakeHowl {
    play = vi.fn();
    stop = vi.fn();
    fade = vi.fn();
    unload = vi.fn();
    constructor(_options: unknown) { /* never reached: settings keep effects/music disabled and audio never unlocks */ }
  }
  return { Howl: FakeHowl, Howler: { ctx: { state: 'running', resume: vi.fn() } } };
});

import { WorkshopPage } from '../features/workshop/WorkshopPage';
import { GameProvider } from '../state/GameContext';
import { STORAGE_KEY } from '../services/progress';
import { cosmetics } from '../content/catalog';

const roots: Root[] = [];
afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.replaceChildren();
});

function seed(overrides: Record<string, unknown> = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    schemaVersion: 1, characterId: 'hero', nextBattleOrder: 23,
    battleBestHalfUnits: { battle_07: 10 }, // unlocks workshop visit 1 (head slot)
    totalEarnedHalfUnits: 100, walletHalfUnits: 100, completedBonusIds: [], purchasedCosmeticIds: [],
    equippedCosmetics: { head: null, armor: null, movement: null, emblem: null }, unlockedPowerIds: [],
    appliedTransactionIds: [], bonusSelections: {},
    settings: { musicEnabled: false, effectsEnabled: false, reducedMotion: true },
    updatedAt: new Date().toISOString(),
    ...overrides,
  }));
}

async function renderWorkshop(visit = 1) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push(root);
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[`/workshop/${visit}`]}>
        <GameProvider><Routes><Route path="/workshop/:visitId" element={<WorkshopPage />} /></Routes></GameProvider>
      </MemoryRouter>,
    );
  });
  return host;
}

/** Shop cards show the price/owned state on their own button, not the item label — find the card by its <h2>, then click the button inside it. */
function buyItem(host: HTMLElement, label: string) {
  const heading = Array.from(host.querySelectorAll('.shop-item h2')).find((el) => el.textContent === label);
  if (!heading) throw new Error(`shop item not found for label: ${label}`);
  const button = heading.closest('.shop-item')?.querySelector('button');
  if (!button) throw new Error(`buy button not found for label: ${label}`);
  act(() => { (button as HTMLButtonElement).click(); });
}

function shopButtonFor(host: HTMLElement, label: string): HTMLButtonElement {
  const heading = Array.from(host.querySelectorAll('.shop-item h2')).find((el) => el.textContent === label)!;
  return heading.closest('.shop-item')!.querySelector('button')!;
}

describe('workshop preview reflects an equipped cosmetic immediately (the original reported bug)', () => {
  beforeEach(() => seed());

  it('buying an item shows a badge in the live preview at once, with no reload/navigation needed', async () => {
    const headItem = cosmetics.find((item) => item.slot === 'head')!;
    const host = await renderWorkshop(1);

    // Before purchase: base pose, no cosmetic badge yet.
    expect(host.querySelector('.workshop-preview .cosmetic-badge')).toBeNull();

    buyItem(host, headItem.label);
    await act(async () => undefined);

    const badge = host.querySelector('.workshop-preview .cosmetic-badge--head');
    expect(badge).not.toBeNull();
    expect(badge?.getAttribute('aria-label')).toContain(headItem.label);
  });

  it('a second click on the now-"equipped" (disabled) button does not re-charge the wallet', async () => {
    const headItem = cosmetics.find((item) => item.slot === 'head')!;
    const host = await renderWorkshop(1);
    buyItem(host, headItem.label);
    await act(async () => undefined);
    const walletAfterFirst = host.querySelector('.wallet-large strong')?.textContent;

    const equippedButton = shopButtonFor(host, headItem.label);
    expect(equippedButton.hasAttribute('disabled')).toBe(true); // native disabled button: a second click cannot fire at all
    expect(host.querySelector('.wallet-large strong')?.textContent).toBe(walletAfterFirst);
  });

  it('re-selecting a different already-owned item in the slot switches the preview badge for free', async () => {
    const [itemA, itemB] = cosmetics.filter((item) => item.slot === 'head');
    const host = await renderWorkshop(1);
    buyItem(host, itemA.label);
    await act(async () => undefined);
    buyItem(host, itemB.label); // buys+equips B — different item, same visit/slot
    await act(async () => undefined);
    const walletAfterBothPurchases = host.querySelector('.wallet-large strong')?.textContent;

    buyItem(host, itemA.label); // switch back to the already-owned A
    await act(async () => undefined);
    expect(host.querySelector('.wallet-large strong')?.textContent).toBe(walletAfterBothPurchases); // no charge
    const badge = host.querySelector('.workshop-preview .cosmetic-badge--head') as HTMLElement;
    expect(badge.style.getPropertyValue('--cosmetic-color')).toBe(itemA.swatch);
  });
});
