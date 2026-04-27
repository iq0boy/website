import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildPostOg } from '../../lib/og';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ id }) => id.startsWith('fr/'));
  return posts.map(post => ({
    params: { slug: post.id.split('/').slice(1).join('/') },
    props: { title: post.data.title, category: post.data.category },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const png = await buildPostOg(props.title, props.category);
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
