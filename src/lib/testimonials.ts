// Real client quotes only. Anything with `placeholder: true` is kept out of the
// JSON-LD `Review` schema (never index fake reviews) — but note that placeholders
// are still *visible on the page*, so an empty array is the honest default.
//
// The section hides itself entirely while this array is empty (see Testimonials.tsx),
// so adding the first real quote is all it takes to bring it back.
//
// Outreach script that works:
//   "Quick favour: would you write 2 sentences about working with me? I'm
//    refreshing my site. Anything honest is fine — I'd rather have real than glowing."

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  project?: string;
  placeholder?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  // Shape to follow — drop real quotes in here and the section reappears:
  // {
  //   quote: '…',
  //   author: 'Firstname Lastname',
  //   role: 'CTO',
  //   project: 'Sobeltax',
  // },
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
