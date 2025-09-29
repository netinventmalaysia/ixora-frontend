"use client";
import { useEffect, useMemo } from "react";
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

type EVStation = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "Available" | "Occupied" | "Offline";
  ports: number;
  connectorTypes: string[];
  power: string;
  distanceKm: number;
};

// contoh mock data
const mockStations: EVStation[] = [
  {
    id: 1,
    name: "MBMB HQ EV Charger",
    address: "Menara MBMB, Ayer Keroh",
    latitude: 2.2716,
    longitude: 102.2816,
    status: "Available",
    ports: 4,
    connectorTypes: ["CCS", "Type2"],
    power: "50kW",
    distanceKm: 1.2,
  },
  {
    id: 2,
    name: "Dataran Pahlawan EV Point",
    address: "Dataran Pahlawan, Banda Hilir",
    latitude: 2.1915,
    longitude: 102.2499,
    status: "Occupied",
    ports: 2,
    connectorTypes: ["CHAdeMO"],
    power: "22kW",
    distanceKm: 3.5,
  },
  {
    id: 3,
    name: "Melaka Sentral EV Station",
    address: "Melaka Sentral",
    latitude: 2.215,
    longitude: 102.285,
    status: "Offline",
    ports: 3,
    connectorTypes: ["CCS", "Type2"],
    power: "11kW",
    distanceKm: 5.1,
  },
  {
    id: 4,
    name: "MITC EV Hub",
    address: "MITC, Ayer Keroh",
    latitude: 2.2702,
    longitude: 102.2831,
    status: "Available",
    ports: 6,
    connectorTypes: ["CCS", "Type2"],
    power: "60kW",
    distanceKm: 2.4,
  },
  {
    id: 5,
    name: "Zoo Melaka EV Charger",
    address: "Zoo Melaka",
    latitude: 2.2771,
    longitude: 102.3008,
    status: "Occupied",
    ports: 2,
    connectorTypes: ["Type2"],
    power: "22kW",
    distanceKm: 4.2,
  },
  {
    id: 6,
    name: "Aeon Bandaraya EV Point",
    address: "Aeon Bandaraya Melaka",
    latitude: 2.2256,
    longitude: 102.2785,
    status: "Available",
    ports: 4,
    connectorTypes: ["CCS"],
    power: "45kW",
    distanceKm: 2.8,
  },
  {
    id: 7,
    name: "Pantai Klebang EV Stop",
    address: "Pantai Klebang",
    latitude: 2.2162,
    longitude: 102.2036,
    status: "Offline",
    ports: 1,
    connectorTypes: ["CHAdeMO"],
    power: "11kW",
    distanceKm: 7.4,
  },
  {
    id: 8,
    name: "Masjid Selat Melaka EV Hub",
    address: "Masjid Selat Melaka",
    latitude: 2.1805,
    longitude: 102.2495,
    status: "Available",
    ports: 3,
    connectorTypes: ["CCS", "Type2"],
    power: "30kW",
    distanceKm: 6.2,
  },
  {
    id: 9,
    name: "Taman Rempah River Cruise EV",
    address: "Melaka River Cruise, Taman Rempah",
    latitude: 2.2011,
    longitude: 102.2488,
    status: "Occupied",
    ports: 2,
    connectorTypes: ["Type2"],
    power: "22kW",
    distanceKm: 3.3,
  },
  {
    id: 10,
    name: "UTeM EV Campus Charger",
    address: "Universiti Teknikal Malaysia Melaka (UTeM)",
    latitude: 2.3131,
    longitude: 102.3204,
    status: "Available",
    ports: 5,
    connectorTypes: ["CCS"],
    power: "50kW",
    distanceKm: 9.1,
  },
  {
    id: 11,
    name: "Micost EV Point",
    address: "Melaka International College of Science & Technology",
    latitude: 2.2366,
    longitude: 102.2702,
    status: "Occupied",
    ports: 2,
    connectorTypes: ["CHAdeMO"],
    power: "20kW",
    distanceKm: 2.9,
  },
  {
    id: 12,
    name: "Masjid Al-Azim EV Stop",
    address: "Masjid Al-Azim, Melaka",
    latitude: 2.2213,
    longitude: 102.2721,
    status: "Available",
    ports: 3,
    connectorTypes: ["Type2"],
    power: "25kW",
    distanceKm: 1.9,
  },
  {
    id: 13,
    name: "Freeport A’Famosa EV Hub",
    address: "Freeport A’Famosa Outlet",
    latitude: 2.4535,
    longitude: 102.1868,
    status: "Offline",
    ports: 2,
    connectorTypes: ["CCS"],
    power: "40kW",
    distanceKm: 28.0,
  },
  {
    id: 14,
    name: "Taman Mini Malaysia EV Charger",
    address: "Taman Mini Malaysia",
    latitude: 2.2729,
    longitude: 102.2851,
    status: "Available",
    ports: 4,
    connectorTypes: ["CCS", "Type2"],
    power: "55kW",
    distanceKm: 4.6,
  },
  {
    id: 15,
    name: "Hospital Melaka EV Point",
    address: "Hospital Melaka",
    latitude: 2.2141,
    longitude: 102.2768,
    status: "Occupied",
    ports: 3,
    connectorTypes: ["CHAdeMO", "Type2"],
    power: "35kW",
    distanceKm: 2.7,
  },
  {
    id: 16,
    name: "Jasin Town EV Hub",
    address: "Jasin Town Center",
    latitude: 2.3098,
    longitude: 102.4306,
    status: "Available",
    ports: 2,
    connectorTypes: ["CCS"],
    power: "22kW",
    distanceKm: 32.0,
  },
  {
    id: 17,
    name: "Alor Gajah Sentral EV Charger",
    address: "Alor Gajah Sentral",
    latitude: 2.3782,
    longitude: 102.2085,
    status: "Offline",
    ports: 1,
    connectorTypes: ["Type2"],
    power: "15kW",
    distanceKm: 20.5,
  },
  {
    id: 18,
    name: "Masjid Tanah EV Stop",
    address: "Masjid Tanah Town",
    latitude: 2.3476,
    longitude: 102.1169,
    status: "Available",
    ports: 2,
    connectorTypes: ["CCS"],
    power: "25kW",
    distanceKm: 35.0,
  },
];

