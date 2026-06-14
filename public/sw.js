// Service worker for josephpire.dev.
//
// Strategy is conservative on purpose — this is a content site with a blog and
// Astro View Transitions, so stale HTML would be worse than no offline support:
//   • HTML navigations  → network-first (always fresh online), fall back to the
//                         last-cached copy, then to /offline.html.
//   • /_astro/* + fonts → cache-first (content-hashed, immutable).
//   • images            → stale-while-revalidate.
//   • everything else   → pass through (Pagefind, IndexNow, ClientRouter fetches…).
//
// Bump VERSION to invalidate all caches on the next deploy.
const VERSION = 'v1';
const STATIC_CACHE = `jp-static-${VERSION}`;
const PAGES_CACHE = `jp-pages-${VERSION}`;
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.add(OFFLINE_URL)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const keep = new Set([STATIC_CACHE, PAGES_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(k => !keep.has(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function cacheFirst(request, cacheName) {
  return caches.match(request).then(
    cached =>
      cached ||
      fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(cacheName).then(c => c.put(request, copy));
        }
        return response;
      }),
  );
}

function staleWhileRevalidate(request, cacheName) {
  return caches.match(request).then(cached => {
    const network = fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(cacheName).then(c => c.put(request, copy));
        }
        return response;
      })
      .catch(() => cached);
    return cached || network;
  });
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch cross-origin

  // Top-level navigations: network-first → cached page → offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(PAGES_CACHE).then(c => c.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match(OFFLINE_URL))),
    );
    return;
  }

  // Immutable, content-hashed assets and self-hosted fonts.
  if (url.pathname.startsWith('/_astro/') || /\.woff2?$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images: serve fast from cache, refresh in the background.
  if (/\.(png|jpe?g|webp|avif|gif|svg|ico)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Everything else falls through to the network (Pagefind, etc.).
});
