// MCAT Companion — offline service worker. Cache all three visual themes and their local assets.
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './theme-shell.css',
  './neuro.css',
  './floral-theme.css',
  './hero-refine.css',
  './responsive-neuro.css',
  './neural.js',
  './app.js',
  './data.js',
  './data2.js',
  './structures.js',
  './extras.js',
  './manifest.webmanifest',
  './manifest-floral.webmanifest',
  './favicon.png',
  './favicon-floral.png',
  './icon-192.png',
  './icon-192-floral.png',
  './icon-512.png',
  './icon-512-floral.png',
  './apple-touch-icon.png',
  './apple-touch-icon-floral.png',
  './icon-maskable-512.png',
  './icon-maskable-512-floral.png',
  './logo.png',
  './logo-floral.png',
  './assets/brain-bg.jpg',
  './assets/hero-atlas.jpg',
  './assets/hero-atlas-floral.jpg',
  './assets/floral-neuro-pattern.jpg',
  './assets/dr-leen-icon-floral.png',
  './assets/fonts/Amiri-Arabic-Bold.woff2',
  './assets/fonts/Amiri-Arabic-Regular.woff2',
  './assets/fonts/DancingScript-Latin.woff2',
  './assets/fonts/Nunito-Latin.woff2',
  './assets/fonts/PlayfairDisplay-Latin.woff2'
];
const CACHE = 'mcat-v21-combined-themes';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

function broadcastUpdate(){
  self.clients.matchAll({type:'window'}).then(clients => {
    clients.forEach(client => client.postMessage({type:'SW_UPDATED'}));
  });
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(url.hostname !== self.location.hostname || event.request.method !== 'GET') return;
  const request = event.request;
  const isNavigation = request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if(isNavigation){
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
        return response;
      }).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const update = fetch(request).then(response => {
        if(response && response.status === 200){
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
        }
        return response;
      }).catch(() => cached);
      return cached || update;
    })
  );
});

self.addEventListener('message', event => {
  if(event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('controllerchange', broadcastUpdate);
