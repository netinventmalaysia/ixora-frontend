import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AssessmentBill } from 'todo/services/api';

type Props = {
  bills: AssessmentBill[];
  selectedIds: Set<string | number>;
  onToggle: (id: string | number) => void;
  onToggleAll: () => void;
  loading?: boolean;
  t: (k: string, d?: string) => string;
  paidLookup: Record<string, { paid: boolean; reference?: string }>;
  onReceipt: (bill_no: string, reference?: string) => void;
};

const fmtRM = (n: number) => `RM ${Number(n || 0).toFixed(2)}`;
const fmtISO = (d?: string) => {
  if (!d) return '-';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toISOString().split('T')[0];
};
const isOverdue = (d?: string) => {
  const t = new Date().setHours(0, 0, 0, 0);
  const dd = new Date(d || '').setHours(0, 0, 0, 0);
  return !isNaN(dd) && dd < t;
};

const AssessmentBillsTable: React.FC<Props> = ({
  bills,
  selectedIds,
  onToggle,
  onToggleAll,
  loading,
  t,
  paidLookup,
  onReceipt,
}) => {
  const allSelectable = useMemo(
    () => bills.filter((b) => !(b.bill_no && paidLookup[b.bill_no]?.paid)),
    [bills, paidLookup]
  );
  const allSelected = useMemo(
    () =>
      allSelectable.length > 0 &&
      allSelectable.every((b) => selectedIds.has(b.id)),
    [allSelectable, selectedIds]
  );

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {/* Desktop / Tablet table */}
      <div className="hidden md:block">
        <Table className="w-full">
          <TableCaption className="sr-only">
            {t('assessment.tableCaption', 'Outstanding assessment tax bills')}
          </TableCaption>
          <TableHeader>
            <TableRow>
              {/* Merge checkbox into the first column header */}
              <TableHead className="w-[34%]">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    aria-label={t('assessment.selectAll', 'Select all')}
                    checked={allSelected}
                    onChange={onToggleAll}
                    disabled={loading || allSelectable.length === 0}
                    className="h-4 w-4 accent-[#00A7A6]"
                  />
                  <span>
                    {t('assessment.colAccount', 'Account / Description')}
                  </span>
                </div>
              </TableHead>
              <TableHead className="w-[20%]">
                {t('assessment.colBill', 'Bill No.')}
              </TableHead>
              <TableHead className="w-[16%]">
                {t('assessment.colDue', 'Due Date')}
              </TableHead>
              <TableHead className="w-[16%]">
                {t('assessment.colAmount', 'Amount')}
              </TableHead>
              <TableHead className="text-right">
                {t('assessment.colAction', 'Action')}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bills.map((b) => {
              const paid = b.bill_no && paidLookup[b.bill_no]?.paid;
              const selected = selectedIds.has(b.id);
              const disabled = paid || Number(b.amount) <= 0;
              console.log('bills', b);

              return (
                <TableRow key={b.id}>
                  {/* Checkbox aligned with text in same cell */}
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        aria-label={t('assessment.selectBill', 'Select bill')}
                        checked={selected}
                        onChange={() => onToggle(b.id)}
                        disabled={disabled}
                        className="mt-0.5 h-4 w-4 accent-[#00A7A6]"
                      />
                      <div className="min-w-0">
                        <div className="truncate">
                          {b.id || t('assessment.unknown', 'Unknown')}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isOverdue(b.due_date) && b.amount > 0
                              ? 'text-red-600 font-semibold'
                              : 'text-gray-500'
                          }`}
                        >
                          {t('assessment.due', 'Due')}: {fmtISO(b.due_date)}
                          {isOverdue(b.due_date) && b.amount > 0 && (
                            <span className="ml-2 inline-block rounded bg-red-100 text-red-700 px-1.5 py-0.5 text-[10px]">
                              {t('assessment.overdue', 'Overdue')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {b.bill_no || '-'}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {fmtISO(b.due_date)}
                  </TableCell>
                  <TableCell
                    className={`font-semibold ${
                      paid ? 'text-emerald-600' : 'text-gray-900'
                    }`}
                  >
                    {fmtRM(b.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {paid ? (
                      <button
                        type="button"
                        onClick={() =>
                          onReceipt(
                            b.bill_no!,
                            paidLookup[b.bill_no!]?.reference
                          )
                        }
                        className="inline-flex items-center justify-center px-3 h-10 rounded-md bg-indigo-600 text-white text-sm font-medium hover:opacity-90"
                      >
                        {t('assessment.receipt', 'Receipt')}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggle(b.id)}
                        disabled={disabled}
                        className="inline-flex items-center justify-center px-3 h-10 rounded-md bg-[#00A7A6] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
                      >
                        {selected
                          ? t('assessment.remove', 'Remove')
                          : t('assessment.select', 'Select')}
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          {bills.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="text-xs text-gray-500">
                    {t(
                      'assessment.footer',
                      'Select items to add to your checkout. Paid items are disabled.'
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {bills.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {t('assessment.noBills', 'No bills available at the moment.')}
          </p>
        ) : (
          bills.map((b) => {
            const paid = b.bill_no && paidLookup[b.bill_no]?.paid;
            const selected = selectedIds.has(b.id);
            const disabled = paid || Number(b.amount) <= 0;

            return (
              <div key={b.id} className="border rounded-lg p-4">
                {/* align checkbox with text on the left */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    aria-label={t('assessment.selectBill', 'Select bill')}
                    checked={selected}
                    onChange={() => onToggle(b.id)}
                    disabled={disabled}
                    className="mt-0.5 h-4 w-4 accent-[#00A7A6]"
                  />

                  <div className="flex-1 min-w-0">
                    {/* line 1 */}
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {b.description || t('assessment.unknown', 'Unknown')}
                      {b.bill_no ? ` - ${b.bill_no}` : ''}
                    </div>
                    {/* line 2 */}
                    <div
                      className={`text-xs mt-1 ${
                        isOverdue(b.due_date) && b.amount > 0
                          ? 'text-red-600 font-semibold'
                          : 'text-gray-500'
                      }`}
                    >
                      {t('assessment.due', 'Due')}: {fmtISO(b.due_date)}
                      {isOverdue(b.due_date) && b.amount > 0 && (
                        <span className="ml-2 inline-block rounded bg-red-100 text-red-700 px-1.5 py-0.5 text-[10px]">
                          {t('assessment.overdue', 'Overdue')}
                        </span>
                      )}
                    </div>
                    {/* line 3 */}
                    <div
                      className={`text-xs mt-1 ${
                        paid
                          ? 'text-emerald-600 font-semibold'
                          : 'text-gray-700 font-semibold'
                      }`}
                    >
                      {t('assessment.amount', 'Amount')}: {fmtRM(b.amount)}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  {paid ? (
                    <button
                      type="button"
                      onClick={() =>
                        onReceipt(b.bill_no!, paidLookup[b.bill_no!]?.reference)
                      }
                      className="inline-flex items-center justify-center px-3 h-11 rounded-md bg-indigo-600 text-white text-sm font-medium hover:opacity-90 w-full"
                    >
                      {t('assessment.receipt', 'Receipt')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggle(b.id)}
                      disabled={disabled}
                      className="inline-flex items-center justify-center px-3 h-11 rounded-md bg-[#00A7A6] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 w-full"
                    >
                      {selected
                        ? t('assessment.remove', 'Remove')
                        : t('assessment.select', 'Select')}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AssessmentBillsTable;
