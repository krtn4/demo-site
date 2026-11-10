import { ArrowDown, Pause, VolumeX } from 'lucide-react';

type Props = { musicOn: boolean; scrolling: boolean; onMusic: () => void; onScroll: () => void };

/** Floating music and auto-scroll toggles, as on the original invitation. */
export function Controls({ musicOn, scrolling, onMusic, onScroll }: Props) {
  return (
    <div className="controls">
      <button type="button" onClick={onMusic} aria-label={musicOn ? 'Mute music' : 'Play music'} aria-pressed={musicOn}>
        {musicOn ? (
          <span className="eq" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : (
          <VolumeX size={20} strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        onClick={onScroll}
        aria-label={scrolling ? 'Stop auto-scroll' : 'Start auto-scroll'}
        aria-pressed={scrolling}
      >
        {scrolling ? (
          <Pause size={20} strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <ArrowDown size={20} strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
