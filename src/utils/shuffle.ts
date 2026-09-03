export type RandomSource = () => number;

/**
 * Fisher–Yates (Durstenfeld) shuffle — every permutation is equally likely,
 * unlike `array.sort(() => Math.random() - 0.5)`, which is both biased and
 * not a valid comparator. Pure: returns a new array, never mutates `items`.
 * `random` defaults to `Math.random` but accepts injection (see
 * `createSeededRandom`) so callers can get deterministic, reproducible
 * output in tests.
 */
export function shuffle<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * mulberry32 — a small, fast, deterministic PRNG. Not cryptographic; only
 * used so tests can seed `shuffle()` and assert reproducible, unbiased
 * output without depending on the real `Math.random`.
 */
export function createSeededRandom(seed: number): RandomSource {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
