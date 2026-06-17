// Single source of truth for facts about Joseph that show up on multiple pages.
// Edit this file rather than hunting through components.

const STARTED_AT = 2018; // year you started taking client work
const PROJECT_COUNT = 40; // approximate — keep honest, update when you ship
const CLIENT_COUNT = 25;

const CURRENT_YEAR = new Date().getFullYear();

export const PROFILE = {
  name: 'Joseph Pire',
  email: 'josephpire.dev@gmail.com',
  github: 'https://github.com/iq0boy',
  githubHandle: 'iq0boy',
  // Public Cal.com scheduling link (username `jpire`, 30-min event). Public by
  // design — never put a `cal_live_*` API key here; this file is bundled to the client.
  bookingUrl: 'https://cal.com/jpire/30min',
  // For when you publish a downloadable CV PDF in public/cv.pdf
  cvUrl: '/cv.pdf',
} as const;

export const STATS = {
  years: CURRENT_YEAR - STARTED_AT,
  projects: PROJECT_COUNT,
  clients: CLIENT_COUNT,
  // Removed "99% satisfaction" — there's no honest way to compute it and prospects spot it.
} as const;

// Projects featured on the home page, in display order. Slugs must match the
// filenames in src/content/projects/<lang>/. Edit this to curate the home; the
// full set still appears on /portfolio. (carder = the NFC "Tech Cards" product.)
export const FEATURED_PROJECTS = ['ogbay', 'sobeltax', 'carder'] as const;

// Availability — edit `nextSlotIso` to update the home + contact + /now badge in one place.
// Use `status` to mark yourself:
//   'open'        → green, accepting work now
//   'limited'     → amber, accepting future bookings only
//   'closed'      → red, not accepting work
export const AVAILABILITY = {
  status: 'limited' as 'open' | 'limited' | 'closed',
  // ISO date of the earliest moment you can start a new project. Set to null when status is 'open'.
  nextSlotIso: '2026-09-01',
  lastUpdatedIso: '2026-05-14',
} as const;

// Legal identity for the footer mentions + the /legal, /privacy, /terms pages.
// Belgian sole proprietor (personne physique) — Code de droit économique requires
// the name, address and enterprise number to be permanently accessible.
//
// `enterpriseNumber` holds the bare BCE number (no country prefix); the footer
// shows it as "BCE 1036.150.733" and, with a "BE" prefix, as the VAT number.
// Empty fields are simply omitted from the footer.
export const LEGAL = {
  legalName: 'Joseph Pire',
  enterpriseNumber: '1036.150.733', // BCE; VAT = BE 1036.150.733 (same digits)
  address: 'Rue des Pommiers 12, 1348 Louvain-la-Neuve', // registered seat (home)
  email: 'josephpire.dev@gmail.com',
  vatRegime: 'normal' as 'normal' | 'franchise', // normal regime (21 %)
  jurisdiction: 'Brabant wallon', // judicial district for /legal & /terms (LLN)
} as const;

// Logos shown in the "Worked with" band. Drop logo SVGs into src/assets/logos/<slug>.svg
// (or .png) and reference them here. Until you have permission, you can leave the array empty —
// the section will hide itself automatically.
export const CLIENT_LOGOS: { name: string; src?: string; href?: string }[] = [
  // Example shape — replace with your real entries:
  // { name: 'Sobeltax', src: 'sobeltax.svg', href: 'https://sobeltax.be' },
];
