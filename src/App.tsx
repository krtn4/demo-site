import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Ceremony } from './components/Ceremony';
import { Ambient, Cursor, MarginMark, ScrollProgress, SectionNav } from './components/Chrome';
import { Controls } from './components/Controls';
import { Countdown } from './components/Countdown';
import { Cover } from './components/Cover';
import { Events } from './components/Events';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Moments } from './components/Moments';
import { Rsvp } from './components/Rsvp';
import { wedding } from './config';
import { useAutoScroll } from './hooks/useAutoScroll';
import { useMusic } from './hooks/useMusic';
import { useRoute } from './hooks/useRoute';
import { observeReveals, prefersReducedMotion, ScrollTrigger, startLenis, stopLenis } from './lib/motion';

/** Keeps a stable full-height unit on mobile browsers whose toolbars resize the viewport. */
function useAppHeight() {
  useEffect(() => {
    const vv = window.visualViewport;
    const set = () =>
      document.documentElement.style.setProperty('--app-h', `${Math.max(window.innerHeight, vv?.height ?? 0)}px`);
    set();
    window.addEventListener('resize', set);
    window.addEventListener('orientationchange', set);
    vv?.addEventListener('resize', set);
    return () => {
      window.removeEventListener('resize', set);
      window.removeEventListener('orientationchange', set);
      vv?.removeEventListener('resize', set);
    };
  }, []);
}

export function App() {
  const [route, navigate] = useRoute();
  const onInvitation = route === '/invitation';
  // The cover stays mounted above the invitation until its exit transition completes.
  const [coverVisible, setCoverVisible] = useState(!onInvitation);
  const [scrolling, setScrolling] = useState(false);
  const music = useMusic();
  useAppHeight();

  useEffect(() => {
    if (route === '/open') setCoverVisible(true);
  }, [route]);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('locked', coverVisible);
    if (coverVisible) {
      stopLenis();
      window.scrollTo(0, 0);
    } else {
      startLenis();
      ScrollTrigger.refresh();
    }
  }, [coverVisible]);

  // Entering the invitation: start auto-scroll and, if the browser allows, the music.
  useEffect(() => {
    if (!onInvitation) {
      music.stop();
      setScrolling(false);
      return;
    }
    setScrolling(!prefersReducedMotion());
    if (!music.audio.current?.paused) return;
    music.play();
    const onFirstTap = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest('.controls')) return;
      if (music.audio.current?.paused) music.play();
    };
    window.addEventListener('pointerup', onFirstTap, { once: true });
    return () => window.removeEventListener('pointerup', onFirstTap);
  }, [onInvitation]); // eslint-disable-line react-hooks/exhaustive-deps -- music callbacks are stable

  useEffect(() => {
    const page = onInvitation && document.querySelector<HTMLElement>('main.page');
    return page ? observeReveals(page) : undefined;
  }, [onInvitation]);

  const stopScrolling = useCallback(() => setScrolling(false), []);
  useAutoScroll(onInvitation && !coverVisible && scrolling, wedding.scrollSpeed, stopScrolling, 4200);

  const openInvitation = useCallback(() => navigate('/invitation'), [navigate]);
  const coverGone = useCallback(() => setCoverVisible(false), []);
  const replay = useCallback(() => navigate('/open'), [navigate]);

  return (
    <>
      <audio ref={music.audio} loop preload="none">
        {wedding.music.map((src) => (
          <source key={src} src={src} type={src.endsWith('.webm') ? 'audio/webm' : 'audio/mp4'} />
        ))}
      </audio>
      <Cursor />
      {onInvitation && (
        <>
          <Ambient />
          <ScrollProgress />
          <SectionNav />
          <MarginMark />
          <main className="page">
            <Hero play={!coverVisible} />
            <Ceremony />
            <Events />
            <Countdown />
            {wedding.whatsapp && <Rsvp />}
            <Moments />
            <Footer onReplay={replay} />
          </main>
          {!coverVisible && (
            <Controls
              musicOn={music.on}
              scrolling={scrolling}
              onMusic={music.on ? music.stop : music.play}
              onScroll={() => setScrolling((s) => !s)}
            />
          )}
        </>
      )}
      {coverVisible && <Cover onStart={music.play} onOpen={openInvitation} onDone={coverGone} />}
    </>
  );
}
