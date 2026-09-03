import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { CampaignProgressV1, CharacterId, CosmeticItem, PlayerSettings } from '../schemas/game';
import { commitBattleBest, createInitialProgress, grantBonus, loadProgress, purchaseCosmetic, saveProgress, selectCharacter } from '../services/progress';
import { audio } from '../services/audio';

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

  useEffect(() => {
    const unlock = () => { audio.unlock(); setAudioUnlocked(true); window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); audio.stopMusic(); };
  }, []);

  useEffect(() => {
    if (audioUnlocked) audio.startMusic(progress.settings.musicEnabled, location.pathname.includes('/battle/'));
  }, [audioUnlocked, progress.settings.musicEnabled, location.pathname]);

  const persist = useCallback((updater: (previous: CampaignProgressV1) => CampaignProgressV1) => {
    setProgress((previous) => {
      const next = updater(previous);
      try { return saveProgress(next); } catch { return next; }
    });
  }, []);

  const value = useMemo<GameContextValue>(() => ({
    progress,
    hasJourney: progress.characterId !== null || Object.keys(progress.battleBestHalfUnits).length > 0,
    setCharacter: (id) => persist((previous) => selectCharacter(previous, id)),
    completeBattle: (id, order, score, power) => {
      const previousBest = progress.battleBestHalfUnits[id] ?? 0;
      const next = commitBattleBest(progress, id, order, score, power);
      setProgress(saveProgress(next));
      return { delta: Math.max(0, next.battleBestHalfUnits[id] - previousBest), best: next.battleBestHalfUnits[id] };
    },
    completeBonus: (id) => persist((previous) => grantBonus(previous, id)),
    buyCosmetic: (item) => {
      if (!progress.purchasedCosmeticIds.includes(item.itemId) && progress.walletHalfUnits < item.priceHalfUnits) return false;
      setProgress(saveProgress(purchaseCosmetic(progress, item)));
      return true;
    },
    updateSettings: (settings) => persist((previous) => ({ ...previous, settings: { ...previous.settings, ...settings } })),
    newJourney: () => setProgress(saveProgress(createInitialProgress(progress.settings))),
    playCue: (cue) => audio.play(cue, progress.settings.effectsEnabled),
  }), [progress, persist]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame must be used inside GameProvider');
  return value;
}
