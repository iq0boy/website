import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

import altitudeMusic from '../assets/projects/altitude-music/hero.png';
import carder from '../assets/projects/carder/hero.png';
import ecoBbq from '../assets/projects/eco-bbq-v2/hero.png';
import sobeltax from '../assets/projects/sobeltax/home.png';
import holmes from '../assets/projects/holmes/dashboard.png';
import itschool from '../assets/projects/itschool/home.png';
import ogbay from '../assets/projects/ogbay/home.png';
import listify from '../assets/projects/listify/dashboard.png';

// Cover thumbnail per project slug, shown on the home + portfolio cards.
// Note: eco-bbq's assets live under the eco-bbq-v2/ folder. A project without an
// entry here falls back to its accent colour + category label on the card.
const PROJECT_COVERS: Record<string, ImageMetadata> = {
  'altitude-music': altitudeMusic,
  carder,
  'eco-bbq': ecoBbq,
  sobeltax,
  holmes,
  itschool,
  ogbay,
  listify,
};

export type Cover = { src: string; width: number; height: number };

// Server-side only (imports astro:assets) — call from .astro frontmatter.
// Returns an optimised WebP cover for a project, or null if it has none.
export async function coverFor(slug: string, targetWidth = 1200): Promise<Cover | null> {
  const meta = PROJECT_COVERS[slug];
  if (!meta) return null;
  const width = Math.min(targetWidth, meta.width);
  const height = Math.round((width / meta.width) * meta.height);
  const img = await getImage({ src: meta, width, height, format: 'webp' });
  return { src: img.src, width, height };
}
