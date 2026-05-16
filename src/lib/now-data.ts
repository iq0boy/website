// What's currently on Joseph's plate. Edit this file when something meaningful
// changes — the /now page reads from here directly.
//
// Format: each item has an optional `url` and a `label` (the visible text).
// Each list can be empty — empty sections hide automatically on the page.

import type { Lang } from './i18n';

export const NOW = {
  // ISO date — surfaced on the page as "Last updated".
  lastUpdatedIso: '2026-05-14',

  // What you're actively building this week / month.
  building: [
    { label: 'Carder — multi-tenant NFC card SaaS, v2 with badge marketplace' },
    { label: 'This site — three articles in, more in draft' },
  ],

  // What you're reading. Books, long-form articles, anything mind-shaping.
  reading: [
    { label: '“A Philosophy of Software Design” — John Ousterhout' },
    { label: '“Working in Public” — Nadia Eghbal' },
  ],

  // Skills, tech, or domains you're spending time on.
  learning: [
    { label: 'Drizzle ORM (production patterns, not just CRUD)' },
    { label: 'Astro server islands' },
  ],

  // Soundtrack while you work. Optional but humanises the page.
  listening: [
    { label: 'Bonobo — Migration' },
    { label: 'Nils Frahm — All Melody' },
  ],

  // What you're explicitly NOT taking on right now. Signals scope discipline.
  sayingNoTo: [
    { label: 'Crypto / NFT work' },
    { label: 'Salesforce or proprietary CMS projects' },
    { label: 'Recurring meetings before 10 AM' },
  ],
} as const;

// Localised section titles — keys are looked up via the t() function on the page,
// these are kept here as the source of truth for the structure.
export const NOW_SECTIONS: { key: string; data: readonly { label: string; url?: string }[] }[] = [
  { key: 'now_working_t', data: NOW.building },
  { key: 'now_reading_t', data: NOW.reading },
  { key: 'now_learning_t', data: NOW.learning },
  { key: 'now_listening_t', data: NOW.listening },
  { key: 'now_saying_no_t', data: NOW.sayingNoTo },
];

export function formatLastUpdated(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const fmt = lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-US';
  return d.toLocaleDateString(fmt, { day: 'numeric', month: 'long', year: 'numeric' });
}
