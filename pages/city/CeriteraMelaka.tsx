// pages/city/CeriteraMelaka.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import Head from "next/head";
import { Maximize2, ExternalLink } from "lucide-react";
import Layout from "@/components/landing-page/Layout";
import NavbarInner from "todo/components/landing-page/NavbarInner";

const PRIMARY = "#B01C2F";

export default function CeriteraMelakaPage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Fungsi buka fullscreen
  const goFullscreen = () => {
    const el = iframeRef.current as any;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  // Fokus ke iframe selepas load
  useEffect(() => {
    if (loaded) iframeRef.current?.focus();
  }, [loaded]);

  return (
    <Layout navbar={<NavbarInner />}>
      <Head>
        <title>Ceritera Melaka (360°) | IXORA MBMB</title>
        <meta
          name="description"
          content="Jelajah pengalaman 360° Ceritera Melaka secara interaktif terus dari portal IXORA MBMB."
        />
      </Head>

      {/* Tajuk utama */}
      <section className="bg-white py-10 text-center">
        <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
          Ceritera Melaka
        </h1>
        <p className="mt-2 text-gray-600">
          Jelajah interaktif mercu tanda dan warisan Bandaraya Melaka.
        </p>
      </section>

      {/* Kawasan utama dengan butang & iframe */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10 pb-12">
        {/* Baris butang kawalan */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">
              Paparan Interaktif 360°
            </h2>
            <p className="text-sm text-gray-600">
              Gunakan butang di kanan untuk pengalaman paparan penuh atau tab baharu.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://360vr.my/ceriterambmb/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4" />
              Buka di tab baharu
            </a>
            <button
              type="button"
              onClick={goFullscreen}
              className="inline-flex items-center gap-2 rounded-lg bg-[#B01C2F] px-3 py-2 text-sm font-medium text-white hover:opacity-95"
            >
              <Maximize2 className="h-4 w-4" />
              Fullscreen
            </button>
          </div>
        </div>

        {/* Frame utama */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border shadow-sm">
          {!loaded && (
            <div className="pointer-events-none absolute inset-0 animate-pulse bg-gray-100" />
          )}
          <iframe
            ref={iframeRef}
            title="Ceritera Melaka 360"
            src="https://360vr.my/ceriterambmb/"
            onLoad={() => setLoaded(true)}
            className="h-[75vh] w-full rounded-2xl"
            allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <p className="mt-3 text-xs text-gray-500 text-center">
          Jika paparan tidak muncul, klik “Buka di tab baharu”. Sesetengah pelayar mungkin menyekat iframe.
        </p>
      </div>
    </Layout>
  );
}