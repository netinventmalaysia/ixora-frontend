import React, { useMemo } from "react";
import dynamic from "next/dynamic";

// Prevent SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as any;

export type StackedDatum = { label: string; paidAmount: number; unpaidAmount: number };

type Props = {
  data?: StackedDatum[];   // e.g., [{ label: "2023", paidAmount: 100, unpaidAmount: 50 }, ...]
  title?: string;
};

const PaidUnpaidBar: React.FC<Props> = ({ data = [], title = "Paid vs Unpaid" }) => {
  const labels = useMemo(() => data.map((d) => d.label), [data]);

  const series = useMemo(
    () => [
      { name: "Paid", data: data.map((d) => Number(d?.paidAmount ?? 0)) },
      { name: "Unpaid", data: data.map((d) => Number(d?.unpaidAmount ?? 0)) },
    ],
    [data]
  );

  const options: any = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    xaxis: { categories: labels },
    yaxis: { labels: { formatter: (v: number) => `RM ${Math.round(v).toLocaleString()}` } },
    legend: { position: "bottom" },
    plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    colors: ["#059669", "#DC2626"], // Paid, Unpaid
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (v: number) => `RM ${Number(v ?? 0).toFixed(2)}` } },
  };

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <div className="text-xs text-gray-500 font-medium">{title}</div>
      <div className="mt-3">
        <Chart options={options} series={series} type="bar" height={280} />
      </div>
    </div>
  );
};

export default PaidUnpaidBar;