'use client';
import dynamic from 'next/dynamic';
import { useMemo, useEffect, useState } from 'react';
import type { ApexOptions } from 'apexcharts';
import { StatsTable } from './StatsTable';
import { useTranslation } from '@/utils/i18n';

// ApexCharts needs client-side only
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function Achievements() {
  const { t } = useTranslation();

  // Detect dark mode from Tailwind's 'dark' class (adjust if you use a different theme hook)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setThemeMode(isDark ? 'dark' : 'light');

    // Optional: keep in sync if your app toggles theme dynamically
    const observer = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains('dark');
      setThemeMode(nowDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const categories = ['2021', '2022', '2023', '2024', '2025'];
  const series = useMemo(
    () => [
      { name: 'Cash', data: [78877, 96882, 75220, 46287, 3888] },
      { name: 'Cashless', data: [65840, 77015, 76179, 89032, 68200] },
    ],
    []
  );

  const options = useMemo((): ApexOptions => ({
    chart: {
      type: 'bar',
      toolbar: { show: false },
      foreColor: themeMode === 'dark' ? '#e5e7eb' : '#374151',
      animations: { enabled: true },
    },
    theme: { mode: themeMode },
    colors: ['#B01C2F', '#00A7A6'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) =>
          val >= 1000 ? `${Math.round(val / 1000)}k` : `${Math.round(val)}`,
      },
    },
    legend: {
      position: 'top',
      markers: {},
    },
    grid: {
      strokeDashArray: 4,
      borderColor: themeMode === 'dark' ? '#374151' : '#e5e7eb',
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toLocaleString(),
      },
    },
  }), [themeMode]);

  return (
    <section id="pencapaian" className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          {t('landing.achievements.title')}
        </h2>

        {/* <div className="mt-10">
          <StatsTable />
        </div> */}

        <div className="mt-12">
          <h5 className="mb-4 text-center text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300">
            {t('landing.achievements.chartTitle')}
          </h5>
          <div className="mx-auto w-full max-w-3xl">
            {/* Height is controlled via prop; container is responsive */}
            <ReactApexChart options={options} series={series} type="bar" height={320} />
          </div>
        </div>
      </div>
    </section>
  );
}