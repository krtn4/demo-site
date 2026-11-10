import type { CSSProperties } from 'react';

const COLORS = ['rgba(255,255,255,.75)', '#d6a85f', '#c4384d'];

const HEARTS = Array.from(
  { length: 18 },
  (_, i) =>
    ({
      '--x': `${(i * 37 + 8) % 96}%`,
      '--s': `${10 + ((i * 7) % 14)}px`,
      '--d': `${10 + ((i * 5) % 9)}s`,
      '--delay': `${-(i * 1.7)}s`,
      '--dx': `${(i % 2 ? 1 : -1) * (14 + i * 3)}px`,
      '--c': COLORS[i % COLORS.length],
    }) as CSSProperties,
);

/** Hearts drifting up the cover, as on the original invitation. */
export function Hearts({ className = '' }: { className?: string }) {
  return (
    <div className={`hearts ${className}`} aria-hidden="true">
      {HEARTS.map((style, i) => (
        <i key={i} style={style} />
      ))}
    </div>
  );
}
