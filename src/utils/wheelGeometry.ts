// Single source of truth for the bonus wheel's geometry. Every visual piece
// — pie-slice paths, label positions, and the needle's resting rotation —
// is derived from the same `segmentCenterAngle` formula, indexed against the
// same `segments` array the caller renders, so they can never drift apart.
//
// Angle convention: -90deg is 12 o'clock; angle increases CLOCKWISE. This
// matches CSS `rotate()` (clockwise-positive) directly, so no extra sign
// flip is ever needed. This is a plain Cartesian/SVG coordinate convention —
// it is entirely independent of the page's `direction: rtl`, which only
// affects normal document/text flow, never an inline SVG's own coordinate
// system. Do not introduce a direction-based sign flip here.

export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  topicId: string;
}

export const sliceAngle = (count: number): number => 360 / count;

export const segmentStartAngle = (index: number, count: number): number => -90 + index * sliceAngle(count);
export const segmentEndAngle = (index: number, count: number): number => -90 + (index + 1) * sliceAngle(count);
export const segmentCenterAngle = (index: number, count: number): number => -90 + (index + 0.5) * sliceAngle(count);

export function pointOnCircle(cx: number, cy: number, radius: number, angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

/** SVG path `d` for one pie wedge. Callers should render a plain `<circle>` instead when `count <= 1` — a single 360deg wedge is a degenerate arc. */
export function wedgePath(index: number, count: number, cx: number, cy: number, radius: number): string {
  if (count <= 1) return '';
  const start = pointOnCircle(cx, cy, radius, segmentStartAngle(index, count));
  const end = pointOnCircle(cx, cy, radius, segmentEndAngle(index, count));
  const largeArc = sliceAngle(count) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export function labelPosition(index: number, count: number, cx: number, cy: number, labelRadius: number): { x: number; y: number } {
  return pointOnCircle(cx, cy, labelRadius, segmentCenterAngle(index, count));
}

/**
 * The needle graphic is drawn pointing at 12 o'clock (angle -90) when
 * unrotated. Rotating it `centerAngle + 90` degrees clockwise makes it point
 * exactly at that segment's center — never at the boundary between two
 * segments. `extraSpins` adds whole 360deg turns purely for the spin
 * flourish; it never changes which segment the needle ends up pointing at.
 */
export function needleRotationForIndex(index: number, count: number, extraSpins = 0): number {
  return segmentCenterAngle(index, count) + 90 + extraSpins * 360;
}

export function buildWheelSegments<T extends { id: string; label: string; color: string }>(topics: readonly T[]): WheelSegment[] {
  return topics.map((topic) => ({ id: topic.id, label: topic.label, color: topic.color, topicId: topic.id }));
}

export function findSegmentIndex(segments: readonly WheelSegment[], segmentId: string | null): number {
  if (segmentId === null) return -1;
  return segments.findIndex((segment) => segment.id === segmentId);
}
