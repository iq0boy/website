import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const site = context.site ?? new URL('https://josephpire.dev');
  const posts = await getCollection('blog', ({ id, data }) => id.startsWith('fr/') && (!data.draft || import.meta.env.DEV));
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Joseph Pire — Blog',
    description:
      "Joseph Pire écrit sur le développement web, le design, l'IA et l'art de construire des produits digitaux.",
    site,
    items: sorted.map((post) => {
      const slug = post.id.split('/').slice(1).join('/').replace(/\.md$/, '');
      return {
        title: post.data.title,
        description: post.data.excerpt,
        pubDate: post.data.pubDate,
        categories: [post.data.category],
        link: `/blog/${slug}/`,
      };
    }),
    customData: '<language>fr-be</language>',
    stylesheet: '/rss-styles.xsl',
  });
};
