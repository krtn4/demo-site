import { CalendarPlus, Download, MapPin, Navigation } from 'lucide-react';
import { useRef, useState } from 'react';
import { wedding, type WeddingEvent } from '../config';
import { dayOfMonth, eventTime, longDate, shortMonth, weekday } from '../lib/dates';
import { directionsUrl, downloadIcs, googleCalendarUrl, mapEmbedUrl, venueLabel } from '../lib/links';
import { gsap, useGsap } from '../lib/motion';
import { SectionTitle } from './SectionTitle';

function VenueMap({ event }: { event: WeddingEvent }) {
  const [open, setOpen] = useState(false);
  const id = `map-${event.id}`;
  return (
    <>
      <button
        type="button"
        className="map-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <MapPin size={15} strokeWidth={1.6} aria-hidden="true" />
        {open ? 'Hide map' : 'View on map'}
      </button>
      <div id={id} className={`map-frame${open ? ' open' : ''}`}>
        {open && (
          <iframe
            title={`Map showing ${venueLabel(event.venue)}`}
            src={mapEmbedUrl(event.venue)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </>
  );
}

function EventCard({ event }: { event: WeddingEvent }) {
  const { venue } = event;
  return (
    <article className="event" data-reveal="event" aria-labelledby={`ev-${event.id}`}>
      <div className="medallion" aria-hidden="true">
        <span className="medallion-day">{String(dayOfMonth(event.start)).padStart(2, '0')}</span>
        <span className="medallion-month">{shortMonth(event.start)}</span>
      </div>
      <div className="card event-card">
        <h3 id={`ev-${event.id}`}>{event.title}</h3>
        <p className="when">
          <strong>{weekday(event.start)}</strong>
          <br />
          {longDate(event.start)}
          <br />
          {eventTime(event)}
        </p>
        <p className="desc">{event.description}</p>
        <div className="venue">
          <strong>{venue.name}</strong>
          <span>{venue.address}</span>
          <VenueMap event={event} />
        </div>
        <div className="actions">
          <a className="btn" href={directionsUrl(venue)} target="_blank" rel="noopener noreferrer">
            <Navigation size={14} strokeWidth={1.6} aria-hidden="true" />
            Get directions
          </a>
          <a className="btn ghost" href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
            <CalendarPlus size={14} strokeWidth={1.6} aria-hidden="true" />
            Add to calendar
          </a>
          <button type="button" className="btn ghost" onClick={() => downloadIcs(event)}>
            <Download size={14} strokeWidth={1.6} aria-hidden="true" />
            Download .ics
          </button>
        </div>
      </div>
    </article>
  );
}

export function Events() {
  const root = useRef<HTMLElement>(null);

  // The gold thread draws itself down the timeline as you scroll.
  useGsap(root, (el) => {
    gsap.fromTo(
      el.querySelector('.thread-fill'),
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: el.querySelector('.timeline'), start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
      },
    );
  });

  return (
    <section ref={root} id="events" className="section" aria-labelledby="events-title">
      <SectionTitle id="events-title">Ceremony Info</SectionTitle>
      <div className="timeline">
        <div className="thread" aria-hidden="true">
          <span className="thread-fill" />
        </div>
        {wedding.events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </section>
  );
}
