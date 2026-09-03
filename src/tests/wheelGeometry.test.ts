import { describe, expect, it } from 'vitest';
import {
  buildWheelSegments, findSegmentIndex, needleRotationForIndex,
  segmentCenterAngle, segmentEndAngle, segmentStartAngle, sliceAngle,
} from '../utils/wheelGeometry';
import { bonusTopics, validateBonusRegistry } from '../content/bonus';

describe('wheel angle math', () => {
  it('divides the circle into equal slices that sum to 360deg, for any segment count', () => {
    [1, 2, 3, 4, 6].forEach((count) => {
      const total = Array.from({ length: count }, (_, index) => segmentEndAngle(index, count) - segmentStartAngle(index, count)).reduce((a, b) => a + b, 0);
      expect(total).toBeCloseTo(360, 6);
      expect(sliceAngle(count)).toBeCloseTo(360 / count, 6);
    });
  });

  it('places every segment center exactly halfway between its own start and end — never on a boundary with a neighbor', () => {
    [2, 3, 4, 5].forEach((count) => {
      for (let index = 0; index < count; index++) {
        const start = segmentStartAngle(index, count);
        const end = segmentEndAngle(index, count);
        const center = segmentCenterAngle(index, count);
        expect(center - start).toBeCloseTo((end - start) / 2, 6);
        expect(end - center).toBeCloseTo((end - start) / 2, 6);
        // Strictly inside the slice, not equal to either boundary.
        expect(center).toBeGreaterThan(start);
        expect(center).toBeLessThan(end);
      }
    });
  });

  it('has consecutive segments share a boundary with no gap or overlap', () => {
    const count = 5;
    for (let index = 0; index < count - 1; index++) {
      expect(segmentEndAngle(index, count)).toBeCloseTo(segmentStartAngle(index + 1, count), 6);
    }
  });
});

describe('needle rotation', () => {
  it('always points at the selected segment center (mod 360), never a boundary, for every index and segment count', () => {
    [2, 3, 4, 6].forEach((count) => {
      for (let index = 0; index < count; index++) {
        const rotation = needleRotationForIndex(index, count, 0);
        // Needle is drawn pointing at angle -90 when unrotated; rotating it
        // `rotation` degrees clockwise must land it exactly on this
        // segment's center angle (mod 360).
        const pointedAt = (((-90 + rotation) % 360) + 360) % 360;
        const expected = ((segmentCenterAngle(index, count) % 360) + 360) % 360;
        expect(pointedAt).toBeCloseTo(expected, 6);
      }
    });
  });

  it('extra spins add whole 360deg turns without changing which segment the needle points at', () => {
    const base = needleRotationForIndex(1, 4, 0);
    const withSpins = needleRotationForIndex(1, 4, 4);
    expect(withSpins - base).toBe(4 * 360);
    expect(((withSpins % 360) + 360) % 360).toBeCloseTo(((base % 360) + 360) % 360, 6);
  });
});

describe('label -> topic mapping (buildWheelSegments / findSegmentIndex)', () => {
  it('produces one segment per topic, in the same order, carrying id/label/color/topicId from a single source of truth', () => {
    const segments = buildWheelSegments(bonusTopics);
    expect(segments).toHaveLength(bonusTopics.length);
    segments.forEach((segment, index) => {
      const topic = bonusTopics[index];
      expect(segment.id).toBe(topic.id);
      expect(segment.label).toBe(topic.label);
      expect(segment.color).toBe(topic.color);
      expect(segment.topicId).toBe(topic.id);
    });
  });

  it('resolves the correct segment index for a given selected id, and -1 for null/unknown', () => {
    const segments = buildWheelSegments(bonusTopics);
    bonusTopics.forEach((topic, index) => {
      expect(findSegmentIndex(segments, topic.id)).toBe(index);
    });
    expect(findSegmentIndex(segments, null)).toBe(-1);
    expect(findSegmentIndex(segments, 'not-a-real-topic')).toBe(-1);
  });

  it('works correctly when only a subset of topics is passed in (wheel adapts to a smaller pool)', () => {
    const subset = bonusTopics.slice(0, 2);
    const segments = buildWheelSegments(subset);
    expect(segments).toHaveLength(2);
    expect(findSegmentIndex(segments, subset[1].id)).toBe(1);
    expect(findSegmentIndex(segments, bonusTopics[2]?.id ?? 'privacy')).toBe(-1); // excluded from this subset
  });
});

describe('bonus content registry', () => {
  it('has no duplicate topic or question ids, and every topic has at least one question', () => {
    expect(validateBonusRegistry()).toEqual([]);
  });
});
