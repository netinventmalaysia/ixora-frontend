// pages/city/parking-locations.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Layout from "@/components/landing-page/Layout";
import NavbarInner from "todo/components/landing-page/NavbarInner";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

type APIParking = {
  id: number;
  road_name: string;
  council?: string;
  latitude: number | string;
  longitude: number | string;
};

type ParkingSpot = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
};

const PRIMARY = "#B01C2F";

// Mock data sementara (boleh ganti dengan API)
const mockParking: ParkingSpot[] = [
  { id: 1, name: "01 - TAMAN KASTURI SEMABOK", address: "MBMB", latitude: 2.195106, longitude: 102.274063 },
  { id: 2, name: "02 - TAMAN SINN (SEMABOK)", address: "MBMB", latitude: 2.188809, longitude: 102.273034 },
  { id: 3, name: "03 - SEMABOK", address: "MBMB", latitude: 2.200385, longitude: 102.281734 },
  { id: 4, name: "04 - PLAZA PANDAN MALIM", address: "MBMB", latitude: 2.22891, longitude: 102.224403 },
  { id: 5, name: "05 - PERINGGIT JAYA", address: "MBMB", latitude: 2.214236, longitude: 102.253039 },
  { id: 6, name: "06 - CEMPAKA", address: "MBMB", latitude: 2.219813519, longitude: 102.249929 },
  { id: 7, name: "07 - MALINJA", address: "MBMB", latitude: 2.213329, longitude: 102.265207 },
];

export default function ParkingLocationsPage() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);

  // Betulkan icon Leaflet default
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

  // Formula jarak (km)
  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return Math.round(R * 2 * Math.asin(Math.sqrt(a)) * 10) / 10;
  };

  // Dapatkan data dari API atau fallback ke mock
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://psmbmbapi.mbmb.gov.my/api";
    const TOKEN = process.env.NEXT_PUBLIC_API_STATIC_TOKEN ?? "1|mngBh6aEXLRotqoe06ro9gMV5t9A0FR6bopb2ybe792be661";

    const fetchParking = async () => {
      try {
        if (!API_BASE) throw new Error("No API base configured");
        const res = await fetch(`${API_BASE}/parking-locations`, {
          headers: {
            Accept: "application/json",
            ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
          },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();

        const rows: APIParking[] = Array.isArray(json) ? json : (json?.data ?? []);
        const normalized: ParkingSpot[] = rows
          .map((r, idx) => {
            const lat = typeof r.latitude === "string" ? parseFloat(r.latitude) : Number(r.latitude);
            const lng = typeof r.longitude === "string" ? parseFloat(r.longitude) : Number(r.longitude);
            if (!isFinite(lat) || !isFinite(lng)) return null;

            return {
              id: Number(r.id ?? idx + 1),
              name: r.road_name ?? "Lokasi Parkir",
              address: r.council ?? "-",
              latitude: lat,
              longitude: lng,
            } as ParkingSpot;
          })
          .filter(Boolean) as ParkingSpot[];

        // Tambah jarak jika geolokasi dibenarkan
        if (normalized.length && "geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude: uLat, longitude: uLng } = pos.coords;
              setSpots(
                normalized.map((s) => ({
                  ...s,
                  distanceKm: haversine(uLat, uLng, s.latitude, s.longitude),
                }))
              );
              setLoading(false);
            },
            () => {
              setSpots(normalized);
              setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000 }
          );
          return;
        }

        setSpots(normalized.length ? normalized : mockParking);
      } catch {
        setSpots(mockParking);
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, []);

  const list = spots.length ? spots : mockParking;
  const bounds = useMemo<[number, number][]>(() => list.map((s) => [s.latitude, s.longitude]), [list]);

  const openDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <Layout navbar={<NavbarInner />}>
      <Head>
        <title>Lokasi Parkir MBMB | IXORA MBMB</title>
      </Head>

      {/* Hero */}
      <section className="bg-white py-10 text-center">
        <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
          Lokasi Parkir MBMB
        </h1>
        <p className="mt-2 text-gray-600">Senarai lokasi parkir awam di bawah Majlis Bandaraya Melaka Bersejarah</p>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? "Memuatkan…" : <>Jumlah Lokasi: <strong>{list.length}</strong></>}
        </p>
      </section>

      {/* Peta */}
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        <div className="relative w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-sm z-0">
          <div className="h-[600px] w-full rounded-xl overflow-hidden">
            {!!bounds.length && (
              <MapContainer className="h-full w-full z-0" bounds={bounds} scrollWheelZoom>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {list.map((s) => (
                  <Marker key={s.id} position={[s.latitude, s.longitude]}>
                    <Popup>
                      <h3 className="font-semibold">{s.name}</h3>
                      <p className="text-sm">{s.address}</p>
                      {s.distanceKm && (
                        <p className="text-xs text-gray-600">
                          <strong>Jarak:</strong> {s.distanceKm} km
                        </p>
                      )}
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

        {/* Kad Lokasi */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(!loading ? list : []).map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900">{s.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.address}</p>
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
            <div className="col-span-full text-center text-sm text-gray-600">Tiada lokasi ditemui.</div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          z-index: 0 !important;
        }
      `}</style>
    </Layout>
  );
}