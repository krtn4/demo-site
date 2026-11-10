import { useLayoutEffect, useRef, useState } from 'react';
import { mainEvent, wedding } from '../config';
import { longDate } from '../lib/dates';
import { EASE_SILK, gsap, isFinePointer, prefersReducedMotion } from '../lib/motion';
import { Hearts } from './Hearts';
import { Bouquet, HeartIcon, SplitChars } from './Ornaments';

const fontsReady = () =>
  Promise.race([
    'fonts' in document ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, 1400)),
  ]);

type Props = {
  /** Called synchronously inside the tap, so audio may start. */
  onStart: () => void;
  /** Called as the exit begins, so the invitation can mount underneath the dissolving cover. */
  onOpen: () => void;
  /** Called once the exit transition has finished. */
  onDone: () => void;
};

export function Cover({ onStart, onOpen, onDone }: Props) {
  const root = useRef<HTMLElement>(null);
  const exitTl = useRef<gsap.core.Timeline | null>(null);
  const opened = useRef(false);
  const [leaving, setLeaving] = useState(false);

  useLayoutEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap.set(q('.cover-card'), { autoAlpha: 0, y: 46, scale: 0.95, rotateX: 10 });
      gsap.set(q('.corner'), { autoAlpha: 0, scale: 0.4, rotate: -25 });
      gsap.set(q('.badge'), { scale: 0, autoAlpha: 0 });
      gsap.set(q('.cover-names .char > span'), { yPercent: 115 });
      gsap.set(q('.amp, .cover-date, .open-btn'), { autoAlpha: 0 });
      gsap.set(q('.divider i'), { scaleX: 0 });
      gsap.set(q('.divider span'), { autoAlpha: 0, scale: 0.4 });

      const intro = gsap.timeline({ paused: true, defaults: { ease: EASE_SILK } });
      intro
        .to(q('.cover-card'), { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 1.6 })
        .to(q('.corner'), { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.6, stagger: 0.15 }, 0.35)
        .to(q('.badge'), { scale: 1, autoAlpha: 1, duration: 1, ease: 'back.out(2)' }, 0.5)
        .to(q('.cover-names .char > span'), { yPercent: 0, duration: 1.2, stagger: 0.04 }, 0.65)
        .to(q('.amp'), { autoAlpha: 1, duration: 1 }, 0.95)
        .to(q('.divider i'), { scaleX: 1, duration: 1.3 }, 1.05)
        .to(q('.divider span'), { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(2)' }, 1.2)
        .fromTo(
          q('.cover-date'),
          { autoAlpha: 0, letterSpacing: '0.32em' },
          { autoAlpha: 1, letterSpacing: '0em', duration: 1.6 },
          1.2,
        )
        .fromTo(q('.open-btn'), { y: 16 }, { autoAlpha: 1, y: 0, duration: 1 }, 1.45);

      fontsReady().then(() => intro.play());

      exitTl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.inOut' }, onComplete: onDone })
        .to(q('.open-btn'), { scale: 0.93, duration: 0.12, ease: 'power2.out' })
        .to(q('.open-btn'), { scale: 1, duration: 0.3, ease: 'back.out(3)' })
        .to(q('.corner.tl'), { x: -40, y: -40, scale: 1.5, autoAlpha: 0, duration: 0.9 }, 0.1)
        .to(q('.corner.br'), { x: -40, y: -40, scale: 1.5, autoAlpha: 0, duration: 0.9 }, 0.1)
        .to(q('.cover-card'), { scale: 0.92, y: -12, autoAlpha: 0, duration: 0.8 }, 0.2)
        .to(q('.cover-glow'), { autoAlpha: 1, scale: 1.4, duration: 0.6, ease: 'power2.out' }, 0.25)
        .to(q('.hearts'), { y: -120, autoAlpha: 0, duration: 0.9 }, 0.2)
        .to(el, { autoAlpha: 0, duration: 0.55 }, 0.65);

      if (isFinePointer()) {
        const tilt = q('.cover-tilt')[0];
        // quickTo needs GSAP's canonical names, not the rotateX/rotateY aliases.
        const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3' });
        const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3' });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          rx(ny * -7);
          ry(nx * 9);
          el.style.setProperty('--sheen-x', `${50 + nx * 80}%`);
          el.style.setProperty('--sheen-y', `${50 + ny * 80}%`);
        };
        el.addEventListener('pointermove', move);
        return () => el.removeEventListener('pointermove', move);
      }
    }, el);
    return () => ctx.revert();
  }, [onDone]);

  const open = () => {
    if (opened.current) return;
    opened.current = true;
    onStart();
    onOpen();
    if (exitTl.current) exitTl.current.play();
    else {
      setLeaving(true);
      setTimeout(onDone, 500);
    }
  };

  return (
    <section ref={root} className={`cover${leaving ? ' leaving' : ''}`} aria-label="Invitation cover" onClick={open}>
      <Hearts />
      <div className="cover-glow" aria-hidden="true" />
      <div className="cover-stage">
        <div className="cover-tilt">
          <div className="cover-card">
            <div className="cover-sheen" aria-hidden="true" />
            <Bouquet className="corner tl" />
            <Bouquet className="corner br" />
            <div className="badge">
              <HeartIcon />
            </div>
            <h1 className="cover-names">
              <SplitChars text={wedding.names[0]} />
              <span className="amp">&amp;</span>
              <SplitChars text={wedding.names[1]} />
            </h1>
            <div className="divider" aria-hidden="true">
              <i />
              <span>❦</span>
              <i />
            </div>
            <p className="cover-date">{longDate(mainEvent.start)}</p>
            <button
              type="button"
              className="open-btn"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
