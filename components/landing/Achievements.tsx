import { StatsTable } from './StatsTable';
import { useEffect, useRef } from 'react';

export function Achievements(){
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(()=>{
    if(!canvasRef.current) return;
    // Lazy load chart.js only in browser when section mounts
    (async () => {
      const Chart = (await import('chart.js/auto')).default;
      const ctx = canvasRef.current!.getContext('2d');
      if(!ctx) return;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['2021','2022','2023','2024','2025'],
          datasets: [
            { label: 'Cash', data: [78877,96882,75220,46287,3888], backgroundColor: '#B01C2F' },
            { label: 'Cashless', data: [65840,77015,76179,89032,68200], backgroundColor: '#00A7A6' }
          ]
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
      });
    })();
  },[]);
  return (
    <section id="pencapaian" className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">Pencapaian Digital MBMB (2021–2025)</h2>
        <div className="mt-10">
          <StatsTable />
        </div>
        <div className="mt-12">
          <h5 className="mb-4 text-center text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300">Trend Transaksi Tunai vs Tanpa Tunai</h5>
          <canvas ref={canvasRef} className="mx-auto h-72 w-full max-w-3xl" />
        </div>
      </div>
    </section>
  );
}
