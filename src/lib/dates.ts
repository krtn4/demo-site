import { wedding } from '../config';

const fmt = (iso: string | Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: wedding.timeZone, ...opts }).format(new Date(iso));

export const longDate = (iso: string) => fmt(iso, { day: 'numeric', month: 'long', year: 'numeric' });
export const weekday = (iso: string) => fmt(iso, { weekday: 'long' });
export const dayOfMonth = (iso: string) => Number(fmt(iso, { day: 'numeric' }));
export const shortMonth = (iso: string) => fmt(iso, { month: 'short' });
export const monthYear = (iso: string) => fmt(iso, { month: 'long', year: 'numeric' });

export const timeOfDay = (iso: string) =>
  fmt(iso, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\b(am|pm)\b/i, (m) => m.toUpperCase());

export const eventTime = (e: { start: string; timeLabel?: string; timeNote?: string }) =>
  `${e.timeLabel ? `${e.timeLabel}: ` : ''}${timeOfDay(e.start)}${e.timeNote ? ` ${e.timeNote}` : ''}`;

/** Calendar-day difference in the wedding's time zone (0 = today). */
export function calendarDaysUntil(iso: string, now = new Date()) {
  const utcDay = (d: Date) => {
    const [y, m, day] = new Intl.DateTimeFormat('en-CA', {
      timeZone: wedding.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .format(d)
      .split('-')
      .map(Number);
    return Date.UTC(y, m - 1, day);
  };
  return Math.round((utcDay(new Date(iso)) - utcDay(now)) / 864e5);
}

/** The month grid (Monday-first) for the month containing `iso`. */
export function monthGrid(iso: string) {
  const year = Number(fmt(iso, { year: 'numeric' }));
  const month = Number(fmt(iso, { month: 'numeric' })) - 1;
  const leading = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return { leading, days };
}
