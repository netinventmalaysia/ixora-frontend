// components/landing-page/DigitalEnergyMapSection.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PRIMARY = "#B01C2F";

export default function DigitalEnergyMapSection() {
  const [series, setSeries] = useState([
    {
      name: "Lesen Perniagaan",
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 90) + 10),
    },
    {
      name: "Cukai Taksiran",
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
    },
    {
      name: "Kompaun",
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 80)),
    },
    {
      name: "Sewaan Gerai",
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 70)),
    },
    {
      name: "Permit Sementara",
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 60)),
    },
  ]);

  const [todayTransactions, setTodayTransactions] = useState(1248);
  const [activeUsers, setActiveUsers] = useState(412);
  const [pulse, setPulse] = useState(false);

  // Pulse animasi (simulasi transaksi baharu)
  useEffect(() => {
    const interval = setInterval(() => {
      setTodayTransactions((v) => v + Math.floor(Math.random() * 3));
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "heatmap",
      background: "transparent",
      toolbar: { show: false },
      animations: { enabled: true },
    },
    colors: ["#E6691F", "#B01C2F", "#00A7A6", "#005C76", "#F3A712"],
    dataLabels: { enabled: false },
    title: {
      text: "Denyut Tenaga Digital MBMB",
      style: { color: PRIMARY, fontSize: "18px", fontWeight: 600 },
    },
    xaxis: {
      type: "category",
      categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      labels: { style: { colors: "#64748B", fontSize: "10px" } },
    },
    yaxis: {
      labels: { style: { colors: "#334155", fontWeight: 500 } },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.7,
        radius: 5,
        enableShades: true,
        colorScale: {
          ranges: [
            { from: 0, to: 25, color: "#E2E8F0", name: "Low" },
            { from: 26, to: 50, color: "#00A7A6", name: "Medium" },
            { from: 51, to: 75, color: "#E6691F", name: "High" },
            { from: 76, to: 100, color: "#B01C2F", name: "Peak" },
          ],
        },
      },
    },
    tooltip: { y: { formatter: (v) => `${v} transaksi` } },
  };

  return (
    <section id="energy-map" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-screen-2xl px-6 py-12">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Digital Energy Map
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Denyut data bandaraya secara langsung - setiap transaksi menghidupkan
          Robot IXORA dan menumbuhkan <em>bloom</em> digital.
        </p>

        {/* Dua kolum — kiri data, kanan heatmap */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2 xl:gap-12 items-start">
          {/* LEFT: Statistik + Robot */}
          <div className="rounded-2xl bg-white p-8 border shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#B01C2F] mb-6">
                Denyut Tenaga Digital Hari Ini
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Stat label="Transaksi Hari Ini" value={todayTransactions} />
                <Stat label="Pengguna Aktif" value={activeUsers} />
              </div>
              <div className="border-t pt-3">
                <h4 className="text-sm text-gray-600 font-medium">
                  Modul Paling Aktif:
                </h4>
                <p className="text-base font-semibold text-gray-900">
                  Lesen Perniagaan
                </p>
              </div>
            </div>

            {/* Robot Denyut */}
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`h-20 w-20 rounded-2xl border flex items-center justify-center transition-transform ${
                    pulse ? "scale-110" : "scale-100"
                  }`}
                  style={{ borderColor: PRIMARY }}
                >
                  <span className="text-4xl" role="img" aria-label="IXORA Bot">
                    🤖
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    IXORA Bot • Live Pulse
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    “Terima kasih!{" "}
                    <strong>{todayTransactions.toLocaleString()}</strong>{" "}
                    transaksi hari ini menyalakan tenaga saya.”
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${
                        pulse ? "animate-[ping_0.6s_ease-out_1]" : "animate-pulse"
                      }`}
                      style={{ background: PRIMARY }}
                    />
                    <span className="text-xs text-gray-500">
                      Pulse masa nyata aktif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Heatmap Chart */}
          <div className="rounded-2xl bg-white border p-6 shadow-sm">
            <Chart options={options} series={series} type="heatmap" height={350} />
            {/* <p className="mt-3 text-center text-xs text-gray-500">
              Setiap blok mewakili transaksi digital mengikut jam — semakin cerah,
              semakin tinggi aktiviti.
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#B01C2F]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}