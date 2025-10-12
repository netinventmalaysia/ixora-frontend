import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false }) as any;

export type PieStats = {
  paidAmount: number;
  unpaidAmount: number;
};

type Props = PieStats & {
  title?: string;
};

const PaidUnpaidPie: React.FC<Props> = ({ paidAmount, unpaidAmount, title = 'Paid vs Unpaid' }) => {
  const series = [Number(paidAmount || 0), Number(unpaidAmount || 0)];
  const options: any = {
    chart: { type: 'donut', toolbar: { show: false } },
    labels: ['Paid', 'Unpaid'],
    colors: ['#059669', '#DC2626'], // emerald, red
  legend: { show: true, position: 'bottom' },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: {
      y: { formatter: (v: number) => `RM ${v.toFixed(2)}` },
    },
    plotOptions: {
      pie: { donut: { size: '60%' } },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <div className="text-xs uppercase text-gray-500">{title}</div>
      <div className="mt-2">
        <Chart options={options} series={series} type="donut" height={260} />
      </div>
      {/* Legend removed per request */}
    </div>
  );
};

export default PaidUnpaidPie;
