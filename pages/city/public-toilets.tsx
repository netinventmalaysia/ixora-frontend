// app/city/toilet-facilities/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Layout from "@/components/landing-page/Layout";
import NavbarInner from "todo/components/landing-page/NavbarInner";

// Leaflet (SSR off)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

type APIRow = {
  id: number;
  toilet_name: string;
  toilet_type: string;
  dun?: string;
  accessibility_oku?: 0 | 1;
  accessibility_baby?: 0 | 1;
  accessibility_pray?: 0 | 1;
  status?: "open" | "closed" | string;
  cleanliness?: number;
  latitude: string | number;
  longitude: string | number;
};

type ToiletItem = {
  id: number;
  name: string;
  type: string;
  dun?: string;
  latitude: number;
  longitude: number;
  status: "open" | "closed" | "unknown";
  cleanliness: number; // 0..5
  oku: boolean;
  baby: boolean;
  pray: boolean;
  distanceKm?: number;
};

const PRIMARY = "#B01C2F";

/** Fallback mock (jika API gagal) */
const mockToilets: ToiletItem[] = [
  { id: 1, name: "Medan Selera Taman Desa Taming Sari", type: "Tandas Awam", dun: "3", latitude: 2.286131, longitude: 102.133778, status: "open", cleanliness: 5, oku: false, baby: false, pray: false },
  { id: 2, name: "Medan Selera Bandar Baru Sungai Udang", type: "Tandas Awam", dun: "3", latitude: 2.290788, longitude: 102.140558, status: "open", cleanliness: 5, oku: false, baby: false, pray: false },
  { id: 3, name: "MBMB Taman Keris Mas", type: "Tandas Awam", dun: "3", latitude: 2.290639, longitude: 102.131748, status: "open", cleanliness: 5, oku: false, baby: false, pray: false },
  { id: 4, name: "Medan Selera Taman Terendak Permai", type: "Tandas Awam", dun: "3", latitude: 2.285138, longitude: 102.129348, status: "open", cleanliness: 5, oku: false, baby: false, pray: false },
];

