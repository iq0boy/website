import type { APIRoute } from 'astro';
import { buildDefaultOg } from '../lib/og';

export const GET: APIRoute = async () => {
  const png = await buildDefaultOg();
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
