import { describe, expect, it } from 'vitest';
import { availableTopicsForSpin, bonusTopics, chooseBonusSelection, validateBonusRegistry } from '../content/bonus';
import { createSeededRandom } from '../utils/shuffle';

describe('availableTopicsForSpin', () => {
  it('removes a used topic from the pool while an alternative remains', () => {
    const usedOne = availableTopicsForSpin(bonusTopics, [bonusTopics[0].id]);
    expect(usedOne.map((topic) => topic.id)).not.toContain(bonusTopics[0].id);
    expect(usedOne).toHaveLength(bonusTopics.length - 1);
  });

  it('falls back to the full topic list once every topic has been used at least once', () => {
    const allUsed = availableTopicsForSpin(bonusTopics, bonusTopics.map((topic) => topic.id));
    expect(allUsed).toHaveLength(bonusTopics.length);
  });
});

describe('chooseBonusSelection — the three journey bonus visits never repeat a topic or question', () => {
  it('draws three distinct topics (and therefore three distinct questions) across three sequential visits', () => {
    const usedTopicIds: string[] = [];
    const usedQuestionIds: string[] = [];
    const drawn: string[] = [];

    for (let visit = 0; visit < 3; visit++) {
      const selection = chooseBonusSelection(bonusTopics, usedTopicIds, usedQuestionIds, createSeededRandom(visit + 1));
      expect(usedTopicIds).not.toContain(selection.topicId); // never repeats a topic while one remains available
      expect(usedQuestionIds).not.toContain(selection.questionId); // never repeats a question while one remains
      drawn.push(selection.questionId);
      usedTopicIds.push(selection.topicId);
      usedQuestionIds.push(selection.questionId);
    }

    expect(new Set(drawn).size).toBe(3);
    expect(new Set(usedTopicIds).size).toBe(3); // all three topics used, none twice
  });

  it('is reproducible for a given seed (deterministic, DI-able RNG)', () => {
    const a = chooseBonusSelection(bonusTopics, [], [], createSeededRandom(5));
    const b = chooseBonusSelection(bonusTopics, [], [], createSeededRandom(5));
    expect(a).toEqual(b);
  });

  it('a 4th draw (more visits than topics) still returns a valid, never-crashing selection instead of throwing', () => {
    const usedTopicIds = bonusTopics.map((topic) => topic.id);
    const usedQuestionIds = bonusTopics.flatMap((topic) => topic.questions.map((question) => question.id));
    const selection = chooseBonusSelection(bonusTopics, usedTopicIds, usedQuestionIds, createSeededRandom(99));
    expect(bonusTopics.some((topic) => topic.id === selection.topicId)).toBe(true);
    expect(bonusTopics.flatMap((topic) => topic.questions).some((question) => question.id === selection.questionId)).toBe(true);
  });

  it('never lands on a topic that availableTopicsForSpin excluded — the wheel and the picker always agree', () => {
    const usedTopicIds = [bonusTopics[0].id];
    const pool = availableTopicsForSpin(bonusTopics, usedTopicIds);
    for (let seed = 0; seed < 200; seed++) {
      const selection = chooseBonusSelection(bonusTopics, usedTopicIds, [], createSeededRandom(seed));
      expect(pool.map((topic) => topic.id)).toContain(selection.topicId);
    }
  });
});

describe('bonus content registry', () => {
  it('is internally consistent (no duplicate ids, every topic has a question)', () => {
    expect(validateBonusRegistry()).toEqual([]);
  });
});
