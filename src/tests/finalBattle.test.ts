import { describe, expect, it } from 'vitest';
import { classifyWithSafeFallback, LocalFinalBattleClassifier, runLocalGate, validateClassifierOutcome, type FinalBattleClassifier } from '../services/finalBattle';
import { createInitialProgress } from '../services/progress';
import { calculateScore, computeFinalBattleProvenance } from '../engine/scoring';

const classifier = new LocalFinalBattleClassifier();

describe('final battle local safety and classifier', () => {
  it('accepts a complete in-scope Hebrew prompt and classifies it deterministically', async () => {
    const text = 'שחזר את לוח התכנית לפי המדריך בדיוק חמישה שלבים כרשימה ממוספרת וודא שכל חמשת השלבים מופיעים בסדר הנכון';
    const gate = runLocalGate(text);
    expect(gate.ok).toBe(true);
    if (gate.ok) expect(await classifier.classify(gate.normalizedText)).toBe('full_success');
  });

  it('blocks personal data, links, bidi controls, foreign characters and unknown mission words', () => {
    expect(runLocalGate('שחזר את הלוח עם שם וכתובת').ok).toBe(false);
    expect(runLocalGate('שחזר את הלוח https://example.com').ok).toBe(false);
    expect(runLocalGate('שחזר את הלוח hello').ok).toBe(false);
    expect(runLocalGate('שחזר את הלוח עם אננס').ok).toBe(false);
  });

  it('returns only closed outcome keys for malformed adapter output', () => {
    expect(validateClassifierOutcome('full_success')).toBe('full_success');
    expect(validateClassifierOutcome('made_up_result')).toBe('unclear_goal_or_context');
    expect(validateClassifierOutcome({ prompt: 'secret' })).toBe('unclear_goal_or_context');
  });

  it('keeps free prompt text outside persisted campaign state', () => {
    const serialized = JSON.stringify(createInitialProgress());
    expect(serialized).not.toContain('prompt');
    expect(serialized).not.toContain('draft');
    expect(serialized).not.toContain('normalizedText');
  });

  it('classifies each of the seven closed outcome families deterministically', async () => {
    expect(await classifier.classify('שחזר את הלוח עם בלונים ומדריך')).toBe('unverified_information');
    expect(await classifier.classify('סדר את הלוח בדיוק חמישה שלבים כרשימה ממוספרת')).toBe('unclear_goal_or_context');
    expect(await classifier.classify('שחזר את הלוח לפי המדריך כרשימה ממוספרת וודא שכל השלבים מופיעים')).toBe('missing_constraint');
    expect(await classifier.classify('שחזר את הלוח לפי המדריך בדיוק חמישה שלבים וודא שכל השלבים מופיעים')).toBe('missing_format');
    expect(await classifier.classify('שחזר את הלוח לפי המדריך בדיוק חמישה שלבים כרשימה ממוספרת')).toBe('missing_success_criteria');
  });
});

describe('battle 23 granular scoring (battle_23.md §י rubric)', () => {
  it('awards the full 5 stars for a fully independent text solution', () => {
    const provenance = computeFinalBattleProvenance('text', false, false);
    expect(calculateScore(provenance)).toBe(10); // 5 stars
  });

  it('awards 4.5 stars when a quick-fix was used but the child iterated independently afterwards', () => {
    const provenance = computeFinalBattleProvenance('text', true, false);
    expect(calculateScore(provenance)).toBe(9); // 4.5 stars
  });

  it('awards 4 stars when the quick-fix fragment was the last action before success', () => {
    const provenance = computeFinalBattleProvenance('text', true, true);
    expect(calculateScore(provenance)).toBe(8); // 4 stars
  });

  it('awards 3 stars for a solution reached entirely through the half-open builder', () => {
    const provenance = computeFinalBattleProvenance('builder', false, false);
    expect(calculateScore(provenance)).toBe(6); // 3 stars
    // Any quick-fix flags from an earlier text attempt are irrelevant once the child falls back to the builder.
    expect(calculateScore(computeFinalBattleProvenance('builder', true, true))).toBe(6);
  });

  it('falls back to a safe closed key when the classifier adapter misbehaves', () => {
    expect(validateClassifierOutcome(undefined)).toBe('unclear_goal_or_context');
    expect(validateClassifierOutcome('')).toBe('unclear_goal_or_context');
  });

  it('never lets a remote classifier claim the PII-safety verdict — that key is local-gate-only', () => {
    expect(validateClassifierOutcome('unsafe_personal_data')).toBe('unclear_goal_or_context');
  });

  it('validates adapter output and converts a rejected adapter call into the offline-builder sentinel', async () => {
    const rejects: FinalBattleClassifier = { classify: async () => { throw new Error('network unavailable'); } };
    const invalid = { classify: async () => 'unexpected_external_text' } as unknown as FinalBattleClassifier;
    expect(await classifyWithSafeFallback(rejects, 'טקסט שכבר עבר שער מקומי')).toBeNull();
    expect(await classifyWithSafeFallback(invalid, 'טקסט שכבר עבר שער מקומי')).toBe('unclear_goal_or_context');
  });
});
