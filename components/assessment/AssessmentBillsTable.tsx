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
  paidLookup?: Record<string, { paid: boolean; reference?: string }>; // keyed by bill_no
  onReceipt?: (bill_no: string, reference?: string) => void;
};

export default function AssessmentBillsTable({ bills, selectedIds, onToggle, onToggleAll, loading = false, t, paidLookup, onReceipt }: Props) {
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
              {paidLookup && (<th className="p-2 text-right whitespace-nowrap w-[120px]">{t('assessment.actions', 'Actions')}</th>)}
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={String(b.id)} className="border-t">
                <td className="p-2 text-center">
                  {(() => {
                    const paid = paidLookup?.[b.bill_no || '']?.paid;
                    return (
                      <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedIds.has(b.id)}
                        onChange={() => { if (!paid) onToggle(b.id); }}
                        disabled={paid}
                      />
                    );
                  })()}
                </td>
                <td className="p-2 font-medium truncate max-w-[140px]" title={b.bill_no}>
                  <div className="flex items-center gap-2">
                    <span className="truncate" style={{ maxWidth: '100%' }}>{b.bill_no}</span>
                    {paidLookup?.[b.bill_no || '']?.paid && (
                      <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 text-[10px]">Paid</span>
                    )}
                  </div>
                </td>
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
                {paidLookup && (
                  <td className="p-2 text-right">
                    {paidLookup?.[b.bill_no || '']?.paid ? (
                      <button
                        type="button"
                        onClick={() => onReceipt?.(b.bill_no, paidLookup?.[b.bill_no || '']?.reference)}
                        className="inline-flex items-center px-2 py-1 rounded border text-[11px] hover:bg-gray-50"
                      >
                        Receipt
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400">-</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {bills.length === 0 && !loading && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={paidLookup ? 6 : 5}>
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
