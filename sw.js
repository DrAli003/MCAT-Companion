// MCAT Companion — offline service worker (bump CACHE version on every deploy to bust old caches)
const CACHE = 'mcat-v7';
const APP_SHELL = [
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

// Install: pre-cache new shell, immediately take control
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches, claim all clients
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Tell open pages a new version is ready
function broadcastUpdate(){
  self.clients.matchAll({type:'window'}).then(clients=>{
    clients.forEach(c=>c.postMessage({type:'SW_UPDATED'}));
  });
}

// Strategy per request type:
//   - Navigation/HTML: network-first, fall back to cache (so new deploys load on next visit)
//   - App shell JS/CSS/manifest: stale-while-revalidate (instant now, updates in background)
//   - Other same-origin GETs: cache-first with background revalidation
//   - Cross-origin (Clarity/ntfy): never intercept (let them go to network directly)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(url.hostname !== self.location.hostname) return; // analytics pass-through
  if(e.request.method !== 'GET') return;

  const req = e.request;
  const isNavigation = req.mode === 'navigate' ||
                       (req.headers.get('accept')||'').includes('text/html');

  if(isNavigation){
    // Network-first for HTML
    e.respondWith(
      fetch(req).then(netRes => {
        const copy = netRes.clone();
        caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
        return netRes;
      }).catch(()=>caches.match(req).then(cached=>cached || caches.match('./index.html')))
    );
    return;
  }

  // Stale-while-revalidate for assets
  e.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(netRes => {
        if(netRes && netRes.status === 200){
          const copy = netRes.clone();
          caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
        }
        return netRes;
      }).catch(()=>cached);
      return cached || fetchPromise;
    })
  );
});

// When a client asks us to skip waiting (from update prompt)
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
// When this new SW becomes the controller, tell open pages to reload
self.addEventListener('controllerchange', () => {
  broadcastUpdate();
});
