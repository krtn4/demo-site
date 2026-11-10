import { Fragment } from 'react';
import { wedding } from '../config';

const families = wedding.families
  .map((lines, i) => ({ title: [wedding.honorifics[i], wedding.names[i]].filter(Boolean).join(' '), lines }))
  .filter((f) => f.lines.length > 0);

export function Ceremony() {
  return (
    <section id="ceremony" className="section tight" aria-label="Invitation">
      <div className="ceremony" data-reveal="ceremony">
        <div className="ceremony-frame" aria-hidden="true" />
        <p className="ceremony-text">{wedding.blessings}</p>
        <p className="ceremony-text">{wedding.inviteLine}</p>
        {families.length > 0 && (
          <div className="families">
            {families.map((f, i) => (
              <Fragment key={f.title}>
                {i > 0 && <span className="with">With</span>}
                <div className="family">
                  <h2 className="family-name foil">{f.title}</h2>
                  {f.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        )}
        <div className="ornament" aria-hidden="true">
          ❦
        </div>
      </div>
    </section>
  );
}
