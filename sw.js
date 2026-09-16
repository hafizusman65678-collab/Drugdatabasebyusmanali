/* PharmaDrug Service Worker — offline-first cache */
const CACHE_NAME = 'pharmadrug-v8';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './auth.js',
  './config.js',
  './manifest.json',
  './data/drugs.js',
  './data/drugs-extra.js',
  './data/drugs-classes.js',
  './data/interactions.js',
  './data/glossary.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/logo.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of ASSETS) {
        try { await cache.add(url); } catch (e) { /* skip missing */ }
      }
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
