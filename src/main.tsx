import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { wedding } from './config';
import './styles/index.css';

// Start fetching the hero photo and display fonts before the cover finishes.
const hero = new Image();
hero.fetchPriority = 'high';
hero.sizes = '(max-width: 400px) 60vw, 204px';
hero.srcset = wedding.couplePhotoSrcSet;
hero.src = wedding.couplePhoto;
if ('fonts' in document) {
  for (const f of ['400 54px "Great Vibes"', 'italic 400 16px Lora', '500 16px Lora', '400 30px "Playfair Display"']) {
    document.fonts.load(f).catch(() => {});
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
