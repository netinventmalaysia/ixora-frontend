"use client";

import { useEffect, useMemo, useState } from "react";

// Brand color
const PRIMARY = "#B01C2F";

// Types for beforeinstallprompt
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type Props = {
  cooldownDays?: number;
  showManualButton?: boolean;
  texts?: Partial<{
    title: string;
    desc: string;
    install: string;
    later: string;
    iosTitle: string;
    iosDesc: string;
    iosDismiss: string;
    macTitle: string;
    macDesc: string;
    macDismiss: string;
    manualButton: string;
  }>;
};

// LocalStorage keys
const DISMISS_TS_KEY = "pwa_install_dismissed_ts_v2";
const IOS_DISMISS_TS_KEY = "pwa_ios_banner_dismissed_ts_v2";
const MAC_DISMISS_TS_KEY = "pwa_mac_banner_dismissed_ts_v2";

/* ---------- Safe helpers (SSR-safe) ---------- */
function hasWindow() {
  return typeof window !== "undefined";
}
function hasStorage() {
  return typeof localStorage !== "undefined";
}
function isStandalone() {
  if (!hasWindow()) return false;
  // iOS: navigator.standalone; Others: display-mode: standalone
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}
function isIOS() {
  if (!hasWindow()) return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}
function isIPadOSLikeMac() {
  // iPadOS 13+ sometimes reports as Mac; detect touch support
  if (!hasWindow()) return false;
  // @ts-ignore
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
function isSafari() {
  if (!hasWindow()) return false;
  const ua = window.navigator.userAgent;
  const isSafariUA = /safari/i.test(ua) && !/chrome|crios|crmo|firefox|fxios|edg/i.test(ua);
  // iOS Chrome/Firefox use Safari engine but their UI can't A2HS — we only want real Safari UI
  return isSafariUA;
}
function isChromiumLike() {
  if (!hasWindow()) return false;
  const ua = navigator.userAgent.toLowerCase();
  return /chrome|crios|edg|opr/.test(ua) && !/brave/.test(ua);
}
function isMacOS() {
  if (!hasWindow()) return false;
  const p = navigator.platform?.toLowerCase() || "";
  return p.includes("mac");
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

/** ---------- 🔔 Helper untuk trigger dari luar (Hero, dsb.) ---------- */
export function triggerPWAInstall() {
  if (!hasWindow()) return;
  window.dispatchEvent(new CustomEvent("pwa:open"));
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
    iosDesc: "Di iPhone/iPad (Safari): tekan ikon Share, kemudian pilih “Add to Home Screen”.",
    iosDismiss: "Tutup",
    macTitle: "Tambah ke Dock (Safari)",
    macDesc:
      "Di macOS: dalam Safari, pergi ke menu File → Add to Dock untuk memasang web app ini.",
    macDismiss: "Tutup",
    manualButton: "Pasang Aplikasi",
    ...texts,
  };

  // State
  const [bipEvent, setBipEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false); // Chromium modal (Android/desktop)
  const [showIOS, setShowIOS] = useState(false);     // iOS/iPadOS Safari banner
  const [showMac, setShowMac] = useState(false);     // macOS Safari banner
  const [manualEnabled, setManualEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || isStandalone()) return;

    const onBIP = (e: Event) => {
      // Chrome/Edge/Android: capture and show when we want
      e.preventDefault();
      const ev = e as BeforeInstallPromptEvent;
      setBipEvent(ev);
      setManualEnabled(true);

      if (!tooSoon(DISMISS_TS_KEY, cooldownDays)) {
        // Slight delay to avoid clashing with other UI
        setTimeout(() => setShowModal(true), 1200);
      }
    };

    const onInstalled = () => {
      // Once installed, cool down all banners
      if (hasStorage()) {
        const now = String(Date.now());
        localStorage.setItem(DISMISS_TS_KEY, now);
        localStorage.setItem(IOS_DISMISS_TS_KEY, now);
        localStorage.setItem(MAC_DISMISS_TS_KEY, now);
      }
      setShowModal(false);
      setShowIOS(false);
      setShowMac(false);
      setManualEnabled(false);
      setBipEvent(null);
    };

    const onOpen = () => {
      if (isStandalone()) return;

      // iOS/iPadOS Safari
      if (isIOS() || isIPadOSLikeMac()) {
        if (isSafari()) {
          setShowIOS(true);
          return;
        }
        // iOS Chrome/Firefox can’t show real prompt; still show the instructive banner
        setShowIOS(true);
        return;
      }

      // macOS Safari (Web App “Add to Dock”)
      if (isMacOS() && isSafari()) {
        setShowMac(true);
        return;
      }

      // Chromium desktop/mobile
      if (bipEvent) {
        setShowModal(true);
        return;
      }

      // Fallback tiny notice (only if nothing available)
      alert("Pemasangan PWA belum tersedia pada pelayar ini ketika ini.");
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("pwa:open", onOpen);

    // Auto-show banners by platform (respect cooldown)
    // iOS / iPadOS banner
    if ((isIOS() || isIPadOSLikeMac()) && !isStandalone() && !tooSoon(IOS_DISMISS_TS_KEY, cooldownDays)) {
      setTimeout(() => setShowIOS(true), 1000);
    }
    // macOS Safari banner
    if (isMacOS() && isSafari() && !isStandalone() && !tooSoon(MAC_DISMISS_TS_KEY, cooldownDays)) {
      setTimeout(() => setShowMac(true), 1200);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("pwa:open", onOpen);
    };
  }, [mounted, cooldownDays, bipEvent]);

  const handleInstall = async () => {
    if (!bipEvent) return;
    setShowModal(false);
    try {
      await bipEvent.prompt();
      await bipEvent.userChoice; // accepted/dismissed
      setBipEvent(null);
    } catch {}
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

  const handleMacDismiss = () => {
    if (hasStorage()) {
      localStorage.setItem(MAC_DISMISS_TS_KEY, String(Date.now()));
    }
    setShowMac(false);
  };

  const canShowManual = useMemo(() => {
    if (!mounted || isStandalone()) return false;
    // Show on iOS/iPadOS (instructions) OR when we already captured BIP
    return showManualButton && (isIOS() || isIPadOSLikeMac() || manualEnabled || (isMacOS() && isSafari()));
  }, [mounted, manualEnabled, showManualButton]);

  if (!mounted) return null;

  return (
    <>
      {/* ANDROID / CHROMIUM MODAL */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={handleLater}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{t.desc}</p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={handleLater} className="rounded-lg border px-3 py-2 text-sm">
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

      {/* iOS / iPadOS SAFARI BANNER */}
      {showIOS && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-screen-sm rounded-t-2xl border border-gray-200 bg-white p-4 shadow-2xl"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-base font-semibold text-gray-900">{t.iosTitle}</h4>
              <p className="mt-1 text-sm text-gray-600">{t.iosDesc}</p>
              <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
                Petunjuk: buka ikon <span className="font-medium">Share</span> →{" "}
                <span className="font-medium">Add to Home Screen</span>.
              </div>
            </div>
            <button
              aria-label="Dismiss"
              onClick={handleIOSDismiss}
              className="rounded-md border px-2 py-1 text-xs text-gray-700"
            >
              {t.iosDismiss}
            </button>
          </div>
        </div>
      )}

      {/* macOS SAFARI BANNER (Web App “Add to Dock”) */}
      {showMac && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-screen-sm rounded-t-2xl border border-gray-200 bg-white p-4 shadow-2xl"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-base font-semibold text-gray-900">{t.macTitle}</h4>
              <p className="mt-1 text-sm text-gray-600">{t.macDesc}</p>
              <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
                Safari 17+: <span className="font-medium">File → Add to Dock</span>.<br />
                Tip: Pastikan <span className="font-medium">manifest</span> & <span className="font-medium">Service Worker</span> aktif.
              </div>
            </div>
            <button
              aria-label="Dismiss"
              onClick={handleMacDismiss}
              className="rounded-md border px-2 py-1 text-xs text-gray-700"
            >
              {t.macDismiss}
            </button>
          </div>
        </div>
      )}

      {/* MANUAL BUTTON (FLOATING) */}
      {canShowManual && (
        <button
          onClick={() => triggerPWAInstall()}
          className="fixed bottom-5 right-5 z-30 rounded-full px-4 py-3 text-sm font-medium text-white shadow-lg hover:opacity-95"
          style={{ background: PRIMARY, paddingBottom: "calc(env(safe-area-inset-bottom, 0px))" }}
          aria-label="Open install instructions"
        >
          {t.manualButton}
        </button>
      )}
    </>
  );
}