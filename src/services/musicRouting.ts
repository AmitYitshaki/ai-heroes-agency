import { battleById } from '../content/battles';
import type { RegionId } from '../schemas/game';
import type { MusicCue } from './audio';

// Pure route -> music cue mapping, kept separate from AudioManager so it can
// be unit tested without touching Howler/AudioContext at all. Matches the
// 7 delivered tracks in docs/AUDIO_TECH_DECISION.md's context table.
const regionCue: Record<RegionId, MusicCue> = {
  recruitment: 'headquarters',
  fog_district: 'zone_fog',
  no_limits_factory: 'zone_factory',
  command_maze: 'zone_maze',
  certainty_tower: 'zone_tower_finale',
  finale: 'zone_tower_finale',
};

export function resolveMusicCue(pathname: string): MusicCue {
  if (pathname.startsWith('/battle/')) {
    const battleId = pathname.split('/')[2];
    const battle = battleById[battleId];
    return battle ? regionCue[battle.regionId] : 'headquarters';
  }
  if (pathname === '/' || pathname === '/recruit') return 'onboarding';
  if (pathname === '/finale') return 'certification';
  // map, workshop, bonus, settings, and any other in-app screen share the hub loop.
  return 'headquarters';
}
