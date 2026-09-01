#!/usr/bin/env node
// Serves dist/ with the generated Content-Security-Policy applied, so the
// policy can be exercised locally. `astro preview` ignores _headers, and a CSP
// that is only ever tested in production is a CSP that breaks in production.
//
//   node scripts/generate-csp.mjs && node scripts/serve-csp.mjs [port]

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const DIST = resolve('dist');
const PORT = Number(process.argv[2] ?? 4321);

const csp = readFileSync(join(DIST, '_headers'), 'utf-8')
  .match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1];
if (!csp) {
  console.error('✗ no Content-Security-Policy in dist/_headers — run scripts/generate-csp.mjs first');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.wasm': 'application/wasm', '.xml': 'application/xml', '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json', '.xsl': 'application/xslt+xml',
  '.pf_fragment': 'application/octet-stream', '.pf_index': 'application/octet-stream',
  '.pf_meta': 'application/octet-stream',
};

function resolveFile(pathname) {
  const candidates = [
    join(DIST, pathname),
    join(DIST, pathname, 'index.html'),
    join(DIST, `${pathname}.html`),
  ];
  return candidates.find(p => existsSync(p) && statSync(p).isFile());
}

createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = resolveFile(pathname);
  if (!file) {
    const notFound = join(DIST, '404.html');
    const body = existsSync(notFound) ? readFileSync(notFound) : 'Not found';
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': csp });
    return res.end(body);
  }
  res.writeHead(200, {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
    'Content-Security-Policy': csp,
  });
  res.end(readFileSync(file));
}).listen(PORT, () => console.log(`serving dist/ with CSP on http://localhost:${PORT}`));