export default function ToiletFacilitiesPage() {
  const [items, setItems] = useState<ToiletItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fix default Leaflet marker
  useEffect(() => {
    (async () => {
      const L = (await import("leaflet")).default;
      // @ts-expect-error override
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    })();
  }, []);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://psmbmbapi.mbmb.gov.my/api";
    const TOKEN = process.env.NEXT_PUBLIC_API_STATIC_TOKEN ?? "1|mngBh6aEXLRotqoe06ro9gMV5t9A0FR6bopb2ybe792be661";

    const fetchToilets = async () => {
      try {
        const res = await fetch(`${API_BASE}/toilets`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();

        const rows: APIRow[] = Array.isArray(json) ? json : (json?.data ?? []);
        const normalized: ToiletItem[] = rows
          .map((r, idx) => {
            const lat = typeof r.latitude === "string" ? parseFloat(r.latitude) : Number(r.latitude);
            const lng = typeof r.longitude === "string" ? parseFloat(r.longitude) : Number(r.longitude);
            if (!isFinite(lat) || !isFinite(lng)) return null;

            const status: ToiletItem["status"] = r.status === "open" || r.status === "closed" ? r.status : "unknown";
            const cleanliness = Math.max(0, Math.min(5, Number(r.cleanliness ?? 0)));

            return {
              id: Number(r.id ?? idx + 1),
              name: r.toilet_name ?? "Tandas Awam",
              type: r.toilet_type ?? "-",
              dun: r.dun,
              latitude: lat,
              longitude: lng,
              status,
              cleanliness,
              oku: Boolean(r.accessibility_oku),
              baby: Boolean(r.accessibility_baby),
              pray: Boolean(r.accessibility_pray),
            } as ToiletItem;
          })
          .filter(Boolean) as ToiletItem[];

        if (normalized.length && normalized.every((s) => s.distanceKm == null) && "geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude: uLat, longitude: uLng } = pos.coords;
              setItems(
                normalized.map((s) => ({
                  ...s,
                  distanceKm: haversine(uLat, uLng, s.latitude, s.longitude),
                }))
              );
              setLoading(false);
            },
            () => {
              setItems(normalized);
              setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000 }
          );
          return;
        }

        setItems(normalized.length ? normalized : mockToilets);
      } catch {
        setItems(mockToilets);
      } finally {
        setLoading(false);
      }
    };

    fetchToilets();
  }, []);

  // Haversine (km)
  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return Math.round(R * 2 * Math.asin(Math.sqrt(a)) * 10) / 10;
  };

  const list = items.length ? items : mockToilets;

  const bounds = useMemo<[number, number][]>(() => {
    return list.map((t) => [t.latitude, t.longitude]);
  }, [list]);

  const openDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  // const statusPill = (s: ToiletItem["status"]) => {
  //   if (s === "open") return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Dibuka</span>;
  //   if (s === "closed") return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Ditutup</span>;
  //   return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">Tidak pasti</span>;
  // };

  const stars = (n: number) => {
    const full = "★".repeat(Math.max(0, Math.min(5, Math.round(n))));
    const empty = "☆".repeat(5 - full.length);
    return (
      <span className="font-medium tracking-tight" aria-label={`${n}/5`}>
        {full}
        <span className="text-gray-400">{empty}</span>
      </span>
    );
  };

  return (
    <Layout navbar={<NavbarInner />}>
      <Head>
        <title>Kemudahan Tandas Awam | IXORA MBMB</title>
      </Head>

      {/* Hero */}
      <section className="bg-white py-10 text-center">
        <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
          Kemudahan Tandas Awam
        </h1>
        <p className="mt-2 text-gray-600">Lokasi, status & penarafan kebersihan berhampiran anda</p>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? "Memuatkan…" : <>Jumlah Lokasi: <strong>{list.length}</strong></>}
        </p>
      </section>

      {/* Map */}
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        <div className="relative w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-sm z-0">
          <div className="h-[600px] w-full rounded-xl overflow-hidden">
            {!!bounds.length && (
              <MapContainer className="h-full w-full z-0" bounds={bounds} scrollWheelZoom>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {list.map((t) => (
                  <Marker key={t.id} position={[t.latitude, t.longitude]}>
                    <Popup>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-xs text-gray-600">{t.type}</p>
                      {t.dun && <p className="mt-1 text-xs text-gray-600"><strong>DUN:</strong> {t.dun}</p>}

                      <div className="mt-2 flex items-center gap-2">
                        {/* {statusPill(t.status)} */}
                        <span className="text-sm">{stars(t.cleanliness)}</span>
                        <span className="text-xs text-gray-600">Kebersihan {t.cleanliness}/5</span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                        <span className={`rounded px-2 py-0.5 ${t.oku ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>OKU</span>
                        <span className={`rounded px-2 py-0.5 ${t.baby ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>Baby</span>
                        <span className={`rounded px-2 py-0.5 ${t.pray ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>Surau</span>
                      </div>

                      <button
                        onClick={() => openDirections(t.latitude, t.longitude)}
                        className="mt-3 w-full rounded bg-[#B01C2F] px-3 py-2 text-sm font-medium text-white hover:bg-[#951325]"
                      >
                        Get Directions →
                      </button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(!loading ? list : []).map((t) => (
            <div key={t.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{t.type}</p>
                  {t.dun && <p className="text-xs text-gray-600"><strong>DUN:</strong> {t.dun}</p>}
                </div>
                {/* <div className="shrink-0">{statusPill(t.status)}</div> */}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm">{stars(t.cleanliness)}</span>
                <span className="text-xs text-gray-600">({t.cleanliness}/5)</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className={`rounded px-2 py-0.5 ${t.oku ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>OKU</span>
                <span className={`rounded px-2 py-0.5 ${t.baby ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>Baby</span>
                <span className={`rounded px-2 py-0.5 ${t.pray ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>Surau</span>
              </div>

              {t.distanceKm != null && (
                <p className="mt-2 text-sm"><strong>Jarak:</strong> {t.distanceKm} km</p>
              )}

              <button
                onClick={() => openDirections(t.latitude, t.longitude)}
                className="mt-3 w-full rounded bg-[#B01C2F] px-3 py-2 text-sm font-medium text-white hover:bg-[#951325]"
              >
                Get Directions
              </button>
            </div>
          ))}
          {!loading && !list.length && (
            <div className="col-span-full text-center text-sm text-gray-600">Tiada data kemudahan ditemui.</div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container { z-index: 0 !important; }
      `}</style>
    </Layout>
  );
}