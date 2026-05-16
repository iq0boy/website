import { TRANSLATIONS } from './i18n';
import type { Lang } from './i18n';

const FAQ_KEYS = [
  ['faq_q1', 'faq_a1'],
  ['faq_q2', 'faq_a2'],
  ['faq_q3', 'faq_a3'],
  ['faq_q4', 'faq_a4'],
  ['faq_q5', 'faq_a5'],
  ['faq_q6', 'faq_a6'],
] as const;

export function buildFaqLd(lang: Lang) {
  const t = TRANSLATIONS[lang] as Record<string, string>;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: FAQ_KEYS.map(([qKey, aKey]) => ({
      '@type': 'Question',
      name: t[qKey],
      acceptedAnswer: { '@type': 'Answer', text: t[aKey] },
    })),
  };
}
