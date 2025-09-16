import { useEffect, useState } from 'react';
import { getPushPublicKey, savePushSubscription, deletePushSubscription, sendAdminTestPush, generatePushVapidKeys, listPushSubscriptions } from '@/services/api';
import SidebarLayout from '@/components/main/SidebarLayout';

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
  const [savedSubId, setSavedSubId] = useState<string | number | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [target, setTarget] = useState<'all' | 'me' | 'user' | 'sub'>('all');
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [targetSubId, setTargetSubId] = useState<string>('');
  const [genBusy, setGenBusy] = useState(false);
  const [genMessage, setGenMessage] = useState<string>('');
  const [generatedPublicKey, setGeneratedPublicKey] = useState<string>('');
  const [lookupUserId, setLookupUserId] = useState<string>('');
  const [subs, setSubs] = useState<any[]>([]);
  const [subsBusy, setSubsBusy] = useState(false);
  const [subsMsg, setSubsMsg] = useState<string>('');

  useEffect(() => {
    setSupported('serviceWorker' in navigator && 'PushManager' in window);
    setPermission(Notification.permission);
    navigator.serviceWorker.ready.then((reg) => setSwReady(reg));
    // get userId from localStorage if present
    try {
      const uid = localStorage.getItem('userId');
      if (uid) setMyUserId(Number(uid));
    } catch {}
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
      try {
        const res = await savePushSubscription(sub);
        const id = (res && (res.id || res.subscriptionId)) ?? null;
        if (id !== null) setSavedSubId(id);
      } catch {}
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
      const base = { title: 'Admin Server Push', body: 'This is a server-sent test', url: '/myskb/home' } as any;
      if (target === 'all') base.all = true;
      if (target === 'me') {
        if (!myUserId || Number.isNaN(myUserId)) throw new Error('No userId found in localStorage for "me" target');
        base.userId = myUserId;
      }
      if (target === 'user') {
        const uid = Number(targetUserId);
        if (!uid || Number.isNaN(uid)) throw new Error('Enter a valid userId');
        base.userId = uid;
      }
      if (target === 'sub') {
        const sid = targetSubId?.trim();
        if (!sid) throw new Error('Enter a subscriptionId');
        base.subscriptionId = /^\d+$/.test(sid) ? Number(sid) : sid;
      }
      const res = await sendAdminTestPush(base);
      setServerMessage(typeof res?.message === 'string' ? res.message : 'Requested server to send push.');
    } catch (e: any) {
      setServerMessage('Server push failed: ' + (e?.response?.data?.message || e?.message || 'Unknown error'));
    } finally {
      setBusy(false);
    }
  };

  // Quick actions: Broadcast and Send-to-me
  const sendServerAll = async () => {
    setBusy(true);
    setServerMessage('');
    try {
      const res = await sendAdminTestPush({ all: true, title: 'Admin Server Push', body: 'This is a server-sent test', url: '/myskb/home' });
      setServerMessage(typeof res?.message === 'string' ? res.message : 'Requested broadcast push.');
    } catch (e: any) {
      setServerMessage('Server push failed: ' + (e?.response?.data?.message || e?.message || 'Unknown error'));
    } finally {
      setBusy(false);
    }
  };

  const sendServerMe = async () => {
    if (!myUserId || Number.isNaN(myUserId)) {
      alert('No userId found in localStorage; cannot target "me". Try Broadcast or specify a User ID.');
      return;
    }
    setBusy(true);
    setServerMessage('');
    try {
      const res = await sendAdminTestPush({ userId: myUserId, title: 'Admin Server Push', body: 'This is a server-sent test', url: '/myskb/home' });
      setServerMessage(typeof res?.message === 'string' ? res.message : `Requested push for user ${myUserId}.`);
    } catch (e: any) {
      setServerMessage('Server push failed: ' + (e?.response?.data?.message || e?.message || 'Unknown error'));
    } finally {
      setBusy(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  const generateKeys = async () => {
    setGenBusy(true);
    setGenMessage('');
    try {
      const res = await generatePushVapidKeys();
      const pub = res?.publicKey || res?.data?.publicKey || '';
      if (pub) {
        setGeneratedPublicKey(pub);
        setServerKey(pub);
        setGenMessage('VAPID keys generated on server. Public key set for subscription. Private key is NOT shown.');
      } else {
        setGenMessage('Generated keys, but no public key found in response.');
      }
    } catch (e: any) {
      setGenMessage('Key generation failed: ' + (e?.response?.data?.message || e?.message || 'Unknown error'));
    } finally {
      setGenBusy(false);
    }
  };

  const loadSubscriptions = async (scope: 'user' | 'all') => {
    setSubsBusy(true);
    setSubsMsg('');
    try {
      let res: any;
      if (scope === 'user') {
        const uid = Number(lookupUserId || myUserId || 0);
        if (!uid || Number.isNaN(uid)) throw new Error('Enter a valid userId to lookup.');
        res = await listPushSubscriptions({ userId: uid, limit: 50, offset: 0 });
      } else {
        res = await listPushSubscriptions({ limit: 50, offset: 0 });
      }
      const arr = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : (Array.isArray(res?.items) ? res.items : []));
      setSubs(arr);
      setSubsMsg(`Loaded ${arr.length} subscription(s).`);
    } catch (e: any) {
      setSubsMsg('Load failed: ' + (e?.response?.data?.message || e?.message || 'Unknown error'));
      setSubs([]);
    } finally {
      setSubsBusy(false);
    }
  };

  const sendToSubscription = async (id: string | number) => {
    setBusy(true);
    setServerMessage('');
    try {
      const res = await sendAdminTestPush({ subscriptionId: id, title: 'Admin Server Push', body: 'This is a server-sent test', url: '/myskb/home' });
      setServerMessage(typeof res?.message === 'string' ? res.message : `Requested push for subscription ${id}.`);
    } catch (e: any) {
      setServerMessage('Server push failed: ' + (e?.response?.data?.message || e?.message || 'Unknown error'));
    } finally {
      setBusy(false);
    }
  };

  // iOS-friendly one-click enable with thorough logging and strict shape
  const enableNotifications = async () => {
    try {
      // Feature detection
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        alert('Push not supported on this browser/device.');
        return;
      }

      // Request permission from a user gesture
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        alert('Permission not granted. On iOS, ensure the app is installed to Home Screen.');
        return;
      }

      // Ensure SW is ready (already registered by _app.tsx)
      const reg = await navigator.serviceWorker.ready;

      // Fetch server key if not set
      let pk = vapid || serverKey || '';
      if (!pk) {
        pk = (await getPushPublicKey()) || '';
        setServerKey(pk);
      }
      if (!/^[A-Za-z0-9-_]+$/.test(pk) || pk.length < 80) {
        alert('Invalid or missing VAPID public key.');
        return;
      }

      const applicationServerKey = urlBase64ToUint8Array(pk);
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: (applicationServerKey as unknown as BufferSource) });

      const subJson = sub.toJSON?.() ?? sub;
      console.log('[Push] subscription.toJSON()', subJson);
      const endpointOk = !!subJson?.endpoint && typeof subJson.endpoint === 'string';
      const p256dhOk = !!subJson?.keys?.p256dh && typeof subJson.keys.p256dh === 'string';
      const authOk = !!subJson?.keys?.auth && typeof subJson.keys.auth === 'string';
      if (!endpointOk || !p256dhOk || !authOk) {
        alert('Invalid subscription returned by browser. On iOS, ensure PWA is installed to Home Screen and try again.');
        return;
      }

      setSubscription(sub);
      try {
        const res = await savePushSubscription(sub, { userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined });
        const id = (res && (res.id || res.subscriptionId)) ?? null;
        if (id !== null) setSavedSubId(id);
        setServerMessage('Subscription saved on server.');
      } catch (e: any) {
        console.error('Save subscription failed:', e);
        setServerMessage('Save subscription failed: ' + (e?.response?.data?.message || e?.message || 'Unknown error'));
      }
    } catch (e) {
      console.error('Enable push failed:', e);
      alert('Enable push failed. See console for details.');
    }
  };

  return (
    <SidebarLayout>
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
              className="px-3 py-1.5 rounded bg-teal-600 text-white text-sm"
              onClick={enableNotifications}
              disabled={!swReady}
            >Enable Notifications (iOS-friendly)</button>
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
          {savedSubId !== null && (
            <p className="mt-2 text-xs text-gray-600">Saved subscription id: <span className="font-mono">{String(savedSubId)}</span></p>
          )}
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
          <p className="text-sm font-medium">Server VAPID Keys</p>
          <p className="mt-1 text-xs text-gray-600">One-time operation. Backend should store keys securely (vault/secrets). The private key is not displayed here.</p>
          <div className="mt-2 flex gap-2 flex-wrap">
            <button
              className="px-3 py-1.5 rounded bg-slate-700 text-white text-sm"
              onClick={generateKeys}
              disabled={genBusy}
            >Generate keys (admin)</button>
            {generatedPublicKey && (
              <button
                className="px-3 py-1.5 rounded bg-slate-500 text-white text-sm"
                onClick={() => copyToClipboard(generatedPublicKey)}
              >Copy public key</button>
            )}
          </div>
          {genMessage && <p className="mt-2 text-xs text-gray-700">{genMessage}</p>}
          {generatedPublicKey && (
            <div className="mt-2">
              <label className="text-xs text-gray-700">Public Key</label>
              <input className="mt-1 w-full rounded border px-2 py-1 text-sm" readOnly value={generatedPublicKey} />
            </div>
          )}
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm font-medium">Server Push Test</p>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded border p-3">
              <label className="text-xs font-medium text-gray-700">Target</label>
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <label className="inline-flex items-center gap-2"><input type="radio" name="target" checked={target==='all'} onChange={()=>setTarget('all')} /> Broadcast (all)</label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="target" checked={target==='me'} onChange={()=>setTarget('me')} /> My User ID {myUserId ? <span className="ml-1 text-xs text-gray-600">({myUserId})</span> : <span className="ml-1 text-xs text-rose-600">(not found)</span>}</label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="target" checked={target==='user'} onChange={()=>setTarget('user')} /> Specific User ID</label>
                {target==='user' && (
                  <input className="mt-1 w-full rounded border px-2 py-1 text-sm" placeholder="e.g. 123" value={targetUserId} onChange={(e)=>setTargetUserId(e.target.value)} />
                )}
                <label className="inline-flex items-center gap-2"><input type="radio" name="target" checked={target==='sub'} onChange={()=>setTarget('sub')} /> Specific Subscription ID</label>
                {target==='sub' && (
                  <input className="mt-1 w-full rounded border px-2 py-1 text-sm" placeholder="e.g. 456 or UUID" value={targetSubId} onChange={(e)=>setTargetSubId(e.target.value)} />
                )}
              </div>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-600">Examples for POST /push/test:</p>
              <pre className="mt-2 text-[11px] bg-gray-50 border p-2 rounded overflow-auto">
{`Broadcast: { "all": true, "title": "Admin Server Push", "body": "This is a server-sent test", "url": "/myskb/home" }
Specific user: { "userId": 123, "title": "Admin Server Push", "body": "This is a server-sent test", "url": "/myskb/home" }
Specific subscription: { "subscriptionId": 456, "title": "Admin Server Push", "body": "This is a server-sent test", "url": "/myskb/home" }`}
              </pre>
              <p className="mt-2 text-xs text-gray-500">Ensure at least one subscription exists for the selected target.</p>
            </div>
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            <button
              className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm"
              onClick={sendServer}
              disabled={busy}
            >Send Server Push</button>
            <button
              className="px-3 py-1.5 rounded bg-amber-600 text-white text-sm"
              onClick={sendServerAll}
              disabled={busy}
            >Broadcast (all)</button>
            <button
              className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm"
              onClick={sendServerMe}
              disabled={busy}
            >Send to me</button>
          </div>
          {serverMessage && (
            <p className="mt-2 text-xs text-gray-700">{serverMessage}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">Requires backend endpoints: GET /push/public-key, POST /push/subscription, DELETE /push/subscription, POST /push/test</p>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm font-medium">Subscriptions (Admin)</p>
          <div className="mt-2 flex items-end gap-2 flex-wrap">
            <div>
              <label className="block text-xs text-gray-700">Lookup User ID</label>
              <input className="mt-1 w-40 rounded border px-2 py-1 text-sm" placeholder="e.g. 4" value={lookupUserId} onChange={(e)=>setLookupUserId(e.target.value)} />
            </div>
            <button className="px-3 py-1.5 rounded bg-slate-600 text-white text-sm" disabled={subsBusy} onClick={() => loadSubscriptions('user')}>Load for user</button>
            <button className="px-3 py-1.5 rounded bg-slate-500 text-white text-sm" disabled={subsBusy} onClick={() => loadSubscriptions('all')}>Load all</button>
            {subsMsg && <span className="text-xs text-gray-600">{subsMsg}</span>}
          </div>
          {subs.length > 0 && (
            <div className="mt-3 overflow-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-2 py-1 text-left">ID</th>
                    <th className="px-2 py-1 text-left">Endpoint</th>
                    <th className="px-2 py-1 text-left">User</th>
                    <th className="px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((s: any) => (
                    <tr key={String(s.id || s.subscriptionId || s.endpoint)} className="border-t">
                      <td className="px-2 py-1 font-mono">{String(s.id ?? s.subscriptionId ?? '—')}</td>
                      <td className="px-2 py-1 break-all text-gray-700">{String(s.endpoint || '—')}</td>
                      <td className="px-2 py-1">{s.userId ?? '—'}</td>
                      <td className="px-2 py-1">
                        <button className="px-2 py-1 rounded bg-emerald-600 text-white" onClick={() => sendToSubscription(s.id ?? s.subscriptionId)}>Send test</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div>
    </SidebarLayout>
  );
}
