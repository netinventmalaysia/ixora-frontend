import { useEffect, useState } from 'react';
import { getPushPublicKey, savePushSubscription, deletePushSubscription, sendAdminTestPush } from '@/services/api';

// Helper: convert base64 VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = typeof window !== 'undefined' ? window.atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushTestPage() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);
  const [swReady, setSwReady] = useState<ServiceWorkerRegistration | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [vapid, setVapid] = useState<string>('');
  const [serverKey, setServerKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [serverMessage, setServerMessage] = useState<string>('');

  useEffect(() => {
    setSupported('serviceWorker' in navigator && 'PushManager' in window);
    setPermission(Notification.permission);
    navigator.serviceWorker.ready.then((reg) => setSwReady(reg));
  }, []);

  // Load VAPID public key from backend if available
  useEffect(() => {
    getPushPublicKey().then((k) => setServerKey(k));
  }, []);

  // If there's an existing subscription, load it so we can Unsubscribe immediately
  useEffect(() => {
    if (!swReady) return;
    swReady.pushManager.getSubscription().then((sub) => {
      if (sub) setSubscription(sub);
    }).catch(() => {});
  }, [swReady]);

  const requestPermission = async () => {
    const res = await Notification.requestPermission();
    setPermission(res);
  };

  const subscribe = async () => {
    if (!swReady) return;
    if (Notification.permission !== 'granted') {
      alert('Please grant notification permission first.');
      return;
    }
    try {
      const publicKey = vapid || serverKey || '';
      if (!publicKey) {
        alert('Missing VAPID public key. Enter one or configure the backend /push/public-key endpoint.');
        return;
      }
      if (!/^[A-Za-z0-9-_]+$/.test(publicKey) || publicKey.length < 80) {
        alert('Invalid VAPID public key format.');
        return;
      }
      const appServerKey = urlBase64ToUint8Array(publicKey);
      const sub = await swReady.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: (appServerKey as unknown as BufferSource) });
      setSubscription(sub);
      try { await savePushSubscription(sub); } catch {}
    } catch (e) {
      console.error('Subscribe failed', e);
      alert('Subscribe failed: ' + (e as any)?.message);
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;
    try {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      try { await deletePushSubscription(endpoint); } catch {}
    } finally {
      setSubscription(null);
    }
  };

  const sendLocal = () => {
    if (!swReady) return;
    swReady.active?.postMessage({ type: 'LOCAL_NOTIFY', payload: { title: 'Admin test', body: 'Hello from admin test', url: '/myskb/home' } });
  };

  const sendServer = async () => {
    setBusy(true);
    setServerMessage('');
    try {
      const res = await sendAdminTestPush({ title: 'Admin Server Push', body: 'This is a server-sent test', url: '/myskb/home' });
      setServerMessage(typeof res?.message === 'string' ? res.message : 'Requested server to send push.');
    } catch (e: any) {
      setServerMessage('Server push failed: ' + (e?.response?.data?.message || e?.message || 'Unknown error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">PWA Push Test (Admin)</h1>

      {!supported && (
        <p className="text-red-600">This browser does not support Service Worker + Push API.</p>
      )}

      <div className="space-y-4 mt-4">
        <div>
          <p className="text-sm text-gray-700">Notification permission: <span className="font-mono">{permission}</span></p>
          <button
            className="mt-2 px-3 py-1.5 rounded bg-indigo-600 text-white text-sm"
            onClick={requestPermission}
          >Request Permission</button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">VAPID Public Key (optional)</label>
          <input
            className="mt-1 w-full rounded border px-2 py-1 text-sm"
            placeholder="BASE64_URLSAFE_PUBLIC_KEY"
            value={vapid}
            onChange={(e) => setVapid(e.target.value)}
          />
          {serverKey && !vapid && (
            <p className="mt-1 text-xs text-gray-600">Using server key from /push/public-key</p>
          )}
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1.5 rounded bg-green-600 text-white text-sm"
              onClick={subscribe}
              disabled={!swReady}
            >Subscribe</button>
            <button
              className="px-3 py-1.5 rounded bg-gray-200 text-gray-900 text-sm"
              onClick={unsubscribe}
              disabled={!subscription}
            >Unsubscribe</button>
          </div>
        </div>

        <div>
          <button
            className="px-3 py-1.5 rounded bg-sky-600 text-white text-sm"
            onClick={sendLocal}
            disabled={!swReady}
          >Send Local Test Notification</button>
          <p className="mt-2 text-xs text-gray-600">This triggers the service worker to show a notification without a server push.</p>
        </div>

        {subscription && (
          <div className="mt-4">
            <p className="text-sm font-medium">Subscription JSON</p>
            <textarea
              className="mt-1 w-full h-40 rounded border p-2 text-xs font-mono"
              readOnly
              value={JSON.stringify(subscription.toJSON(), null, 2)}
            />
            <p className="text-xs text-gray-600 mt-1">Send this to your server to send real push notifications.</p>
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <p className="text-sm font-medium">Server Push Test</p>
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm"
              onClick={sendServer}
              disabled={busy}
            >Send Server Push</button>
          </div>
          {serverMessage && (
            <p className="mt-2 text-xs text-gray-700">{serverMessage}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">Requires backend endpoints: GET /push/public-key, POST /push/subscription, DELETE /push/subscription, POST /push/test</p>
        </div>
      </div>
    </div>
  );
}