const PRIMARY = "#B01C2F";

export default function EVChargersPage() {
  const stations = mockStations;

  // ✅ Fix default Leaflet marker
  useEffect(() => {
    (async () => {
      const L = (await import("leaflet")).default;
      // @ts-expect-error override internal
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    })();
  }, []);

  const bounds = useMemo<[number, number][]>(() => {
    return stations.map((s) => [s.latitude, s.longitude]);
  }, [stations]);

  // ✅ Fungsi untuk buka Google Maps
  const openDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
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
        <p className="mt-2 text-gray-600">
          Senarai lokasi pengecas kenderaan elektrik berhampiran anda
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Jumlah Stesen: <strong>{stations.length}</strong>
        </p>
      </section>

      {/* Map */}
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        <div className="relative w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-sm z-0">
          <div className="h-[600px] w-full rounded-xl overflow-hidden">
            <MapContainer
              className="h-full w-full z-0"
              bounds={bounds}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {stations.map((s) => (
                <Marker key={s.id} position={[s.latitude, s.longitude]}>
                  <Popup>
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="text-sm">{s.address}</p>
                    <p className="text-sm">
                      <strong>Kuasa:</strong> {s.power}
                    </p>
                    <p className="text-sm">
                      <strong>Jenis:</strong> {s.connectorTypes.join(", ")}
                    </p>
                    <button
                      onClick={() => openDirections(s.latitude, s.longitude)}
                      className="mt-2 w-full rounded bg-[#B01C2F] px-3 py-2 text-sm font-medium text-white hover:bg-[#951325]"
                    >
                      Get Directions →
                    </button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900">{s.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.address}</p>
              <p className="mt-2 text-sm">
                <strong>Kuasa:</strong> {s.power}
              </p>
              <p className="text-sm">
                <strong>Jenis:</strong> {s.connectorTypes.join(", ")}
              </p>
              <p className="text-sm">
                <strong>Jarak:</strong> {s.distanceKm} km
              </p>
              <button
                onClick={() => openDirections(s.latitude, s.longitude)}
                className="mt-3 w-full rounded bg-[#B01C2F] px-3 py-2 text-sm font-medium text-white hover:bg-[#951325]"
              >
                Get Directions
              </button>
            </div>
          ))}
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