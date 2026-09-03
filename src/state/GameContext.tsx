import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { CampaignProgressV1, CharacterId, CosmeticItem, PlayerSettings } from '../schemas/game';
import { commitBattleBest, createInitialProgress, grantBonus, loadProgress, purchaseCosmetic, saveProgress, selectCharacter } from '../services/progress';
import { audio } from '../services/audio';
import { resolveMusicCue } from '../services/musicRouting';

interface GameContextValue {
  progress: CampaignProgressV1;
  hasJourney: boolean;
  setCharacter: (id: CharacterId) => void;
  completeBattle: (id: string, order: number, score: number, power?: string) => { delta: number; best: number };
  completeBonus: (id: string) => void;
  buyCosmetic: (item: CosmeticItem) => boolean;
  updateSettings: (settings: Partial<PlayerSettings>) => void;
  newJourney: () => void;
  playCue: (cue: Parameters<typeof audio.play>[0]) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [progress, setProgress] = useState<CampaignProgressV1>(() => loadProgress());
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  // Mirrors `progress` synchronously so idempotent writers below always read
  // the latest committed state even when called twice back-to-back in the
  // same tick (double-click, double-tap) before React re-renders.
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const unlock = () => { try { audio.unlock(); } catch { /* audio unsupported or blocked; game continues silently */ } setAudioUnlocked(true); window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); audio.stopMusic(); };
  }, []);

  useEffect(() => {
    if (audioUnlocked) audio.startMusic(progress.settings.musicEnabled, resolveMusicCue(location.pathname));
  }, [audioUnlocked, progress.settings.musicEnabled, location.pathname]);

  const persist = useCallback((updater: (previous: CampaignProgressV1) => CampaignProgressV1) => {
    const next = saveProgress(updater(progressRef.current));
    progressRef.current = next;
    setProgress(next);
    return next;
  }, []);

  const value = useMemo<GameContextValue>(() => ({
    progress,
    hasJourney: progress.characterId !== null || Object.keys(progress.battleBestHalfUnits).length > 0,
    setCharacter: (id) => { persist((previous) => selectCharacter(previous, id)); },
    completeBattle: (id, order, score, power) => {
      const previousBest = progressRef.current.battleBestHalfUnits[id] ?? 0;
      const next = persist((previous) => commitBattleBest(previous, id, order, score, power));
      return { delta: Math.max(0, next.battleBestHalfUnits[id] - previousBest), best: next.battleBestHalfUnits[id] };
    },
    completeBonus: (id) => { persist((previous) => grantBonus(previous, id)); },
    buyCosmetic: (item) => {
      if (!progressRef.current.purchasedCosmeticIds.includes(item.itemId) && progressRef.current.walletHalfUnits < item.priceHalfUnits) return false;
      persist((previous) => purchaseCosmetic(previous, item));
      return true;
    },
    updateSettings: (settings) => {
      if (settings.musicEnabled === false) audio.stopMusic(true);
      if (settings.effectsEnabled === false) audio.stopEffects();
      persist((previous) => ({ ...previous, settings: { ...previous.settings, ...settings } }));
    },
    newJourney: () => { persist((previous) => createInitialProgress(previous.settings)); },
    playCue: (cue) => audio.play(cue, progressRef.current.settings.effectsEnabled),
  }), [progress, persist]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame must be used inside GameProvider');
  return value;
}
