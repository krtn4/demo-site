import couplePhoto from './assets/couple.webp';
import couplePhotoSmall from './assets/couple-420.webp';
import gallery01Small from './assets/gallery-01-800.webp';
import gallery01 from './assets/gallery-01.webp';

export type Venue = { name: string; address: string; mapsUrl?: string };

export type WeddingEvent = {
  id: string;
  title: string;
  /** ISO timestamp with the IST offset. */
  start: string;
  durationHours: number;
  timeLabel?: string;
  timeNote?: string;
  description: string;
  venue: Venue;
};

/** `src` is the full-size image (used in the photo viewer); `srcSet` adds smaller renditions. */
export type Photo = { src: string; srcSet?: string; alt: string };

/**
 * All invitation content, kept verbatim from the reference invitation.
 * Edit this file to change names, events or links.
 */
export const wedding = {
  names: ['Karan', 'Sonal'] as const,
  honorifics: ['Chi.', 'Chi. Sou.'] as const,
  monogram: 'K&S',
  timeZone: 'Asia/Kolkata',
  families: [
    ['S/o Smt. Anjali & Shri Rajesh Malhotra', 'New Delhi'],
    ['D/o Smt. Meera & Shri Vikram Kapoor', 'Jaipur'],
  ],
  blessings:
    'With the divine blessings of our Kuladevatha, Gramadevatha, Paramapoojya Guru, and the gracious blessings of our respected elders,',
  inviteLine:
    'we cordially invite you and your family to grace the auspicious occasion of our wedding ceremony and bless us as we begin this beautiful journey of togetherness.',
  couplePhoto,
  couplePhotoSrcSet: `${couplePhotoSmall} 420w, ${couplePhoto} 760w`,
  closing: 'Your presence would be the greatest gift we could receive.',
  /** The browser plays the first format it supports, so the smaller WebM/Opus file comes first. */
  music: ['/media/audio/music.webm', '/media/audio/music.m4a'],
  /** Auto-scroll speed in pixels per second. */
  scrollSpeed: 55,
  uploadUrl: 'https://drive.google.com/drive/folders/1cGq1e4WhUQ5hdTP04XwcPXWb1QN6Jlmp?usp=sharing',
  /** WhatsApp number (country code, digits only). The RSVP section only appears when this is set. */
  whatsapp: '',
  /** Studio credit shown at the very end of the invitation. */
  brand: { name: 'Invitra Moments', instagram: 'invitra.moments' },
  events: [
    {
      id: 'mehendi',
      title: 'Mehendi & Haldi',
      start: '2027-02-12T11:00:00+05:30',
      timeNote: 'onwards',
      durationHours: 5,
      description: 'Join us for a sunlit morning of henna, haldi and laughter with family and friends.',
      venue: { name: 'Narain Niwas Palace', address: 'Kanota Bagh, Narayan Singh Road, Jaipur' },
    },
    {
      id: 'sangeet',
      title: 'Sangeet Night',
      start: '2027-02-12T19:30:00+05:30',
      timeNote: 'onwards',
      durationHours: 4,
      description: 'An evening of music, dance and celebration, the night before the wedding.',
      venue: { name: 'Narain Niwas Palace', address: 'Kanota Bagh, Narayan Singh Road, Jaipur' },
    },
    {
      id: 'wedding',
      title: 'Wedding Ceremony',
      start: '2027-02-13T18:45:00+05:30',
      timeLabel: 'Muhuratam',
      durationHours: 4,
      description: 'Join us as we take our pheras and begin our journey together, surrounded by family and friends.',
      venue: { name: 'Jai Mahal Palace', address: 'Jacob Road, Civil Lines, Jaipur' },
    },
    {
      id: 'reception',
      title: 'Reception',
      start: '2027-02-14T19:30:00+05:30',
      timeNote: 'onwards',
      durationHours: 4,
      description: 'Celebrate the newlyweds with us over dinner and dancing.',
      venue: { name: 'Rambagh Palace', address: 'Bhawani Singh Road, Jaipur' },
    },
  ] satisfies WeddingEvent[],
  gallery: [
    {
      src: gallery01,
      srcSet: `${gallery01Small} 800w, ${gallery01} 1159w`,
      alt: 'Karan and Sonal, a portrait together',
    },
  ] satisfies Photo[],
};

export const mainEvent = wedding.events.find((e) => e.id === 'wedding') ?? wedding.events[0];
export const coupleNames = `${wedding.names[0]} & ${wedding.names[1]}`;
