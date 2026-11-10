import { Instagram, RotateCcw, Share2 } from 'lucide-react';
import { useState } from 'react';
import { coupleNames, wedding } from '../config';
import { copyText } from '../lib/links';
import { Flourish } from './Ornaments';

const shareUrl = () => `${window.location.origin}/open`;
const LABELS = { idle: 'Share invitation', copied: 'Link copied', failed: "Couldn't copy the link" };

export function Footer({ onReplay }: { onReplay: () => void }) {
  const [state, setState] = useState<keyof typeof LABELS>('idle');

  const share = async () => {
    const url = shareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: `${coupleNames} — Wedding Invitation`, text: "You're invited to our wedding!", url });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }
    setState((await copyText(url)) ? 'copied' : 'failed');
    setTimeout(() => setState('idle'), 2500);
  };

  return (
    <footer className="footer">
      <p className="lead" data-reveal>
        {wedding.closing}
      </p>
      <div className="ornament" data-reveal aria-hidden="true">
        ❦
      </div>
      <p className="footer-names" data-reveal>
        {coupleNames}
      </p>
      <div className="footer-actions" data-reveal>
        <button type="button" className="btn ghost" onClick={share} aria-live="polite">
          <Share2 size={14} strokeWidth={1.6} aria-hidden="true" />
          {LABELS[state]}
        </button>
        <button type="button" className="text-link" onClick={onReplay}>
          <RotateCcw size={13} strokeWidth={1.6} aria-hidden="true" />
          Replay the opening
        </button>
      </div>
      <Flourish className="footer-flourish" />
      <aside className="brand-credit" data-reveal>
        <p className="brand-ask">Want a beautiful website like this?</p>
        <a
          className="brand-link"
          href={`https://www.instagram.com/${wedding.brand.instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${wedding.brand.name} on Instagram`}
        >
          <Instagram size={15} strokeWidth={1.6} aria-hidden="true" />@{wedding.brand.instagram}
        </a>
      </aside>
    </footer>
  );
}
