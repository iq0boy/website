// Generates branded hero PNGs for each blog post into src/assets/blog/<slug>/hero.png.
// Run with: node scripts/generate-blog-heroes.mjs
// Re-run whenever you add a new post or change its title.
//
// Why a script and not an Astro endpoint: hero images are committed assets,
// not on-the-fly endpoints. They go through Astro's image optimization the
// same as project images do.

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createElement as h } from 'react';

const ROOT = resolve(process.cwd());
const SRC_DIR = resolve(ROOT, 'src/content/blog/fr');
const OUT_DIR = resolve(ROOT, 'src/assets/blog');

const WIDTH = 1600;
const HEIGHT = 720;

const fontBold = readFileSync(
  resolve(ROOT, 'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff'),
);
const fontRegular = readFileSync(
  resolve(ROOT, 'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff'),
);
const fontDisplay = readFileSync(
  resolve(ROOT, 'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff'),
);

const FONTS = [
  { name: 'Space Grotesk', data: fontBold, weight: 700 },
  { name: 'Space Grotesk', data: fontRegular, weight: 400 },
  { name: 'Instrument Serif', data: fontDisplay, weight: 400, style: 'italic' },
];

// Deterministic accent per slug — same slug always gets same hue.
function hueFor(slug) {
  let acc = 0;
  for (const ch of slug) acc = (acc * 31 + ch.charCodeAt(0)) % 360;
  return acc;
}

function frontmatterFields(content) {
  const block = content.match(/^---\n([\s\S]*?)\n---/);
  if (!block) return {};
  const out = {};
  for (const line of block[1].split('\n')) {
    const m = line.match(/^(\w+):\s*['"]?(.*?)['"]?$/);
    if (m) out[m[1]] = m[2].replace(/''/g, "'");
  }
  return out;
}

function titleFontSize(title) {
  if (title.length <= 28) return 108;
  if (title.length <= 48) return 88;
  if (title.length <= 72) return 68;
  return 54;
}

async function renderHero(slug, title, category) {
  const hue = hueFor(slug);
  const accent = `hsl(${hue} 70% 62%)`;
  const accentDim = `hsl(${hue} 50% 28% / 0.35)`;
  const fontSize = titleFontSize(title);

  const tree = h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#16161f',
        fontFamily: 'Space Grotesk',
        position: 'relative',
        overflow: 'hidden',
        padding: '72px 96px',
        justifyContent: 'space-between',
      },
    },
    h('div', {
      style: {
        position: 'absolute',
        width: 900,
        height: 900,
        right: -300,
        top: -300,
        borderRadius: 9999,
        background: `radial-gradient(circle, ${accentDim} 0%, transparent 65%)`,
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        right: -40,
        bottom: -120,
        fontSize: 520,
        fontWeight: 700,
        color: `hsl(${hue} 70% 62% / 0.05)`,
        lineHeight: 1,
        fontFamily: 'Space Grotesk',
      },
    }, '/'),
    // Top: category + slug
    h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontSize: 18,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: accent,
        fontWeight: 700,
      },
    },
      h('span', null, category),
      h('div', { style: { width: 36, height: 2, background: accent } }),
      h('span', { style: { color: '#6a6a7a', fontWeight: 400 } }, `/blog/${slug}`),
    ),
    // Body: title
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      },
    },
      h('div', {
        style: {
          fontSize,
          fontWeight: 700,
          color: '#f3eee2',
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          maxWidth: 1280,
        },
      }, title),
      h('div', { style: { width: 72, height: 4, background: accent } }),
    ),
    // Footer: author
    h('div', {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
        fontSize: 22,
        color: '#9a9aaa',
      },
    },
      h('span', {
        style: {
          fontFamily: 'Instrument Serif',
          fontStyle: 'italic',
          fontSize: 32,
          color: '#f3eee2',
        },
      }, 'Joseph Pire'),
      h('div', { style: { width: 4, height: 4, borderRadius: 2, background: '#3a3a4a' } }),
      h('span', null, 'josephpire.dev'),
    ),
  );

  const svg = await satori(tree, { width: WIDTH, height: HEIGHT, fonts: FONTS });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No blog content dir at ${SRC_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(SRC_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  if (files.length === 0) {
    console.log('No blog posts found — nothing to do.');
    return;
  }

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const content = readFileSync(resolve(SRC_DIR, file), 'utf-8');
    const fm = frontmatterFields(content);
    const title = fm.title ?? slug;
    const category = fm.category ?? 'Post';

    const outDir = resolve(OUT_DIR, slug);
    mkdirSync(outDir, { recursive: true });
    const outPath = resolve(outDir, 'hero.png');

    const png = await renderHero(slug, title, category);
    writeFileSync(outPath, png);
    console.log(`  ✓ ${slug} → ${outPath} (${(png.length / 1024).toFixed(1)} kB)`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
