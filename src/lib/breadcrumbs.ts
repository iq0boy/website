import { TRANSLATIONS, localePath } from './i18n';
import type { Lang } from './i18n';

interface Crumb {
  name: string;
  // Absolute path, no protocol (e.g. /portfolio/). Empty for the homepage.
  path: string;
}

// Builds a BreadcrumbList JSON-LD entry given a chain of crumbs.
// Always prepends Home; pass the rest in order, leaf last.
export function buildBreadcrumbLd(siteUrl: string, lang: Lang, crumbs: Crumb[]) {
  const t = (key: string) => (TRANSLATIONS[lang] as Record<string, string>)[key] ?? key;
  const items = [{ name: t('nav_home'), path: localePath(lang, '/') }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${siteUrl}${c.path}`,
    })),
  };
}
