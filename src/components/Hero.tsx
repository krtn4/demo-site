import { useEffect, useLayoutEffect, useRef } from 'react';
import { coupleNames, mainEvent, wedding } from '../config';
import { longDate, weekday } from '../lib/dates';
import { EASE_SILK, gsap, prefersReducedMotion } from '../lib/motion';
import { Bouquet, Seal, SplitChars } from './Ornaments';

const photoReady = (img: HTMLImageElement) =>
  Promise.race([
    img.complete && img.naturalWidth > 0
      ? Promise.resolve()
      : new Promise<void>((r) => {
          img.addEventListener('load', () => r(), { once: true });
          img.addEventListener('error', () => r(), { once: true });
        }),
    new Promise((r) => setTimeout(r, 2500)),
  ]).then(() => img.decode?.().catch(() => {}));

function Envelope() {
  return (
    <div className="env">
      <svg className="env-layer env-back" viewBox="0 0 320 320" aria-hidden="true">
        <rect x="20" y="130" width="280" height="172" fill="#3f0912" />
      </svg>
      <svg className="env-layer env-flap-back" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <linearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a0b16" />
            <stop offset="1" stopColor="#6a1424" />
          </linearGradient>
        </defs>
        <path d="M20 132 160 36 300 132Z" fill="url(#envFlap)" />
      </svg>
      <div className="env-photo-clip">
        <img
          className="env-photo"
          src={wedding.couplePhoto}
          srcSet={wedding.couplePhotoSrcSet}
          sizes="(max-width: 400px) 60vw, 204px"
          alt={`${wedding.names[0]} and ${wedding.names[1]}`}
          width={760}
          height={890}
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <svg className="env-layer env-front" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <linearGradient id="envSide" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6a1424" />
            <stop offset="1" stopColor="#4d0c18" />
          </linearGradient>
          <linearGradient id="envBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a1020" />
            <stop offset="1" stopColor="#3f0912" />
          </linearGradient>
        </defs>
        <path d="M20 130 160 226 20 302Z" fill="url(#envSide)" />
        <path d="M300 130 160 226 300 302Z" fill="url(#envSide)" />
        <path d="M20 302 160 226 300 302Z" fill="url(#envBottom)" />
        <path d="M20 130 160 226 300 130M20 302 160 226 300 302" fill="none" stroke="#000" strokeOpacity=".25" />
      </svg>
      <svg className="env-layer env-flap-front" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <linearGradient id="envFlapClosed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6e1626" />
            <stop offset="1" stopColor="#4a0b16" />
          </linearGradient>
        </defs>
        <path d="M20 130 160 228 300 130Z" fill="url(#envFlapClosed)" stroke="#000" strokeOpacity=".22" />
        <path d="M34 136 160 222 286 136" fill="none" stroke="#d9b98a" strokeOpacity=".35" strokeWidth=".8" />
      </svg>
      <Seal className="env-seal" />
      <Bouquet className="env-flowers" />
    </div>
  );
}

/** `play` starts the envelope choreography (held back while the cover is still dissolving). */
export function Hero({ play }: { play: boolean }) {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<{ tl: gsap.core.Timeline; ready: Promise<unknown> } | null>(null);

  useEffect(() => {
    if (!play || !intro.current) return;
    const { tl, ready } = intro.current;
    ready.then(() => {
      if (intro.current?.tl === tl) tl.play();
    });
  }, [play]);

  useLayoutEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    let tl: gsap.core.Timeline | undefined;
    const hurry = () => tl?.isActive() && tl.timeScale(3.5);
    const events = ['wheel', 'touchmove', 'keydown'] as const;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap.set(q('.eyebrow'), { autoAlpha: 0, letterSpacing: '0.8em' });
      gsap.set(q('.env'), { autoAlpha: 0, y: 34, scale: 0.94 });
      gsap.set(q('.env-flap-front'), { rotateX: 0, autoAlpha: 1, transformPerspective: 700 });
      gsap.set(q('.env-flap-back'), { rotateX: 90, autoAlpha: 0, transformPerspective: 700 });
      gsap.set(q('.env-photo'), { yPercent: 56, scale: 0.97 });
      gsap.set(q('.env-flowers'), { autoAlpha: 0, scale: 0.3, rotate: -35 });
      gsap.set(q('.names .char > span'), { yPercent: 115 });
      gsap.set(q('.amp-script'), { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set(q('.hero-date'), { autoAlpha: 0, y: 14 });

      tl = gsap
        .timeline({ paused: true, defaults: { ease: EASE_SILK } })
        .to(q('.eyebrow'), { autoAlpha: 1, letterSpacing: '0.34em', duration: 2 })
        .to(q('.env'), { autoAlpha: 1, y: 0, scale: 1, duration: 1.4 }, 0.15)
        .to(q('.env-seal'), { scale: 1.12, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 }, 0.95)
        .fromTo(q('.seal-glint'), { x: 0 }, { x: 170, duration: 0.9, ease: 'power2.inOut' }, 0.95)
        .to(q('.env-flap-front'), { rotateX: -90, duration: 0.45, ease: 'power2.in' }, 1.35)
        .set(q('.env-flap-front'), { autoAlpha: 0 })
        .set(q('.env-flap-back'), { autoAlpha: 1 })
        .to(q('.env-flap-back'), { rotateX: 0, duration: 0.7, ease: 'power3.out' })
        .to(q('.env-photo'), { yPercent: 0, scale: 1, duration: 1.8 }, '-=0.45')
        .to(q('.env-flowers'), { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.6 }, '<0.25')
        .to(q('.names .char > span'), { yPercent: 0, duration: 1.3, stagger: 0.045 }, '<0.1')
        .to(q('.amp-script'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power2.inOut' }, '<0.35')
        .to(q('.hero-date'), { autoAlpha: 1, y: 0, duration: 1.2 }, '<0.4');

      intro.current = {
        tl,
        ready: Promise.all([photoReady(q('.env-photo')[0] as HTMLImageElement), document.fonts?.ready]),
      };
      events.forEach((t) => window.addEventListener(t, hurry, { passive: true }));

      gsap.to(q('.env-parallax'), {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(q('.hero-halo'), {
        scale: 1.25,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, el);

    return () => {
      events.forEach((t) => window.removeEventListener(t, hurry));
      intro.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="top" className="hero" aria-label="Save the date">
      <div className="hero-halo" aria-hidden="true" />
      <p className="eyebrow">Save the date</p>
      <div className="env-parallax">
        <Envelope />
      </div>
      <h1 className="names" aria-label={coupleNames}>
        <SplitChars className="name" text={wedding.names[0]} />
        <span className="amp-script" aria-hidden="true">
          &amp;
        </span>
        <SplitChars className="name" text={wedding.names[1]} />
      </h1>
      <p className="hero-date">
        {weekday(mainEvent.start)}, {longDate(mainEvent.start)}
      </p>
    </section>
  );
}
