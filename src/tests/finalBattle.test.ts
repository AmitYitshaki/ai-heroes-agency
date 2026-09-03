import { describe, expect, it } from 'vitest';
import { LocalFinalBattleClassifier, runLocalGate, validateClassifierOutcome } from '../services/finalBattle';
import { createInitialProgress } from '../services/progress';

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
});
