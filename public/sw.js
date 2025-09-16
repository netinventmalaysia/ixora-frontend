// Basic service worker for PWA offline support
const CACHE_NAME = 'ixora-mbmb-cache-v1';
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
    // Only handle GET requests for caching — Cache API does not support POST/PUT/etc.
    if (req.method !== 'GET') return;
    // Skip caching Next.js dev assets and HMR endpoints
    const url = new URL(req.url);
    if (url.pathname.startsWith('/_next/') || url.pathname.includes('__next')) {
        return; // let the network handle it
    }
    // Network-first for navigation, cache-first for same-origin static assets
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req).catch(() => caches.match('/'))
        );
        return;
    }
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(req).then((cached) => cached || fetch(req).then((res) => {
                // Cache successful basic responses only
                if (res && res.status === 200 && (res.type === 'basic' || res.type === 'opaque')) {
                    const resClone = res.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        // Cache.put only supports GET requests (already ensured above)
                        cache.put(req, resClone).catch(() => { });
                    });
                }
                return res;
            }).catch(() => cached))
        );
    }
});

// --- Push notifications (test hooks) ---
self.addEventListener('push', (event) => {
    // Expect event.data.json() or text; provide sensible defaults for testing
    let data = {};
    try {
        data = event.data ? (event.data.json ? event.data.json() : { body: event.data.text() }) : {};
    } catch (e) {
        // fallback to raw text
        data = { body: event.data && event.data.text ? event.data.text() : 'New notification' };
    }

    const title = data.title || 'Ixora MBMB Notification';
    const body = data.body || 'This is a test push notification.';
    const url = data.url || '/';
    const icon = data.icon || '/images/logo.png';

    const options = {
        body,
        icon,
        badge: icon,
        data: { url },
        vibrate: [100, 50, 100],
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'dismiss', title: 'Dismiss' },
        ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
    if (event.action === 'dismiss') return;
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});

// Allow the page to message the SW to show a local test notification without a push server
self.addEventListener('message', (event) => {
    if (!event || !event.data) return;
    if (event.data.type === 'LOCAL_NOTIFY') {
        const { title = 'Test Notification', body = 'Hello from Ixora MBMB', url = '/' } = event.data.payload || {};
        event.waitUntil(
            self.registration.showNotification(title, {
                body,
                icon: '/images/logo.png',
                data: { url },
            })
        );
    }
});
