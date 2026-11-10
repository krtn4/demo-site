import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { wedding } from '../config';
import { getLenis, gsap, prefersReducedMotion, useGsap } from '../lib/motion';

const photos = wedding.gallery;

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef(0);
  const many = photos.length > 1;

  useLayoutEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    getLenis()?.stop();
    document.documentElement.classList.add('locked');
    if (!prefersReducedMotion()) {
      // Opacity rather than autoAlpha so the close button stays focusable during the fade.
      gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
    return () => {
      getLenis()?.start();
      document.documentElement.classList.remove('locked');
      previous?.focus();
    };
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      root.current!.querySelector('img'),
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out' },
    );
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (many && e.key === 'ArrowLeft') onStep(-1);
      if (many && e.key === 'ArrowRight') onStep(1);
      if (e.key === 'Tab') {
        const focusables = root.current!.querySelectorAll<HTMLElement>('button');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [many, onClose, onStep]);

  const photo = photos[index];
  return createPortal(
    <div
      ref={root}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (many && Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
      }}
    >
      <button ref={closeBtn} type="button" className="lb-close" aria-label="Close">
        <X size={22} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <img src={photo.src} alt={photo.alt} onClick={(e) => e.stopPropagation()} />
      {many && (
        <>
          <p className="lb-count">
            {index + 1} / {photos.length}
          </p>
          <button
            type="button"
            className="lb-nav prev"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
          >
            <ChevronLeft size={26} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="lb-nav next"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
          >
            <ChevronRight size={26} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}

export function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), []);

  useGsap(root, (el) => {
    el.querySelectorAll<HTMLElement>('.photo').forEach((frame) => {
      gsap.fromTo(
        frame,
        { clipPath: 'inset(22% 12% 22% 12% round 18px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 18px)',
          duration: 1.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: frame, start: 'top 85%', once: true },
        },
      );
      gsap.fromTo(
        frame.querySelector('img'),
        { scale: 1.22, yPercent: -4 },
        { scale: 1.02, yPercent: 4, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
  });

  if (photos.length === 0) return null;
  return (
    <div ref={root} className={`gallery${photos.length > 1 ? ' many' : ''}`}>
      {photos.map((p, i) => (
        <button key={p.src} type="button" className="photo" onClick={() => setOpen(i)} aria-label={`Open photo: ${p.alt}`}>
          <img
            src={p.src}
            srcSet={p.srcSet}
            sizes="(max-width: 560px) calc(100vw - 40px), 520px"
            alt={p.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <span className="photo-hint" aria-hidden="true">
            <Expand size={16} strokeWidth={1.5} />
          </span>
        </button>
      ))}
      {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
    </div>
  );
}
