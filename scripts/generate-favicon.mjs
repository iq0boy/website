// Generates the favicon set into public/ from a single Satori-rendered mark:
//   favicon.svg          — scalable, primary (self-contained vector glyph)
//   favicon.ico          — 16+32 PNG-in-ICO, legacy fallback
//   apple-touch-icon.png — 180, full-bleed (iOS applies its own mask)
//   icon-192.png / icon-512.png — PWA / manifest
//
// The mark echoes the "Joseph." wordmark: an Instrument Serif "J" in cream
// with the gold accent dot, on the brand-dark tile.
//
// Run with: node scripts/generate-favicon.mjs

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement as h } from 'react';

const ROOT = resolve(process.cwd());
const OUT = resolve(ROOT, 'public');

const BG = '#1a1816';
const CREAM = '#ece9e1';
const GOLD = '#c89a5e';

const serif = readFileSync(
  resolve(ROOT, 'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff'),
);
const FONTS = [{ name: 'Instrument Serif', data: serif, weight: 400, style: 'normal' }];

// One render at a generous base size; everything else is rasterised from it.
function tree({ rounded }) {
  return h(
    'div',
    {
      style: {
        width: 256,
        height: 256,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: BG,
        borderRadius: rounded ? 56 : 0,
      },
    },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'flex-end', marginBottom: 30 } },
      h('div', { style: { fontFamily: 'Instrument Serif', fontSize: 210, color: CREAM, lineHeight: 1 } }, 'J'),
      h('div', { style: { width: 26, height: 26, borderRadius: 13, background: GOLD, marginLeft: 6, marginBottom: 14 } }),
    ),
  );
}

async function svg({ rounded }) {
  return satori(tree({ rounded }), { width: 256, height: 256, fonts: FONTS });
}

function pngToIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = 6 + count * 16;
  const entries = pngs.map(({ size, buffer }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buffer.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buffer.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map(p => p.buffer)]);
}

async function main() {
  const roundedSvg = await svg({ rounded: true });
  const squareSvg = await svg({ rounded: false });

  // Primary scalable favicon — Satori already emits a viewBox, so browsers
  // scale it crisply as-is.
  writeFileSync(resolve(OUT, 'favicon.svg'), roundedSvg);

  const png = (src, size) => sharp(Buffer.from(src)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

  // ICO: 16 + 32 from the rounded mark.
  const ico = pngToIco([
    { size: 16, buffer: await png(roundedSvg, 16) },
    { size: 32, buffer: await png(roundedSvg, 32) },
  ]);
  writeFileSync(resolve(OUT, 'favicon.ico'), ico);

  // Apple touch icon — full-bleed square (iOS rounds it itself).
  writeFileSync(resolve(OUT, 'apple-touch-icon.png'), await png(squareSvg, 180));

  // PWA / manifest icons — square so they work as maskable too.
  writeFileSync(resolve(OUT, 'icon-192.png'), await png(squareSvg, 192));
  writeFileSync(resolve(OUT, 'icon-512.png'), await png(squareSvg, 512));

  console.log('  ✓ favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
