import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { Lang } from '../../lib/i18n';

export function getStaticPaths() {
  return [
    { params: { lang: 'en' }, props: { lang: 'en' as Lang } },
    { params: { lang: 'nl' }, props: { lang: 'nl' as Lang } },
  ];
}

const META: Record<Lang, { title: string; description: string; langTag: string }> = {
  fr: {
    title: 'Joseph Pire — Blog',
    description:
      "Joseph Pire écrit sur le développement web, le design, l'IA et l'art de construire des produits digitaux.",
    langTag: 'fr-be',
  },
  en: {
    title: 'Joseph Pire — Blog',
    description:
      'Joseph Pire writes about web development, design, AI, and the craft of building digital products.',
    langTag: 'en',
  },
  nl: {
    title: 'Joseph Pire — Blog',
    description:
      'Joseph Pire schrijft over webontwikkeling, design, AI en het maken van digitale producten.',
    langTag: 'nl-be',
  },
};

export const GET: APIRoute = async (context) => {
  const lang = (context.params.lang ?? 'en') as Lang;
  const site = context.site ?? new URL('https://josephpire.dev');
  const posts = await getCollection('blog', ({ id, data }) => id.startsWith(lang + '/') && (!data.draft || import.meta.env.DEV));
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const meta = META[lang];
  const prefix = lang === 'fr' ? '' : `/${lang}`;

  return rss({
    title: meta.title,
    description: meta.description,
    site,
    items: sorted.map((post) => {
      const slug = post.id.split('/').slice(1).join('/').replace(/\.md$/, '');
      return {
        title: post.data.title,
        description: post.data.excerpt,
        pubDate: post.data.pubDate,
        categories: [post.data.category],
        link: `${prefix}/blog/${slug}/`,
      };
    }),
    customData: `<language>${meta.langTag}</language>`,
    stylesheet: '/rss-styles.xsl',
  });
};
