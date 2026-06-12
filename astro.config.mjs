// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * @param {string} dir
 * @param {string} dateField
 * @returns {Map<string, Date>}
 */
function buildContentDates(dir, dateField) {
  /** @type {Map<string, Date>} */
  const map = new Map();
  const full = resolve(dir);
  if (!existsSync(full)) return map;
  for (const file of readdirSync(full)) {
    if (!file.endsWith('.md')) continue;
    const content = readFileSync(resolve(full, file), 'utf-8');
    const match = content.match(new RegExp(`${dateField}:\\s*(\\S+)`));
    if (match) map.set(file.replace('.md', ''), new Date(match[1]));
  }
  return map;
}

const blogDates = buildContentDates('./src/content/blog/fr', 'pubDate');
const projectUpdatedDates = buildContentDates('./src/content/projects/fr', 'updatedDate');

export default defineConfig({
  site: 'https://josephpire.dev',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  prefetch: { defaultStrategy: 'hover', prefetchAll: true },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-BE', en: 'en-US', nl: 'nl-BE' },
      },
      /** @type {(item: import('@astrojs/sitemap').SitemapItem) => any} */
      serialize(item) {
        const blogSlug = item.url.match(/\/blog\/([^/]+)\/?$/)?.[1];
        if (blogSlug) {
          const date = blogDates.get(blogSlug);
          if (date) return { ...item, lastmod: date.toISOString(), changefreq: 'monthly' };
        }
        const projectSlug = item.url.match(/\/portfolio\/([^/]+)\/?$/)?.[1];
        if (projectSlug) {
          const date = projectUpdatedDates.get(projectSlug);
          if (date) return { ...item, lastmod: date.toISOString(), changefreq: 'yearly' };
        }
        return item;
      },
    }),
  ],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'nl'],
    routing: { prefixDefaultLocale: false },
  },
});
