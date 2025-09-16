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
    if (!event.data) return;
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
