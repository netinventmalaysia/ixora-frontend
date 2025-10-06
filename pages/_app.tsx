import "todo/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PullToRefresh from '@/components/common/PullToRefresh';
import { BillSelectionProvider } from '@/context/BillSelectionContext';

export default function App({ Component, pageProps }: AppProps) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  // Register service worker for PWA
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    // Only register SW in production; in development, unregister to avoid HMR/cache issues
    if (process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        const hasPwa = regs.some((r) => r.active && r.active.scriptURL.endsWith('/sw.js'));
        if (!hasPwa) {
          navigator.serviceWorker.register('/sw.js').catch(() => {/* ignore */});
        }
      });
    } else {
      // Dev: ensure no service worker controls the page to prevent stale module caches
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister().catch(() => {}));
      });
    }
  }, []);
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'rounded-md bg-white px-4 py-3 shadow text-sm text-gray-800 border border-gray-200',
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ecfdf5',
            },
          },
        }}
      />
  {/* Global pull-to-refresh: dispatch a custom event that pages can handle */}
  <PullToRefresh
    noTransform
    onRefresh={async () => {
      try {
        window.dispatchEvent(new CustomEvent('ixora:pulltorefresh'));
        // Small delay to allow listeners to kick off their fetch UX
        await new Promise((r) => setTimeout(r, 200));
      } catch {}
    }}
  >
    {/* pass hydration flag to pages so they can avoid reading localStorage on SSR */}
    <BillSelectionProvider>
      <Component {...pageProps} hydrated={hydrated} />
    </BillSelectionProvider>
  </PullToRefresh>
    </>
  );
}