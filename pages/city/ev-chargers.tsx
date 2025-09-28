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
};

// Mock data
const mockStations: EVStation[] = [
  {
    id: 1,
    name: "EV Station A",
    address: "Menara MBMB, Ayer Keroh",
    latitude: 2.2716,
    longitude: 102.2816,
    status: "Available",
    ports: 4,
    connectorTypes: ["CCS", "Type2"],
    power: "50kW",
  },
  {
    id: 2,
    name: "EV Station B",
    address: "Dataran Pahlawan, Banda Hilir",
    latitude: 2.1915,
    longitude: 102.2499,
    status: "Occupied",
    ports: 2,
    connectorTypes: ["CHAdeMO"],
    power: "22kW",
  },
  {
    id: 3,
    name: "EV Station C",
    address: "Melaka Sentral",
    latitude: 2.215,
    longitude: 102.285,
    status: "Offline",
    ports: 3,
    connectorTypes: ["CCS", "Type2"],
    power: "11kW",
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

  const statusClass = (s: EVStation["status"]) =>
    s === "Available"
      ? "text-green-600"
      : s === "Occupied"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <Layout navbar={<NavbarInner />}>
      <Head>
        <title>Pengecas EV Bandaraya Melaka | IXORA MBMB</title>
      </Head>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200 py-10 text-center">
        <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
          Pengecas EV Bandaraya Melaka
        </h1>
        <p className="mt-2 text-gray-600">
          Senarai lokasi & status pengecas kenderaan elektrik
        </p>
      </section>

      {/* Map */}
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        <div className="relative w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div className="h-[600px] w-full rounded-xl overflow-hidden">
            <MapContainer
              className="h-full w-full"
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
                      <strong>Status:</strong>{" "}
                      <span className={statusClass(s.status)}>{s.status}</span>
                    </p>
                    <p className="text-sm">
                      <strong>Port:</strong> {s.ports}
                    </p>
                    <p className="text-sm">
                      <strong>Jenis:</strong> {s.connectorTypes.join(", ")}
                    </p>
                    <p className="text-sm">
                      <strong>Kuasa:</strong> {s.power}
                    </p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/90 px-3 py-2 text-xs shadow">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
              <span>Available</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-600" />
              <span>Occupied</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
              <span>Offline</span>
            </div>
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
                <strong>Status:</strong>{" "}
                <span className={`font-medium ${statusClass(s.status)}`}>
                  {s.status}
                </span>
              </p>
              <p className="text-sm">
                <strong>Port:</strong> {s.ports}
              </p>
              <p className="text-sm">
                <strong>Jenis:</strong> {s.connectorTypes.join(", ")}
              </p>
              <p className="text-sm">
                <strong>Kuasa:</strong> {s.power}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
