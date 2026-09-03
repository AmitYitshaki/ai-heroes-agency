import { describe, expect, it } from 'vitest';
import { calculateScore, evaluateSelections } from '../engine/scoring';

describe('deterministic evaluator and scoring', () => {
  it('scores four provenance components between one and five stars', () => {
    expect(calculateScore(['user_independent', 'user_independent', 'user_independent', 'user_independent'])).toBe(10);
    expect(calculateScore(['user_choice_two', 'user_choice_two', 'user_choice_two', 'user_choice_two'])).toBe(6);
    expect(calculateScore(['system_completed', 'system_completed', 'system_completed', 'system_completed'])).toBe(2);
    expect(calculateScore(['user_independent', 'user_choice_two', 'system_completed', 'user_independent'])).toBe(7);
  });

  it('supports set-based and order-sensitive answers', () => {
    expect(evaluateSelections(['b', 'a'], ['a', 'b'])).toBe(true);
    expect(evaluateSelections(['b', 'a'], ['a', 'b'], true)).toBe(false);
    expect(evaluateSelections(['a', 'b'], ['a', 'b'], true)).toBe(true);
  });
});
