import { coupleNames, wedding, type Venue, type WeddingEvent } from '../config';

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const span = (e: WeddingEvent) => {
  const start = new Date(e.start);
  const end = new Date(start.getTime() + e.durationHours * 36e5);
  return { start: stamp(start), end: stamp(end) };
};

export const venueLabel = (v: Venue) => [v.name, v.address].filter(Boolean).join(', ');
const summary = (e: WeddingEvent) => `${e.title} — ${coupleNames}`;

export const directionsUrl = (v: Venue) =>
  v.mapsUrl ?? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueLabel(v))}`;

/** Keyless Google Maps embed for a venue. */
export const mapEmbedUrl = (v: Venue) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(venueLabel(v))}&z=15&output=embed`;

export function googleCalendarUrl(e: WeddingEvent) {
  const { start, end } = span(e);
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE',
    text: summary(e),
    dates: `${start}/${end}`,
    details: e.description,
    location: venueLabel(e.venue),
  })}`;
}

export function downloadIcs(e: WeddingEvent) {
  const { start, end } = span(e);
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Karan & Sonal Wedding//EN',
    'BEGIN:VEVENT',
    `UID:${e.id}@karan-sonal-wedding`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${esc(summary(e))}`,
    `DESCRIPTION:${esc(e.description)}`,
    `LOCATION:${esc(venueLabel(e.venue))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${e.id}.ics` });
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const whatsappUrl = (text: string) => `https://wa.me/${wedding.whatsapp}?text=${encodeURIComponent(text)}`;

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      /* unsupported */
    }
    ta.remove();
    return ok;
  }
}
