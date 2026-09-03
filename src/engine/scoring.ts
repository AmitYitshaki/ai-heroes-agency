import type { ComponentProvenance } from '../schemas/game';

const halfUnits: Record<ComponentProvenance, 0 | 1 | 2> = { user_independent: 2, user_choice_two: 1, system_completed: 0 };

export function calculateScore(provenance: ComponentProvenance[]): number {
  const values = [...provenance, 'system_completed', 'system_completed', 'system_completed', 'system_completed'].slice(0, 4) as ComponentProvenance[];
  return Math.min(10, 2 + values.reduce((sum, value) => sum + halfUnits[value], 0));
}

export const displayStars = (value: number) => Number.isInteger(value / 2) ? String(value / 2) : (value / 2).toFixed(1);

export function evaluateSelections(selected: string[], correct: string[], ordered = false): boolean {
  if (selected.length !== correct.length) return false;
  return ordered ? selected.every((id, index) => id === correct[index]) : correct.every((id) => selected.includes(id));
}

// Battle 23 provenance per battle_23.md §י: criteria 1 (task fit) and 4
// (responsibility/safety) follow how the final safe prompt was produced;
// criteria 2 (component use) and 3 (iteration) can differ within a text
// solution depending on whether a quick-fix fragment was tapped rather than
// typed by the child.
export function computeFinalBattleProvenance(source: 'text' | 'builder', everUsedQuickFix: boolean, lastActionWasQuickFix: boolean): ComponentProvenance[] {
  if (source === 'builder') return ['user_choice_two', 'user_choice_two', 'user_choice_two', 'user_choice_two'];
  return [
    'user_independent',
    everUsedQuickFix ? 'user_choice_two' : 'user_independent',
    lastActionWasQuickFix ? 'user_choice_two' : 'user_independent',
    'user_independent',
  ];
}
