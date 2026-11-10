import { Camera, Upload, Video } from 'lucide-react';
import { wedding } from '../config';
import { Gallery } from './Gallery';
import { SectionTitle } from './SectionTitle';

const STEPS = ['Tap the button below', 'Choose the photos and videos you took', "Upload them. That's it, thank you!"];

export function Moments() {

  return (
    <section id="moments" className="section" aria-labelledby="moments-title">
      <SectionTitle id="moments-title">Share Your Moments</SectionTitle>
      <Gallery />
      <div className="card upload" data-reveal>
        <div className="upload-icons" aria-hidden="true">
          <Camera size={26} strokeWidth={1.5} />
          <Video size={26} strokeWidth={1.5} />
        </div>
        <p className="upload-lead">
          Took photos or videos at the wedding or at any of the functions? Upload them here and they will be saved in our
          shared album, so we can relive every moment through your eyes.
        </p>
        <ol className="steps" data-reveal="stagger">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        {wedding.uploadUrl ? (
          <a className="btn solid" href={wedding.uploadUrl} target="_blank" rel="noopener noreferrer">
            <Upload size={14} strokeWidth={1.8} aria-hidden="true" />
            Upload photos &amp; videos
          </a>
        ) : (
          <button type="button" className="btn solid" disabled>
            Upload opens soon
          </button>
        )}
        <p className="hint">Large videos can take a few minutes, so Wi-Fi works best. You can pick many files at once.</p>
      </div>
    </section>
  );
}
