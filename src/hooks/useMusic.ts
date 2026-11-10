import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Background music with a gentle fade-in. Playback only starts from a user gesture
 * (or when the browser already allows it); it pauses while the tab is hidden.
 */
export function useMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const fade = useRef(0);
  const [on, setOn] = useState(false);

  const play = useCallback(async () => {
    const a = audio.current;
    if (!a) return;
    clearInterval(fade.current);
    a.volume = 0;
    try {
      await a.play();
    } catch {
      setOn(false);
      return;
    }
    setOn(true);
    fade.current = window.setInterval(() => {
      a.volume = Math.min(1, a.volume + 0.05);
      if (a.volume >= 1) clearInterval(fade.current);
    }, 100);
  }, []);

  const stop = useCallback(() => {
    clearInterval(fade.current);
    audio.current?.pause();
    setOn(false);
  }, []);

  useEffect(() => {
    const a = audio.current;
    if (!a || !on) return;
    const onVis = () => (document.hidden ? a.pause() : void a.play().catch(() => {}));
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [on]);

  useEffect(() => () => clearInterval(fade.current), []);

  return { audio, on, play, stop };
}
