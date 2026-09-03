import { useEffect, useState } from 'react';
import { findSegmentIndex, labelPosition, needleRotationForIndex, wedgePath, type WheelSegment } from '../utils/wheelGeometry';

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 8;
const LABEL_RADIUS = RADIUS * 0.62;
const EXTRA_SPINS = 4;

export interface BonusWheelProps {
  segments: WheelSegment[];
  /** id of the segment the needle should rest on; null while idle (not yet spun). */
  selectedSegmentId: string | null;
  reducedMotion: boolean;
}

export function BonusWheel({ segments, selectedSegmentId, reducedMotion }: BonusWheelProps) {
  const count = segments.length;
  const selectedIndex = findSegmentIndex(segments, selectedSegmentId);
  const resolveRotation = () => (selectedIndex >= 0 ? needleRotationForIndex(selectedIndex, count, reducedMotion ? 0 : EXTRA_SPINS) : 0);
  const [rotation, setRotation] = useState(resolveRotation);

  useEffect(() => {
    // Recomputing on every selection change (not just on the initial mount)
    // is what makes the multi-spin animation play the moment a spin lands on
    // a real segment, while a page that mounts with an already-known
    // selection (restored after a refresh) renders straight at rest — the
    // very first render already used that same rotation, so there is no
    // prior value for the browser to transition *from*.
    setRotation(resolveRotation());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSegmentId, count, reducedMotion]);

  return (
    <div className="bonus-wheel-wrap" aria-hidden="true">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="bonus-wheel-svg">
        {count <= 1
          ? <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={segments[0]?.color ?? '#fff'} stroke="var(--ink)" strokeWidth={3} />
          : segments.map((segment, index) => (
            <path key={segment.id} d={wedgePath(index, count, CENTER, CENTER, RADIUS)} fill={segment.color} stroke="var(--ink)" strokeWidth={2} />
          ))}
        {segments.map((segment, index) => {
          const pos = labelPosition(index, count, CENTER, CENTER, LABEL_RADIUS);
          return <text key={segment.id} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" className="bonus-wheel-label">{segment.label}</text>;
        })}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${CENTER}px ${CENTER}px`, transition: reducedMotion ? 'none' : 'transform 1.8s cubic-bezier(.15,.7,.25,1)' }}>
          <polygon points={`${CENTER},${CENTER - RADIUS + 4} ${CENTER - 11},${CENTER - 16} ${CENTER + 11},${CENTER - 16}`} fill="var(--gold)" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
        </g>
        <circle cx={CENTER} cy={CENTER} r={15} fill="#fff" stroke="var(--ink)" strokeWidth={3} />
      </svg>
    </div>
  );
}
