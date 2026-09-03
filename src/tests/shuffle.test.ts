import { describe, expect, it } from 'vitest';
import { createSeededRandom, shuffle } from '../utils/shuffle';

describe('shuffle()', () => {
  it('returns a permutation of the input — same elements, same length, no duplicates or drops', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    const result = shuffle(input, createSeededRandom(1));
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it('never mutates the input array', () => {
    const input = ['a', 'b', 'c'];
    const copy = [...input];
    shuffle(input, createSeededRandom(7));
    expect(input).toEqual(copy);
  });

  it('is deterministic for a given seed and varies across seeds (DI-able RNG)', () => {
    const a = shuffle(['a', 'b', 'c', 'd', 'e', 'f'], createSeededRandom(42));
    const b = shuffle(['a', 'b', 'c', 'd', 'e', 'f'], createSeededRandom(42));
    expect(a).toEqual(b); // same seed -> same output, reproducible for tests

    const outputsBySeed = new Set(
      Array.from({ length: 20 }, (_, seed) => shuffle(['a', 'b', 'c', 'd', 'e', 'f'], createSeededRandom(seed)).join('')),
    );
    expect(outputsBySeed.size).toBeGreaterThan(1); // different seeds actually produce different orders
  });

  it('distributes every position roughly evenly over a large sample — not the always-last bias .sort(() => Math.random() - 0.5) produces', () => {
    const items = ['x', 'y', 'z']; // 'z' starts last, mirroring the reported "correct choice is authored last" pattern
    const trials = 6000;
    const positionCounts = [0, 0, 0];
    for (let seed = 0; seed < trials; seed++) {
      const result = shuffle(items, createSeededRandom(seed));
      positionCounts[result.indexOf('z')]++;
    }
    // Perfectly uniform would be 2000 per position; allow generous tolerance
    // (well outside statistical noise) while still catching a real bias like
    // "'z' lands last >80% of the time".
    positionCounts.forEach((count) => {
      expect(count).toBeGreaterThan(trials / 3 - 400);
      expect(count).toBeLessThan(trials / 3 + 400);
    });
  });

  it('handles empty and single-element arrays without error', () => {
    expect(shuffle([], createSeededRandom(1))).toEqual([]);
    expect(shuffle(['only'], createSeededRandom(1))).toEqual(['only']);
  });
});

describe('createSeededRandom()', () => {
  it('produces numbers in [0, 1) and is reproducible per seed', () => {
    const rngA = createSeededRandom(99);
    const rngB = createSeededRandom(99);
    const sequenceA = Array.from({ length: 10 }, () => rngA());
    const sequenceB = Array.from({ length: 10 }, () => rngB());
    expect(sequenceA).toEqual(sequenceB);
    sequenceA.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });
  });
});
