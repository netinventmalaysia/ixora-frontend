import { useEffect, useState } from 'react';

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

  useEffect(() => {
    setSupported('serviceWorker' in navigator && 'PushManager' in window);
    setPermission(Notification.permission);
    navigator.serviceWorker.ready.then((reg) => setSwReady(reg));
  }, []);

  const requestPermission = async () => {
    const res = await Notification.requestPermission();
    setPermission(res);
  };

  const subscribe = async () => {
    if (!swReady) return;
    try {
      const appServerKey = vapid ? urlBase64ToUint8Array(vapid) : undefined;
      const sub = await swReady.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appServerKey });
      setSubscription(sub);
    } catch (e) {
      console.error('Subscribe failed', e);
      alert('Subscribe failed: ' + (e as any)?.message);
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;
    await subscription.unsubscribe();
    setSubscription(null);
  };

  const sendLocal = () => {
    if (!swReady) return;
    swReady.active?.postMessage({ type: 'LOCAL_NOTIFY', payload: { title: 'Admin test', body: 'Hello from admin test', url: '/myskb/home' } });
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
      </div>
    </div>
  );
}
