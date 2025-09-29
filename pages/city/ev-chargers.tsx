// app/city/ev-chargers/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Layout from "@/components/landing-page/Layout";
import NavbarInner from "todo/components/landing-page/NavbarInner";

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

type APIStation = {
  id: number;
  name: string;
  location: string;   // address
  dun?: string;
  ac_units?: number;
  dc_units?: number;
  ac_chargers?: number;
  dc_chargers?: number;
  latitude: string | number;
  longitude: string | number;
};

type EVStation = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  dun?: string;
  acUnits: number;
  dcUnits: number;
  acChargers: number;
  dcChargers: number;
  totalUnits: number;
  totalChargers: number;
  distanceKm?: number;
};

const PRIMARY = "#B01C2F";

/** --- fallback mock (used when API fails) --- */
const mockStations: EVStation[] = [
  { id: 1, name: "MBMB HQ EV Charger", address: "Menara MBMB, Ayer Keroh", latitude: 2.2716, longitude: 102.2816, acUnits: 3, dcUnits: 1, acChargers: 1, dcChargers: 1, totalUnits: 4, totalChargers: 2, distanceKm: 1.2 },
  { id: 2, name: "Dataran Pahlawan EV Point", address: "Dataran Pahlawan, Banda Hilir", latitude: 2.1915, longitude: 102.2499, acUnits: 2, dcUnits: 0, acChargers: 1, dcChargers: 0, totalUnits: 2, totalChargers: 1, distanceKm: 3.5 },
  { id: 3, name: "Melaka Sentral EV Station", address: "Melaka Sentral", latitude: 2.215, longitude: 102.285, acUnits: 3, dcUnits: 0, acChargers: 1, dcChargers: 0, totalUnits: 3, totalChargers: 1, distanceKm: 5.1 },
  { id: 4, name: "MITC EV Hub", address: "MITC, Ayer Keroh", latitude: 2.2702, longitude: 102.2831, acUnits: 4, dcUnits: 2, acChargers: 1, dcChargers: 1, totalUnits: 6, totalChargers: 2, distanceKm: 2.4 },
];

export default function EVChargersPage() {
  const [stations, setStations] = useState<EVStation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fix default Leaflet marker
  useEffect(() => {
    (async () => {
      const L = (await import("leaflet")).default;
      // @ts-expect-error internal
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

    const fetchStations = async () => {
      try {
        const res = await fetch(`${API_BASE}/ev-charging-stations`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();

        const rows: APIStation[] = Array.isArray(json) ? (json as any) : (json?.data ?? []);
        const normalized: EVStation[] = rows
          .map((r, idx) => {
            const lat = typeof r.latitude === "string" ? parseFloat(r.latitude) : Number(r.latitude);
            const lng = typeof r.longitude === "string" ? parseFloat(r.longitude) : Number(r.longitude);
            if (!isFinite(lat) || !isFinite(lng)) return null;

            const acUnits = Number(r.ac_units ?? 0);
            const dcUnits = Number(r.dc_units ?? 0);
            const acChargers = Number(r.ac_chargers ?? 0);
            const dcChargers = Number(r.dc_chargers ?? 0);

            return {
              id: Number(r.id ?? idx + 1),
              name: r.name ?? "EV Charger",
              address: r.location ?? "-",
              latitude: lat,
              longitude: lng,
              dun: r.dun,
              acUnits,
              dcUnits,
              acChargers,
              dcChargers,
              totalUnits: acUnits + dcUnits,
              totalChargers: acChargers + dcChargers,
            } as EVStation;
          })
          .filter(Boolean) as EVStation[];

        // Add distance if allowed by user
        if (normalized.length && normalized.every((s) => s.distanceKm == null) && "geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude: uLat, longitude: uLng } = pos.coords;
              setStations(
                normalized.map((s) => ({
                  ...s,
                  distanceKm: haversine(uLat, uLng, s.latitude, s.longitude),
                }))
              );
              setLoading(false);
            },
            () => {
              setStations(normalized);
              setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000 }
          );
          return;
        }

        setStations(normalized.length ? normalized : mockStations);
      } catch {
        setStations(mockStations);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
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

  const list = stations.length ? stations : mockStations;

  const bounds = useMemo<[number, number][]>(() => {
    return list.map((s) => [s.latitude, s.longitude]);
  }, [list]);

  const openDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <Layout navbar={<NavbarInner />}>
      <Head>
        <title>Pengecas EV Bandaraya Melaka | IXORA MBMB</title>
      </Head>

      {/* Hero */}
      <section className="bg-white py-10 text-center">
        <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
          Pengecas EV Bandaraya Melaka
        </h1>
        <p className="mt-2 text-gray-600">Senarai lokasi pengecas kenderaan elektrik berhampiran anda</p>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? "Memuatkan…" : <>Jumlah Stesen: <strong>{list.length}</strong></>}
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
                {list.map((s) => (
                  <Marker key={s.id} position={[s.latitude, s.longitude]}>
                    <Popup>
                      <h3 className="font-semibold">{s.name}</h3>
                      <p className="text-sm">{s.address}</p>
                      {s.dun && (
                        <p className="text-xs text-gray-600">
                          <strong>DUN:</strong> {s.dun}
                        </p>
                      )}

                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <p><strong>AC Units:</strong> {s.acUnits}</p>
                        <p><strong>DC Units:</strong> {s.dcUnits}</p>
                        <p><strong>AC Chargers:</strong> {s.acChargers}</p>
                        <p><strong>DC Chargers:</strong> {s.dcChargers}</p>
                        <p className="col-span-2"><strong>Total Units:</strong> {s.totalUnits}</p>
                      </div>

                      <button
                        onClick={() => openDirections(s.latitude, s.longitude)}
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
          {(!loading ? list : []).map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">{s.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.address}</p>
              {s.dun && <p className="text-xs text-gray-600"><strong>DUN:</strong> {s.dun}</p>}

              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <p><strong>AC Units:</strong> {s.acUnits}</p>
                <p><strong>DC Units:</strong> {s.dcUnits}</p>
                <p><strong>AC Chargers:</strong> {s.acChargers}</p>
                <p><strong>DC Chargers:</strong> {s.dcChargers}</p>
                <p className="col-span-2"><strong>Total Units:</strong> {s.totalUnits}</p>
              </div>

              {s.distanceKm != null && (
                <p className="mt-1 text-sm">
                  <strong>Jarak:</strong> {s.distanceKm} km
                </p>
              )}

              <button
                onClick={() => openDirections(s.latitude, s.longitude)}
                className="mt-3 w-full rounded bg-[#B01C2F] px-3 py-2 text-sm font-medium text-white hover:bg-[#951325]"
              >
                Get Directions
              </button>
            </div>
          ))}
          {!loading && !list.length && (
            <div className="col-span-full text-center text-sm text-gray-600">Tiada data stesen ditemui.</div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container { z-index: 0 !important; }
      `}</style>
    </Layout>
  );
}