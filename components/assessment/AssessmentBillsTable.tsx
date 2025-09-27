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
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 w-10"></th>
              <th className="p-2 text-left">{t('assessment.billNo', 'Bill No')}</th>
              <th className="p-2 text-left">{t('assessment.desc', 'Description')}</th>
              <th className="p-2 text-left">{t('assessment.dueDate', 'Due Date')}</th>
              <th className="p-2 text-right">{t('assessment.amount', 'Amount')}</th>
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
                <td className="p-2">{b.bill_no}</td>
                <td className="p-2">{b.description || '-'}</td>
                <td className="p-2">{new Date(b.due_date).toLocaleDateString()}</td>
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
