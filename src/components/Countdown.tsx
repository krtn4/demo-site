import { useEffect, useState, type CSSProperties } from 'react';
import { mainEvent, wedding } from '../config';
import { calendarDaysUntil, dayOfMonth, monthGrid, monthYear, timeOfDay } from '../lib/dates';
import { SectionTitle } from './SectionTitle';

const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const target = new Date(mainEvent.start).getTime();

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Each digit slides in from below when it changes. */
function RollingNumber({ value, pad = 2 }: { value: number; pad?: number }) {
  return (
    <span className="roll">
      {String(value)
        .padStart(pad, '0')
        .split('')
        .map((d, i, all) => (
          <span className="roll-slot" key={`${all.length - i}`}>
            <span key={d} className="roll-digit">
              {d}
            </span>
          </span>
        ))}
    </span>
  );
}

function Clock() {
  const now = useNow(1000);
  const ms = Math.max(0, target - now);
  const units = [
    { label: 'Days', value: Math.floor(ms / 864e5) },
    { label: 'Hours', value: Math.floor(ms / 36e5) % 24 },
    { label: 'Minutes', value: Math.floor(ms / 6e4) % 60 },
    { label: 'Seconds', value: Math.floor(ms / 1e3) % 60 },
  ];
  return (
    <div className="clock" role="timer" aria-label={`${units[0].value} days, ${units[1].value} hours and ${units[2].value} minutes to go`}>
      <div className="clock-units" aria-hidden="true">
        {units.map((u) => (
          <div key={u.label} className={`clock-unit${u.label === 'Days' ? ' days' : ''}`}>
            <b>
              <RollingNumber value={u.value} pad={u.label === 'Days' ? 1 : 2} />
            </b>
            <span>{u.label}</span>
          </div>
        ))}
      </div>
      <p className="clock-note">until the Muhuratam · {timeOfDay(mainEvent.start)}</p>
    </div>
  );
}

function MonthCalendar() {
  const { leading, days } = monthGrid(mainEvent.start);
  const marked = new Map(wedding.events.map((e) => [dayOfMonth(e.start), e.title]));
  const label = monthYear(mainEvent.start);
  return (
    <div className="month" data-reveal>
      <p className="eyebrow">{label}</p>
      <div className="grid" role="img" aria-label={`Calendar for ${label}`}>
        {DOW.map((d) => (
          <span key={d} className="dow" aria-hidden="true">
            {d}
          </span>
        ))}
        {Array.from({ length: leading }, (_, i) => (
          <span key={`b${i}`} aria-hidden="true" />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const title = marked.get(i + 1);
          return (
            <span
              key={i}
              className={title ? 'day on' : 'day'}
              title={title}
              aria-hidden="true"
              style={{ '--i': leading + i } as CSSProperties}
            >
              {i + 1}
            </span>
          );
        })}
      </div>
      <ul className="legend">
        {wedding.events.map((e) => (
          <li key={e.id}>
            <span className="legend-dot" aria-hidden="true">
              {dayOfMonth(e.start)}
            </span>
            {e.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Countdown() {
  const daysLeft = calendarDaysUntil(mainEvent.start);

  return (
    <section id="countdown" className="section" aria-labelledby="countdown-title">
      <SectionTitle id="countdown-title">Counting down</SectionTitle>
      <div data-reveal>
        {target > Date.now() ? (
          <Clock />
        ) : (
          <p className="lead">{daysLeft === 0 ? 'Today is the big day!' : 'Thank you for celebrating with us!'}</p>
        )}
      </div>
      <MonthCalendar />
    </section>
  );
}
