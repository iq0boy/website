// Replace these placeholders with real client quotes before going live.
// Anything where `placeholder: true` is set will NOT appear in the JSON-LD
// `Review` schema, only on-page — keeps Google from indexing fake reviews.

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  project?: string;
  placeholder?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Joseph delivered our SaaS dashboard 3 weeks ahead of schedule, with a polish we hadn’t expected. Communication was tight throughout — no surprises, no scope creep.',
    author: 'Client Name',
    role: 'CTO',
    project: 'Tech Cards',
    placeholder: true,
  },
  {
    quote:
      'The redesign moved the needle on our conversion within two weeks of launch. He understood the business goal, not just the brief.',
    author: 'Client Name',
    role: 'Founder',
    project: 'Sobeltax',
    placeholder: true,
  },
  {
    quote:
      'Rare combination of design instinct and technical depth. Our team learned a lot just from his pull request reviews.',
    author: 'Client Name',
    role: 'Engineering Lead',
    placeholder: true,
  },
];

export function buildReviewLd(siteUrl: string) {
  const real = TESTIMONIALS.filter(t => !t.placeholder);
  if (real.length === 0) return null;

  return real.map(t => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewBody: t.quote,
    author: { '@type': 'Person', name: t.author, ...(t.role ? { jobTitle: t.role } : {}) },
    itemReviewed: { '@type': 'Person', '@id': `${siteUrl}/#person`, name: 'Joseph Pire' },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  }));
}
