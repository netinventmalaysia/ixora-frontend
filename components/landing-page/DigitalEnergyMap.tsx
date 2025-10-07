// components/landing-page/DigitalEnergyMapSection.tsx
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { useTranslation } from "@/utils/i18n";

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
const MONTHS = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"];

export default function DigitalEnergyMapSection() {
  const { t } = useTranslation();
  const [range, setRange] = useState<Range>("week");

  // X labels ikut pilihan
  const xCategories = useMemo(() => {
    if (range === "week") return DAYS;
    if (range === "month") return Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    return MONTHS; // year
  }, [range]);

  // Data dummy (gantikan dgn API nanti)
  const series = useMemo(() => {
    const len = range === "week" ? 7 : range === "month" ? 30 : 12;
    return MODULES.map((name) => ({
      name,
      data: Array.from({ length: len }, () => Math.floor(Math.random() * 120) + 20),
    }));
  }, [range]);

  const titleText =
    range === "week"
      ? t("energy.weekTitle", "Trend Tenaga Digital Mingguan")
      : range === "month"
      ? t("energy.monthTitle", "Trend Tenaga Digital Bulanan")
      : t("energy.yearTitle", "Trend Tenaga Digital Tahunan");

  const options: ApexOptions = {
    chart: { type: "line", height: 380, toolbar: { show: false }, animations: { enabled: true }, zoom: { enabled: false } },
    stroke: { width: 3, curve: "smooth" },
    title: { text: titleText, style: { color: PRIMARY, fontSize: "18px", fontWeight: 600 } },
    xaxis: {
      categories: xCategories,
      labels: { style: { colors: "#64748B", fontSize: "11px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#334155", fontWeight: 500 } },
      title: { text: t("energy.yaxis", "Jumlah Transaksi"), style: { color: "#475569", fontSize: "12px" } },
    },
    grid: { borderColor: "#E2E8F0" },
    legend: { position: "top", horizontalAlign: "right", fontSize: "12px", labels: { colors: "#475569" } },
    colors: ["#B01C2F", "#E6691F", "#00A7A6", "#005C76", "#F3A712"],
    markers: { size: 3, strokeWidth: 1, hover: { size: 6 } },
    tooltip: { theme: "light", y: { formatter: (v) => `${v} ${t("energy.tx", "transaksi")}` } },
    responsive: [{ breakpoint: 640, options: { legend: { show: false }, markers: { size: 2 } } }],
  };

  return (
    <section id="energy-map" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-screen-2xl px-6 py-20">
        {/* Tajuk & subteks (selaras Services) */}
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {t("energy.heading", "Digital Energy Map")}
        </h2>
        <p className="mt-2 text-center text-gray-600">
          {t("energy.subtitle", "Pantau trend transaksi modul MBMB secara visual & telus")}
        </p>

        {/* Kawalan (tengah) */}
        <div className="mt-6 flex items-center justify-center">
          <fieldset className="flex items-center gap-2 rounded-xl border bg-white px-2 py-1"
                    style={{ borderColor: PRIMARY }}>
            <legend className="sr-only">{t("energy.range", "Julat masa")}</legend>
            <Radio label={t("energy.week", "Minggu")}  checked={range === "week"}  onChange={() => setRange("week")} />
            <Radio label={t("energy.month", "Bulan")}  checked={range === "month"} onChange={() => setRange("month")} />
            <Radio label={t("energy.year", "Tahun")}   checked={range === "year"}  onChange={() => setRange("year")} />
          </fieldset>
        </div>

        {/* Kad carta (gaya sama: border + shadow) */}
        <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm"
             style={{ borderColor: PRIMARY }}>
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