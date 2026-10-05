// MCAT Companion — offline service worker
const CACHE = 'mcat-v6';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.js',
  './data2.js',
  './structures.js',
  './extras.js',
  './manifest.webmanifest',
  './favicon.svg',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './icon-maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Cache-first for same-origin requests; network pass-through for Clarity/ntfy (analytics must reach server)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never intercept analytics/third-party
  if(url.hostname !== self.location.hostname) return;
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        // Only cache successful same-origin GETs
        if(res && res.status === 200){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
        }
        return res;
      }).catch(() => cached);
    })
  );
});
