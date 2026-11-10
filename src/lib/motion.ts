import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useLayoutEffect, type RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 1 });

export { gsap, ScrollTrigger };

export const EASE_SILK = 'expo.out';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;

/** Smooth wheel scrolling on desktop; touch devices keep native momentum. */
export function startLenis() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tickLenis);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function tickLenis(time: number) {
  lenis?.raf(time * 1000);
}

export const getLenis = () => lenis;

export function stopLenis() {
  if (!lenis) return;
  gsap.ticker.remove(tickLenis);
  lenis.destroy();
  lenis = null;
}

export function scrollToTarget(target: HTMLElement | number) {
  if (lenis) lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : -24, duration: 1.6 });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

/**
 * Runs GSAP setup scoped to `scope` and reverts every tween/ScrollTrigger on unmount.
 * When reduced motion is requested, `setup` is skipped so content renders in its final state.
 */
export function useGsap(scope: RefObject<HTMLElement>, setup: (self: HTMLElement) => void, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => setup(el), el);
    return () => ctx.revert();
  }, deps);
}

/**
 * Scroll reveals for `[data-reveal]` elements: the observer only toggles an `in` class and the
 * choreography lives in CSS transitions, so no styles are read back during load.
 */
export function observeReveals(root: HTMLElement) {
  const els = root.querySelectorAll<HTMLElement>('[data-reveal]');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }),
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
