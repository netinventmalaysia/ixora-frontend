"use client";

import { useEffect, useMemo, useState } from "react";

// Tailwind primary color (MBMB red)
const PRIMARY = "#B01C2F";

// Types for beforeinstallprompt
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type Props = {
  /** Days to wait before showing popup again after user taps "Nanti" */
  cooldownDays?: number;
  /** Show a small floating manual button so users can install anytime */
  showManualButton?: boolean;
  /** Text overrides (optional) */
  texts?: Partial<{
    title: string;
    desc: string;
    install: string;
    later: string;
    iosTitle: string;
    iosDesc: string;
    iosDismiss: string;
    manualButton: string;
  }>;
};

const DISMISS_TS_KEY = "pwa_install_dismissed_ts_v1";
const IOS_DISMISS_TS_KEY = "pwa_ios_banner_dismissed_ts_v1";

/* ---------- Safe helpers (SSR-safe) ---------- */
function hasWindow() {
  return typeof window !== "undefined";
}
function hasStorage() {
  return typeof localStorage !== "undefined";
}
function isStandalone() {
  if (!hasWindow()) return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari specific
    (window.navigator as any).standalone === true
  );
}
function isIOS() {
  if (!hasWindow()) return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}
function tooSoon(key: string, days: number) {
  if (!hasStorage()) return false;
  const raw = localStorage.getItem(key);
  if (!raw) return false;
  const ts = Number(raw);
  if (!Number.isFinite(ts)) return false;
  const diffDays = (Date.now() - ts) / (1000 * 60 * 60 * 24);
  return diffDays < days;
}

export default function PWAInstallPrompt({
  cooldownDays = 3,
  showManualButton = true,
  texts,
}: Props) {
  const t = {
    title: "Pasang aplikasi?",
    desc: "Dapatkan pengalaman lebih pantas, notifikasi, dan skrin penuh.",
    install: "Pasang",
    later: "Nanti",
    iosTitle: "Tambah ke Skrin Utama",
    iosDesc:
      "Di iPhone/iPad: tekan ikon Share, kemudian pilih “Add to Home Screen”.",
    iosDismiss: "Tutup",
    manualButton: "Pasang Aplikasi",
    ...texts,
  };

  const [bipEvent, setBipEvent] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [manualEnabled, setManualEnabled] = useState(false); // only when bipEvent exists and not standalone
  const [mounted, setMounted] = useState(false); // elak kiraan semasa SSR

  // Mark mounted (client only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Setup listeners (client only)
  useEffect(() => {
    if (!mounted || isStandalone()) {
      // Already installed atau belum mount → nothing to do
      return;
    }

    const onBIP = (e: Event) => {
      e.preventDefault();
      const ev = e as BeforeInstallPromptEvent;
      setBipEvent(ev);
      setManualEnabled(true);

      // Auto show modal unless user dismissed recently
      if (!tooSoon(DISMISS_TS_KEY, cooldownDays)) {
        setTimeout(() => setShowModal(true), 1200);
      }
    };

    const onInstalled = () => {
      if (hasStorage()) {
        localStorage.setItem(DISMISS_TS_KEY, String(Date.now()));
        localStorage.setItem(IOS_DISMISS_TS_KEY, String(Date.now()));
      }
      setShowModal(false);
      setShowIOS(false);
      setManualEnabled(false);
      setBipEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    // iOS banner logic (no beforeinstallprompt)
    if (isIOS() && !tooSoon(IOS_DISMISS_TS_KEY, cooldownDays) && !isStandalone()) {
      setTimeout(() => setShowIOS(true), 1000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [mounted, cooldownDays]);

  // Handlers
  const handleInstall = async () => {
    if (!bipEvent) return;
    setShowModal(false);
    try {
      await bipEvent.prompt();
      const { outcome } = await bipEvent.userChoice;
      // After prompt, event becomes single-use
      setBipEvent(null);
      if (outcome === "dismissed") {
        // optional: set short cooldown here if wanted
      }
    } catch {
      // ignore
    }
  };

  const handleLater = () => {
    if (hasStorage()) {
      localStorage.setItem(DISMISS_TS_KEY, String(Date.now()));
    }
    setShowModal(false);
  };

  const handleIOSDismiss = () => {
    if (hasStorage()) {
      localStorage.setItem(IOS_DISMISS_TS_KEY, String(Date.now()));
    }
    setShowIOS(false);
  };

  const canShowManual = useMemo(() => {
    if (!mounted) return false;
    if (isStandalone()) return false;
    // iOS: sentiasa benarkan butang manual untuk tunjukkan banner arahan
    // Android/Chrome: benarkan jika sudah terima beforeinstallprompt
    return showManualButton && (isIOS() || manualEnabled);
  }, [mounted, manualEnabled, showManualButton]);

  // Elak rendering awal semasa SSR / sebelum mounted
  if (!mounted) return null;

  return (
    <>
      {/* ANDROID/CHROME MODAL */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{t.desc}</p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={handleLater}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                {t.later}
              </button>
              <button
                onClick={handleInstall}
                className="rounded-lg px-3 py-2 text-sm text-white"
                style={{ background: PRIMARY }}
              >
                {t.install}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS BANNER (BOTTOM SHEET) */}
      {showIOS && (
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-screen-sm rounded-t-2xl border border-gray-200 bg-white p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-2.5 w-8 shrink-0 rounded-full bg-gray-200" />
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-base font-semibold text-gray-900">
                  {t.iosTitle}
                </h4>
                <button
                  aria-label="Dismiss"
                  onClick={handleIOSDismiss}
                  className="rounded-md border px-2 py-1 text-xs text-gray-700"
                >
                  {t.iosDismiss}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-600">{t.iosDesc}</p>
              <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
                Petunjuk: Buka ikon <span className="font-medium">Share</span>{" "}
                (kotak dengan anak panah) → pilih{" "}
                <span className="font-medium">Add to Home Screen</span>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL BUTTON (FLOATING) */}
      {canShowManual && (
        <button
          onClick={() => {
            if (isIOS()) {
              setShowIOS(true);
            } else if (bipEvent) {
              setShowModal(true);
            }
          }}
          className="fixed bottom-5 right-5 z-30 rounded-full px-4 py-3 text-sm font-medium text-white shadow-lg hover:opacity-95"
          style={{ background: PRIMARY }}
        >
          {t.manualButton}
        </button>
      )}
    </>
  );
}