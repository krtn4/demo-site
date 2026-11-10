import { useId, type CSSProperties } from 'react';

export const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

export function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={HEART_PATH} fill="currentColor" />
    </svg>
  );
}

type BloomProps = { x: number; y: number; r: number; outer: string; inner: string; edge: string };

function Bloom({ x, y, r, outer, inner, edge }: BloomProps) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <g transform={`translate(${x} ${y})`} stroke={edge} strokeOpacity=".45" strokeWidth=".7" className="bloom">
      {petals.map((a) => (
        <ellipse key={a} cy={-r * 0.55} rx={r * 0.52} ry={r * 0.62} fill={outer} transform={`rotate(${a})`} />
      ))}
      {petals.map((a) => (
        <ellipse key={`i${a}`} cy={-r * 0.32} rx={r * 0.36} ry={r * 0.44} fill={inner} transform={`rotate(${a + 36})`} />
      ))}
      <circle r={r * 0.24} fill={edge} fillOpacity=".55" stroke="none" />
      <path d={`M${-r * 0.18} 0a${r * 0.18} ${r * 0.18} 0 1 1 ${r * 0.36} 0`} fill="none" />
    </g>
  );
}

const LEAF = 'M0 0C8-11 22-12 32 0C22 12 8 11 0 0Z';
const BERRIES = [[48, 22], [40, 34], [55, 36], [38, 50], [52, 54], [44, 68], [58, 70]];
const LEAVES = [[58, 118, -35], [48, 130, 200], [92, 70, -60], [30, 92, 215], [86, 150, 20]];

/** The burgundy-and-ivory bouquet used on the cover corners and the envelope. */
export function Bouquet({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 150 200" aria-hidden="true">
      <path d="M62 196C58 140 40 90 48 18" fill="none" stroke="#6b3a34" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M50 70C42 64 36 56 38 48M52 54C58 50 60 42 56 36"
        fill="none"
        stroke="#6b3a34"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {BERRIES.map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3.4" fill="#6e1424" className="berry" />
      ))}
      {LEAVES.map(([x, y, a]) => (
        <path
          key={`${x}${y}`}
          d={LEAF}
          transform={`translate(${x} ${y}) rotate(${a})`}
          fill="#8b9a6c"
          stroke="#6d7c52"
          strokeWidth=".8"
          className="leaf"
        />
      ))}
      <Bloom x={66} y={120} r={30} outer="#7b1427" inner="#5a0d1c" edge="#3b0712" />
      <Bloom x={104} y={96} r={21} outer="#efe3cc" inner="#e0cfae" edge="#a8916a" />
      <Bloom x={64} y={74} r={22} outer="#8a1a2e" inner="#651020" edge="#3b0712" />
      <Bloom x={100} y={150} r={16} outer="#f6eddc" inner="#e8d9ba" edge="#a8916a" />
    </svg>
  );
}

const SEAL_EDGE = `M${Array.from({ length: 180 }, (_, i) => {
  const t = (i / 180) * Math.PI * 2;
  const r = 43 + 3.4 * Math.sin(t * 9);
  return `${(50 + Math.cos(t) * r).toFixed(2)} ${(50 + Math.sin(t) * r).toFixed(2)}`;
}).join('L')}Z`;

/** Gold wax seal with an embossed heart. */
export function Seal({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}g`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#f0d58b" />
          <stop offset=".55" stopColor="#c79a43" />
          <stop offset="1" stopColor="#8d6620" />
        </radialGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff8dc" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <path d={SEAL_EDGE} />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#000" opacity=".25" transform="translate(1.5 3)" />
      <path d={SEAL_EDGE} fill={`url(#${id}g)`} />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#8d6620" strokeOpacity=".6" strokeWidth="1.4" />
      <g transform="translate(29 28.7) scale(1.75)">
        <path d={HEART_PATH} fill="none" stroke="#7a5518" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <g clipPath={`url(#${id}c)`}>
        <rect className="seal-glint" x="-60" y="-10" width="40" height="120" fill={`url(#${id}s)`} transform="rotate(20 50 50)" />
      </g>
    </svg>
  );
}

/** Splits text into masked characters for staggered reveals; screen readers get the plain string. */
export function SplitChars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="char" aria-hidden="true" style={{ '--i': i } as CSSProperties}>
          <span>{ch === ' ' ? ' ' : ch}</span>
        </span>
      ))}
    </span>
  );
}

/** Small gold flourish used between sections. */
export function Flourish({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 20" aria-hidden="true" fill="none" stroke="currentColor">
      <path d="M2 10h58" strokeWidth=".8" />
      <path d="M100 10h58" strokeWidth=".8" />
      <path d="M66 10c4-6 10-6 14 0 4 6 10 6 14 0" strokeWidth="1" />
      <circle cx="80" cy="10" r="2" fill="currentColor" stroke="none" />
      <circle cx="62" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="98" cy="10" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
