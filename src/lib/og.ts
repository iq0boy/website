import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement as h } from 'react';

const fontBold = readFileSync(
  resolve('./node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff')
);
const fontRegular = readFileSync(
  resolve('./node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff')
);

const FONTS = [
  { name: 'Space Grotesk', data: fontBold, weight: 700 as const },
  { name: 'Space Grotesk', data: fontRegular, weight: 400 as const },
];

function titleFontSize(title: string): number {
  if (title.length <= 32) return 68;
  if (title.length <= 52) return 56;
  if (title.length <= 72) return 46;
  return 38;
}

async function toBuffer(element: unknown): Promise<Buffer> {
  const svg = await satori(element as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: FONTS,
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export async function buildDefaultOg(): Promise<Buffer> {
  return toBuffer(
    h('div', {
      style: {
        width: '100%', height: '100%',
        background: '#1a1a29',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px 80px 64px',
        fontFamily: 'Space Grotesk',
        overflow: 'hidden',
        position: 'relative',
      },
    },
      h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: '#c89a5e' } }),
      h('div', { style: { position: 'absolute', right: -20, bottom: -60, fontSize: 380, fontWeight: 700, color: 'rgba(200,154,94,0.04)', lineHeight: 1 } }, 'JP'),
      h('div', { style: { fontSize: 18, fontWeight: 400, color: '#c89a5e', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 } }, 'Full-Stack Developer & Designer'),
      h('div', { style: { fontSize: 96, fontWeight: 700, color: '#ece9e1', lineHeight: 1, marginBottom: 32, letterSpacing: '-0.02em' } }, 'Joseph Pire'),
      h('div', { style: { width: 56, height: 3, background: '#c89a5e', marginBottom: 32 } }),
      h('div', { style: { fontSize: 22, fontWeight: 400, color: '#6a6a7a', letterSpacing: '0.02em' } }, 'josephpire.dev'),
    )
  );
}

export async function buildPostOg(title: string, category: string, lang: 'fr' | 'en' | 'nl' = 'fr'): Promise<Buffer> {
  const fontSize = titleFontSize(title);
  const langLabel = lang.toUpperCase();
  return toBuffer(
    h('div', {
      style: {
        width: '100%', height: '100%',
        background: '#1a1a29',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 80px 64px',
        fontFamily: 'Space Grotesk',
        overflow: 'hidden',
        position: 'relative',
      },
    },
      h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: '#c89a5e' } }),
      // Lang chip in the top-right corner
      h('div', {
        style: {
          position: 'absolute',
          top: 36,
          right: 72,
          padding: '6px 14px',
          border: '1px solid #c89a5e',
          color: '#c89a5e',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.2em',
          borderRadius: 999,
        },
      }, langLabel),
      h('div', {
        style: { fontSize: 15, fontWeight: 700, color: '#c89a5e', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 36 },
      }, category),
      h('div', {
        style: { fontSize, fontWeight: 700, color: '#ece9e1', lineHeight: 1.2, letterSpacing: '-0.01em', flex: 1 },
      }, title),
      h('div', { style: { width: 56, height: 3, background: '#c89a5e', marginBottom: 24 } }),
      h('div', {
        style: { display: 'flex', alignItems: 'center', gap: 14, fontSize: 18, fontWeight: 400, color: '#6a6a7a' },
      },
        h('div', null, 'Joseph Pire'),
        h('div', { style: { width: 4, height: 4, borderRadius: 2, background: '#3a3a4a' } }),
        h('div', null, 'josephpire.dev'),
      ),
    )
  );
}
