"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PRIMARY = "#B01C2F";
const COLORS = [PRIMARY, "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

export default function Transactions() {
  // --- DATA DUMMY ---
  const categories = ["Jan","Feb","Mac","Apr","Mei","Jun","Jul","Ogo","Sep","Okt","Nov","Dis"];
  const transactionData = [12000,15000,14000,16000,18000,21000,22000,24000,25500,27000,29000,31000];

  const moduleLabels = ["Assessment Tax","Compounds","Business Licence","Booth Rental","Misc Bills"];
  const moduleValues = [35000, 25000, 18000, 12000, 10000];

  // Kira total siap-siap (elak bergantung pada opts.w)
  const modulesTotal = useMemo(
    () => moduleValues.reduce((a, b) => a + b, 0),
    [moduleValues]
  );

  // --- OPTIONS: TRANSAKSI (AREA) ---
  const transactionOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false }, animations: { enabled: true, speed: 400 } },
    grid: { borderColor: "#F3F4F6" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 0.5, opacityFrom: 0.25, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    colors: [PRIMARY],
    xaxis: { categories, labels: { style: { colors: "#6B7280" } } },
    yaxis: {
      labels: {
        style: { colors: "#6B7280" },
        formatter: (v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : `${v}`),
      },
    },
    tooltip: { y: { formatter: (v: number) => `${v.toLocaleString()} transaksi` } },
    markers: { size: 0 },
  }), [categories]);

  // --- OPTIONS: DONUT (AGIHAN MODUL) ---
  const donutOptions: ApexOptions = useMemo(() => ({
    chart: { type: "donut" },
    labels: moduleLabels,
    colors: COLORS,
    legend: { position: "bottom", fontSize: "12px", markers: { size: 6 } },
    dataLabels: { enabled: true, style: { fontSize: "12px" } },
    stroke: { width: 0 },
    tooltip: {
      y: {
        // GUARD: 'opts' mungkin belum lengkap pada initial render
        formatter: (v: number, opts?: any) => {
          const totals =
            (opts?.w?.globals?.seriesTotals as number[] | undefined)?.reduce((a, b) => a + b, 0) ??
            modulesTotal;
          const pct = totals ? Math.round((v / totals) * 100) : 0;
          return `${v.toLocaleString()} transaksi · ${pct}%`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: { show: true, fontSize: "12px", offsetY: 8 },
            value: {
              show: true,
              fontSize: "20px",
              formatter: (val: string) => Number(val).toLocaleString(),
            },
            total: {
              show: true,
              label: "Jumlah",
              // GUARD juga di sini
              formatter: (w: any) => {
                const totals = (w?.globals?.seriesTotals as number[] | undefined)?.reduce((a, b) => a + b, 0);
                return (totals ?? modulesTotal).toLocaleString();
              },
            },
          },
        },
      },
    },
  }), [moduleLabels, modulesTotal]);

  return (
    <section id="transactions" className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Trend Transaksi & Agihan Modul
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
            Pergerakan jumlah transaksi bulanan dan agihan modul perkhidmatan yang paling banyak digunakan.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Transaksi Bulanan</h3>
            <ReactApexChart
              type="area"
              height={300}
              series={[{ name: "Transactions", data: transactionData }]}
              options={transactionOptions}
            />
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Agihan Modul Digunakan</h3>
            <ReactApexChart
              type="donut"
              height={300}
              series={moduleValues}
              options={donutOptions}
            />
          </div>
        </div>
      </div>
    </section>
  );
}