import { useEffect } from 'react';

const INTERACTION = ['touchstart', 'touchmove', 'wheel', 'pointerdown', 'keydown'] as const;

/**
 * Slowly scrolls the page at `speed` px/s. Any interaction pauses it for 5 s;
 * it waits while a form field is focused or the photo viewer is open, and calls
 * `onEnd` at the bottom of the page.
 */
export function useAutoScroll(active: boolean, speed: number, onEnd: () => void, startDelay = 1500) {
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    let carry = 0;
    let resumeAt = performance.now() + startDelay;
    let lastY = window.scrollY;
    const pause = () => (resumeAt = performance.now() + 5000);
    INTERACTION.forEach((t) => window.addEventListener(t, pause, { passive: true }));

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const focused = document.activeElement;
      // The photo viewer locks the page while it is open.
      const busy =
        (focused instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName)) ||
        document.documentElement.classList.contains('locked');
      if (Math.abs(window.scrollY - lastY) > 2) {
        pause();
        lastY = window.scrollY;
      }
      if (now >= resumeAt && !busy) {
        carry += speed * dt;
        const step = Math.floor(carry);
        if (step > 0) {
          carry -= step;
          window.scrollBy(0, step);
          lastY = window.scrollY;
        }
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
          onEnd();
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame((t) => {
      last = t;
      tick(t);
    });
    return () => {
      cancelAnimationFrame(raf);
      INTERACTION.forEach((t) => window.removeEventListener(t, pause));
    };
  }, [active, speed, onEnd, startDelay]);
}
