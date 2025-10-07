// components/landing-page/DigitalEnergyMapSection.tsx
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PRIMARY = "#B01C2F";
type Range = "week" | "month" | "year";

const MODULES = [
  "Lesen Perniagaan",
  "Cukai Taksiran",
  "Kompaun",
  "Sewaan Gerai",
  "Permit Sementara",
];

const DAYS = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Aha"];
const MONTHS = ["Jan","Feb","Mac","Apr","Mei","Jun","Jul","Ogo","Sep","Okt","Nov","Dis"];

export default function DigitalEnergyMapSection() {
  const [range, setRange] = useState<Range>("week");

  // Label paksi-X ikut pilihan
  const xCategories = useMemo(() => {
    if (range === "week") return DAYS;
    if (range === "month") return Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    return MONTHS; // year
  }, [range]);

  // Data dummy (boleh ganti dengan fetch API)
  const series = useMemo(() => {
    const len = range === "week" ? 7 : range === "month" ? 30 : 12;
    return MODULES.map((name) => ({
      name,
      data: Array.from({ length: len }, () => Math.floor(Math.random() * 120) + 20),
    }));
  }, [range]);

  const titleText =
    range === "week"
      ? "Trend Tenaga Digital Mingguan"
      : range === "month"
      ? "Trend Tenaga Digital Bulanan"
      : "Trend Tenaga Digital Tahunan";

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 380,
      toolbar: { show: false },
      animations: { enabled: true },
      zoom: { enabled: false },
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    title: {
      text: titleText,
      style: { color: PRIMARY, fontSize: "18px", fontWeight: 600 },
    },
    xaxis: {
      categories: xCategories,
      labels: { style: { colors: "#64748B", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#334155", fontWeight: 500 } },
      title: { text: "Jumlah Transaksi", style: { color: "#475569", fontSize: "12px" } },
    },
    grid: { borderColor: "#E2E8F0" },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      labels: { colors: "#475569" },
    },
    colors: ["#B01C2F", "#E6691F", "#00A7A6", "#005C76", "#F3A712"],
    markers: {
      size: 3,
      strokeWidth: 1,
      hover: { size: 6 },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (v) => `${v} transaksi`,
      },
    },
  };

  return (
    <section id="energy-map" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-screen-2xl px-6">
        {/* Kawalan atas */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Digital Energy Map
          </h2>
          <fieldset className="flex items-center gap-2 rounded-xl border bg-white px-2 py-1">
            <legend className="sr-only">Julat masa</legend>
            <Radio
              label="Minggu"
              checked={range === "week"}
              onChange={() => setRange("week")}
            />
            <Radio
              label="Bulan"
              checked={range === "month"}
              onChange={() => setRange("month")}
            />
            <Radio
              label="Tahun"
              checked={range === "year"}
              onChange={() => setRange("year")}
            />
          </fieldset>
        </div>

        {/* Carta Garisan */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <Chart options={options} series={series} type="line" height={380} />
        </div>
      </div>
    </section>
  );
}

function Radio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1 text-sm">
      <input
        type="radio"
        className="h-4 w-4 accent-[#B01C2F]"
        checked={checked}
        onChange={onChange}
      />
      <span className={checked ? "font-semibold text-gray-900" : "text-gray-600"}>
        {label}
      </span>
    </label>
  );
}