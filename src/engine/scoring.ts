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
