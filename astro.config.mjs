// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Build slug → pubDate map from French blog frontmatter (source of truth for dates)
function buildBlogDates() {
  const map = new Map();
  const dir = resolve('./src/content/blog/fr');
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const content = readFileSync(resolve(dir, file), 'utf-8');
    const match = content.match(/pubDate:\s*(\S+)/);
    if (match) map.set(file.replace('.md', ''), new Date(match[1]));
  }
  return map;
}

const blogDates = buildBlogDates();

export default defineConfig({
  site: 'https://josephpire.dev',
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const blogSlug = item.url.match(/\/blog\/([^/]+)\/?$/)?.[1];
        if (blogSlug) {
          const date = blogDates.get(blogSlug);
          if (date) return { ...item, lastmod: date, changefreq: 'monthly' };
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