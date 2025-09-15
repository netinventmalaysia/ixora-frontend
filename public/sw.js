// Basic service worker for PWA offline support
const CACHE_NAME = 'ixora-cache-v1';
const ASSETS = [
    '/',
    '/favicon.ico',
    '/manifest.json',
    '/images/logo.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    // Network-first for navigation, cache-first for same-origin static assets
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req).catch(() => caches.match('/'))
        );
        return;
    }
    if (new URL(req.url).origin === self.location.origin) {
        event.respondWith(
            caches.match(req).then((cached) => cached || fetch(req).then((res) => {
                const resClone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
                return res;
            }))
        );
    }
});
