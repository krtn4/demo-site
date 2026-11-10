# Karan & Sonal — Wedding Invitation

A cinematic rebuild of the original invitation (`/open` cover → `/invitation`), with the same content, palette and typography.

## Run

```bash
npm install
npm run dev       # local development
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Deploy to Vercel as a Vite project; `vercel.json` rewrites `/open` and `/invitation` to the app.

## Editing content

All names, events, links and photos live in [`src/config.ts`](src/config.ts).

- **RSVP** is hidden until `whatsapp` is set (country code + number, digits only). Replies are not stored anywhere: the form opens WhatsApp with a pre-filled message to that number.
- **Photo uploads** go to the Google Drive folder in `uploadUrl`.
- **Gallery**: add entries to `gallery` (`src`, optional `srcSet`, `alt`). With more than one photo, the viewer gains next/previous and swipe.
- **Music**: `public/media/audio/`. It only starts after the guest taps Open (browsers block autoplay), and fades in.

## Structure

- `src/components/Cover.tsx`: opening card with entrance choreography, desktop tilt and exit transition
- `src/components/Hero.tsx`: envelope that breaks its seal, opens its flap and raises the couple photo
- `Ceremony`, `Events` (timeline + maps + calendar), `Countdown`, `Moments` (gallery + upload), `Rsvp`, `Footer`
- `src/components/Chrome.tsx`: side navigation, progress line, ambient background, cursor
- `src/lib/motion.ts`: GSAP/ScrollTrigger/Lenis setup and the CSS-driven scroll-reveal observer
- `src/styles/index.css`: design tokens and all styles

Scroll reveals are CSS transitions toggled by an IntersectionObserver; GSAP handles the timelines and scrubbed effects. Everything respects `prefers-reduced-motion`: content appears in its final state and auto-scroll stays off.
