import { useEffect, useRef, useState } from 'react';
import { mainEvent, wedding } from '../config';
import { dayOfMonth } from '../lib/dates';
import { gsap, isFinePointer, prefersReducedMotion, scrollToTarget, ScrollTrigger } from '../lib/motion';

export const SECTIONS = [
  { id: 'top', label: 'Save the date' },
  { id: 'ceremony', label: 'Invitation' },
  { id: 'events', label: 'Ceremonies' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'moments', label: 'Moments' },
];

/** Desktop-only side navigation in the margin beside the invitation sheet. */
export function SectionNav() {
  const [active, setActive] = useState('top');

  useEffect(() => {
    const triggers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      return el
        ? ScrollTrigger.create({
            trigger: el,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => self.isActive && setActive(id),
          })
        : null;
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  return (
    <nav className="side-nav" aria-label="Sections">
      <ol>
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) scrollToTarget(id === 'top' ? 0 : el);
              }}
            >
              <span className="side-dot" aria-hidden="true" />
              <span className="side-label">{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Thin gold reading-progress line at the top of the viewport. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
    });
    return () => st.kill();
  }, []);
  return <div ref={bar} className="progress" aria-hidden="true" />;
}

/** Monogram and date set vertically in the right margin on wide screens. */
export function MarginMark() {
  const date = new Date(mainEvent.start);
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return (
    <div className="margin-mark" aria-hidden="true">
      <span className="margin-mono">
        {wedding.names[0][0]}
        <em>&amp;</em>
        {wedding.names[1][0]}
      </span>
      <span className="margin-line" />
      <span className="margin-date">
        {String(dayOfMonth(mainEvent.start)).padStart(2, '0')} · {month} · {date.getUTCFullYear()}
      </span>
    </div>
  );
}

/** Soft drifting light and gold dust behind the sheet (visible in the margins). */
export function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="glow g1" />
      <span className="glow g2" />
      {Array.from({ length: 16 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 53 + 7) % 100}%`,
            animationDelay: `${-(i * 2.3)}s`,
            animationDuration: `${16 + ((i * 7) % 12)}s`,
          }}
        />
      ))}
    </div>
  );
}

/** A gold ring trailing the pointer on mouse devices; the native cursor is kept. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion());

  useEffect(() => {
    if (!enabled) return;
    const el = ring.current!;
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      el.classList.add('on');
      x(e.clientX);
      y(e.clientY);
      const hot = (e.target as Element | null)?.closest?.('a, button, [role="radio"], input, select, textarea, .cover');
      el.classList.toggle('hot', !!hot);
    };
    const leave = () => el.classList.remove('on');
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled]);

  return enabled ? <div ref={ring} className="cursor" aria-hidden="true" /> : null;
}
