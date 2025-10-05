import React from 'react';

// Minimal shape for bills used by this table (works for Assessment & Compound)
export type BillItem = {
  id: string | number;
  bill_no: string;
  amount: number | string;
  due_date: string;
  description?: string | null;
};

type Props = {
  bills: BillItem[];
  selectedIds: Set<string | number>;
  onToggle: (id: string | number) => void;
  onToggleAll: () => void;
  loading?: boolean;
  t: (key: string, fallback?: string) => string;
};

export default function AssessmentBillsTable({ bills, selectedIds, onToggle, onToggleAll, loading = false, t }: Props) {
  const totalSelected = bills
    .filter((b) => selectedIds.has(b.id))
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  return (
    <>
      {/* Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedIds.size === bills.length && bills.length > 0}
              onChange={onToggleAll}
              className="h-4 w-4"
            />
            {t('assessment.selectAll', 'Select all')}
          </label>
          <span className="text-sm text-gray-600">
            {t('assessment.selected', 'Selected')}: {selectedIds.size}
          </span>
        </div>
        <div className="text-sm font-medium">
          {t('assessment.total', 'Total')}: RM {totalSelected.toFixed(2)}
        </div>
      </div>

      {/* Bills table */}
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-xs sm:text-sm table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 w-10"></th>
              <th className="p-2 text-left whitespace-nowrap w-[140px]">{t('assessment.billNo', 'Bill No')}</th>
              <th className="p-2 text-left min-w-[220px] max-w-[420px]">{t('assessment.desc', 'Description')}</th>
              <th className="p-2 text-left whitespace-nowrap w-[120px]">{t('assessment.dueDate', 'Due Date')}</th>
              <th className="p-2 text-right whitespace-nowrap w-[120px]">{t('assessment.amount', 'Amount')}</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={String(b.id)} className="border-t">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedIds.has(b.id)}
                    onChange={() => onToggle(b.id)}
                  />
                </td>
                <td className="p-2 font-medium truncate max-w-[140px]" title={b.bill_no}>{b.bill_no}</td>
                <td className="p-2 align-top">
                  <div
                    className="text-[11px] sm:text-xs leading-snug line-clamp-2 whitespace-normal break-words"
                    title={b.description || '-'}
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                  >
                    {b.description || '-'}
                  </div>
                </td>
                <td className="p-2">
                  {(() => {
                    if (!b.due_date) return '-';
                    const d = new Date(b.due_date);
                    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
                  })()}
                </td>
                <td className="p-2 text-right">RM {Number(b.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
            {bills.length === 0 && !loading && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={5}>
                  {t('assessment.noData', 'No outstanding bills')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
