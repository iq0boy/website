import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildPostOg } from '../../../lib/og';
import type { Lang } from '../../../lib/i18n';

export async function getStaticPaths() {
  const langs: Lang[] = ['en', 'nl'];
  const results = await Promise.all(
    langs.map(async lang => {
      const posts = await getCollection('blog', ({ id, data }) => id.startsWith(lang + '/') && (!data.draft || import.meta.env.DEV));
      return posts.map(post => ({
        params: { lang, slug: post.id.split('/').slice(1).join('/') },
        props: { lang, title: post.data.title, category: post.data.category },
      }));
    })
  );
  return results.flat();
}

export const GET: APIRoute = async ({ props }) => {
  const png = await buildPostOg(props.title, props.category, props.lang);
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
