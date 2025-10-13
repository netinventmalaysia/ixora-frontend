import React from 'react';
import { useTranslation } from '@/utils/i18n';

type Props = {
  billTotal: number;
  invoiceTotal?: number;
  billCount: number;
  invoiceCount: number;
  formatAmount?: (n: number) => string;
};

export default function SummaryCards({
  billTotal,
  invoiceTotal,
  billCount,
  invoiceCount,
  formatAmount,
}: Props) {
  const { t } = useTranslation();
  const fmt = formatAmount ?? ((n: number) => n.toString());
  const combinedTotal = (billTotal || 0) + ((invoiceTotal ?? 0) || 0);
  const overallCount = (billCount || 0) + (invoiceCount || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white shadow rounded-lg p-5">
        <div className="text-xs text-gray-500">
          {t('dashboard.cards.billTotal', 'Jumlah Bil')}
        </div>
        <div className="mt-1 text-2xl font-bold">{fmt(billTotal)}</div>
        <div className="mt-2 text-sm text-gray-500">
          {t('dashboard.cards.activeBills', 'Bil aktif')}: {billCount}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-5">
        <div className="text-xs text-gray-500">
          {t('dashboard.cards.invoiceTotal', 'Jumlah Invois')}
        </div>
  <div className="mt-1 text-2xl font-bold">{fmt(invoiceTotal ?? 0)}</div>
        <div className="mt-2 text-sm text-gray-500">
          {t('dashboard.cards.activeInvoices', 'Invois aktif')}: {invoiceCount}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-5">
        <div className="text-xs text-gray-500">
          {t('dashboard.cards.combinedTotal', 'Jumlah Bil + Invois')}
        </div>
        <div className="mt-1 text-2xl font-bold">{fmt(combinedTotal)}</div>
        <div className="mt-2 text-sm text-gray-500">
          {t('dashboard.cards.overallRecords', 'Keseluruhan')}: {overallCount} {t('dashboard.cards.records', 'rekod')}
        </div>
      </div>
    </div>
  );
}