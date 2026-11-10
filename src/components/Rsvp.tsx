import { useState } from 'react';
import { coupleNames } from '../config';
import { whatsappUrl } from '../lib/links';
import { SectionTitle } from './SectionTitle';

/**
 * RSVP that opens WhatsApp with a pre-filled reply (no server involved).
 * Only rendered when `wedding.whatsapp` is configured.
 */
export function Rsvp() {
  const [name, setName] = useState('');
  const [guests, setGuests] = useState('1');
  const [attending, setAttending] = useState(true);
  const [message, setMessage] = useState('');

  return (
    <section id="rsvp" className="section" aria-labelledby="rsvp-title">
      <SectionTitle id="rsvp-title">Kindly reply</SectionTitle>
      <form
        className="card rsvp"
        data-reveal
        onSubmit={(e) => {
          e.preventDefault();
          const reply = attending
            ? `Hi! This is ${name}. I'll be attending with ${guests} guest(s) in total.`
            : `Hi! This is ${name}. Sadly I won't be able to make it.`;
          window.open(whatsappUrl(message ? `${reply}\n${message}` : reply), '_blank', 'noopener,noreferrer');
        }}
      >
        <label>
          Your name
          <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </label>
        <div className="choice" role="radiogroup" aria-label="Attendance">
          <button type="button" role="radio" aria-checked={attending} className={attending ? 'on' : ''} onClick={() => setAttending(true)}>
            Joyfully accept
          </button>
          <button type="button" role="radio" aria-checked={!attending} className={attending ? '' : 'on'} onClick={() => setAttending(false)}>
            Regretfully decline
          </button>
        </div>
        {attending && (
          <label>
            Number of guests (including you)
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Message (optional)
          <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
        <button className="btn solid" type="submit">
          Send on WhatsApp
        </button>
        <p className="hint">Opens WhatsApp with your reply ready to send to {coupleNames}.</p>
      </form>
    </section>
  );
}
