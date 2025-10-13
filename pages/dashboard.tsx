import React, { useEffect, useMemo, useState } from 'react';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import TextLine from '@/components/forms/HyperText';
import { useTranslation } from '@/utils/i18n';
import LogoSpinner from '@/components/common/LogoSpinner';
import {
  fetchAssessmentOutstanding,
  fetchBoothOutstanding,
  fetchCompoundOutstanding,
  fetchMiscOutstanding,
  AssessmentBill,
  BoothBill,
  CompoundBill,
  MiscBill,
  fetchBillingItemsByBillNo,
} from '@/services/api';
import { useBillSelection } from '@/context/BillSelectionContext';
import PaidUnpaidBar from '@/components/dashboard/PaidUnpaidBar';

type BillRow = {
  type: string;
  id: string | number;
  billNo: string;
  amount: number;
  due: string;
  color?: string;
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  // use selection like Assessment (add/remove/has)
  const { add, remove, has } = useBillSelection();

  const [assess, setAssess] = useState<AssessmentBill[]>([]);
  const [compound, setCompound] = useState<CompoundBill[]>([]);
  const [booth, setBooth] = useState<BoothBill[]>([]);
  const [misc, setMisc] = useState<MiscBill[]>([]);
  const [paidLookup, setPaidLookup] = useState<Record<string, { reference?: string; status?: string }>>({});

  // ===== Utilities =====
  const fRM = (n: number) => `RM ${Number(n || 0).toFixed(2)}`;
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
  const parseYear = (s?: string) => {
    if (!s) return NaN;
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.getFullYear();
    const parts = s.includes('/') ? s.split('/') : s.split('-');
    if (parts.length >= 3) return parts[0].length === 4 ? Number(parts[0]) : Number(parts[2]); // YYYY or DD/MM/YYYY
    return NaN;
  };

  // Map type -> cart source
  const mapSource = (tpe: string) =>
    tpe.toLowerCase().includes('assessment') ? 'assessment'
    : tpe.toLowerCase().includes('booth') ? 'booth'
    : tpe.toLowerCase().includes('misc') ? 'misc'
    : 'compound' as const;

  const toSelectable = (b: BillRow) => ({
    id: (b as any).id ?? b.billNo,
    bill_no: b.billNo,
    amount: b.amount,
    due_date: b.due,
    description: b.type,
    source: mapSource(b.type) as 'assessment' | 'booth' | 'misc' | 'compound',
    meta: {},
  });

  // ===== Fetch all categories by IC after login =====
  useEffect(() => {
    const ic = typeof window !== 'undefined' ? localStorage.getItem('ic') || '' : '';
    if (!ic) return;
    let cancel = false;
    const run = async () => {
      try {
        setLoading(true);
        const [a, c, b, m] = await Promise.all([
          fetchAssessmentOutstanding({ ic }).catch(() => []),
          fetchCompoundOutstanding({ ic }).then((d: any) => (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [])).catch(() => []),
          fetchBoothOutstanding({ ic }).then((d: any) => (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [])).catch(() => []),
          fetchMiscOutstanding({ ic }).catch(() => []),
        ]);
        if (!cancel) { setAssess(a as AssessmentBill[]); setCompound(c as CompoundBill[]); setBooth(b as BoothBill[]); setMisc(m as MiscBill[]); }
      } finally { if (!cancel) setLoading(false); }
    };
    run();
    return () => { cancel = true; };
  }, []);

  // ===== Build unified rows, de-dupe & sort (unpaid first, earliest due) =====
  const unifiedBills: BillRow[] = useMemo(() => {
    const norm = (type: string, id: string | number, billNo: string, amount: number, due: string): BillRow => ({
      type, id, billNo, amount: Number(amount) || 0, due: due || '-', color: amount > 0 ? 'text-emerald-600' : 'text-gray-500',
    });

    const a = (assess || []).map(b => norm('Assessment Tax', b.id, (b as any).bill_no || (b as any).no_bil || String(b.id), b.amount, b.due_date));
    const c = (compound || []).map(b => norm(
      'Compound',
      (b as any).id ?? (b as any).compound_no ?? (b as any).nokmp ?? (b as any).no_kompaun ?? (b as any).bill_no ?? (b as any).no_rujukan ?? String((b as any).id ?? ''),
      (b as any).bill_no ?? (b as any).nokmp ?? (b as any).no_kompaun ?? (b as any).no_rujukan ?? String((b as any).id ?? ''),
      (b as any).amount ?? (b as any).jumlah ?? 0,
      (b as any).due_date ?? (b as any).trk_bil ?? ''
    ));
    const br = (booth || []).map(b => norm('Booth Rental', b.id, (b as any).bill_no ?? (b as any).no_bil ?? String(b.id), b.amount, b.due_date));
    const ms = (misc || []).map(b => norm('Misc Bill', b.id, (b as any).bill_no ?? (b as any).billNo ?? (b as any).no_rujukan ?? String(b.id), b.amount, b.due_date));

    // De-dupe by billNo (keep latest due)
    const map = new Map<string, BillRow>();
    [...a, ...c, ...br, ...ms].forEach(row => {
      const prev = map.get(row.billNo);
      if (!prev) map.set(row.billNo, row);
      else {
        const dNew = new Date(row.due).getTime() || 0;
        const dOld = new Date(prev.due).getTime() || 0;
        map.set(row.billNo, dNew >= dOld ? row : prev);
      }
    });

    const arr = Array.from(map.values());
    const isPaidRow = (r: BillRow) => {
      const s = (paidLookup[r.billNo]?.status || '').toUpperCase();
      return s === 'PAID' || s === 'SUCCESS';
    };

    return arr.sort((x, y) => {
      const ax = isPaidRow(x), ay = isPaidRow(y);
      if (ax !== ay) return ax ? 1 : -1; // unpaid first
      const dx = new Date(x.due).getTime() || Number.MAX_SAFE_INTEGER;
      const dy = new Date(y.due).getTime() || Number.MAX_SAFE_INTEGER;
      return dx - dy;
    });
  }, [assess, compound, booth, misc, paidLookup]);

  // ===== After bills are loaded, check paid references (limited) =====
  useEffect(() => {
    const run = async () => {
      const entries: Array<[string, { reference?: string; status?: string }]> = [];
      const seen = new Set<string>();
      const bills = unifiedBills.slice(0, 30);
      await Promise.all(bills.map(async (b) => {
        const key = b.billNo || String(b.id || '');
        if (!key || seen.has(key)) return;
        seen.add(key);
        try {
          const items = await fetchBillingItemsByBillNo(key);
          const first = Array.isArray(items)
            ? items.find(it => (it.status || '').toUpperCase() === 'PAID' || (it.billing_status || '').toUpperCase() === 'PAID' || (it.billing_status || '').toUpperCase() === 'SUCCESS')
            : undefined;
          if (first) entries.push([key, { reference: first.reference, status: first.status || first.billing_status }]);
        } catch {}
      }));
      if (entries.length) {
        setPaidLookup(prev => {
          const next = { ...prev };
          for (const [k, v] of entries) next[k] = v;
          return next;
        });
      }
    };
    if (unifiedBills.length) run();
  }, [unifiedBills]);

  // ===== Totals for cards =====
  const totals = useMemo(() => {
    const isPaid = (b: BillRow) => {
      const s = (paidLookup[b.billNo]?.status || '').toUpperCase();
      return s === 'PAID' || s === 'SUCCESS';
    };
    const unpaid = unifiedBills.filter((b) => !isPaid(b));
    const billTotal = unpaid.reduce((s, b) => s + (Number(b.amount) || 0), 0);
    const billCount = unpaid.length;
    const paidAmount = unifiedBills.filter(isPaid).reduce((s, b) => s + (Number(b.amount) || 0), 0);
    const unpaidAmount = billTotal;
    return { billTotal, billCount, paidAmount, unpaidAmount };
  }, [unifiedBills, paidLookup]);

  // ===== Yearly aggregation for chart (ALL years, newest → oldest) =====
  const yearlyData = useMemo(() => {
    const byYear = new Map<number, { paid: number; unpaid: number }>();
    const isPaid = (billNo: string) => {
      const s = (paidLookup[billNo]?.status || '').toUpperCase();
      return s === 'PAID' || s === 'SUCCESS';
    };
    unifiedBills.forEach((b) => {
      const y = parseYear(b.due);
      if (isNaN(y)) return;
      if (!byYear.has(y)) byYear.set(y, { paid: 0, unpaid: 0 });
      const entry = byYear.get(y)!;
      const amt = Number(b.amount) || 0;
      if (isPaid(b.billNo)) entry.paid += amt;
      else entry.unpaid += amt;
    });
    return Array.from(byYear.entries())
      .sort((a, b) => b[0] - a[0]) // newest first
      .map(([year, v]) => ({ label: String(year), paidAmount: v.paid, unpaidAmount: v.unpaid }));
  }, [unifiedBills, paidLookup]);

  // ===== Render =====
  return (
    <SidebarLayout>
      {/* Page container: width + safe bottom padding for checkout tray */}
      <div className="mx-auto w-full max-w-screen-xl px-3 sm:px-6 lg:px-8 pb-24" aria-busy={loading}>
        {loading && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60" aria-hidden="true">
            <LogoSpinner size={56} className="drop-shadow-md" title={t('common.loading', 'Loading...')} />
          </div>
        )}

        <Heading level={1} align="left" bold>
          {t('dashboard.welcome', 'Welcome to MBMB IXORA')}
        </Heading>
        <TextLine>
          {t('dashboard.description', 'MBMB IXORA is the official digital portal of the Melaka Historic City Council, simplifying citizen and business transactions online.')}
        </TextLine>

        <Spacing size="lg" />

        {/* Chart */}
        <PaidUnpaidBar
          data={yearlyData}
          title={t('dashboard.pieTitle', 'Paid vs Unpaid (Bills)')}
        />
        {/* SR summary for screen readers */}
        <p className="sr-only" aria-live="polite">
          {`Unpaid total RM ${totals.billTotal.toFixed(2)}, Paid total RM ${totals.paidAmount.toFixed(2)}.`}
        </p>

        <Spacing size="md" />

        {/* Summary Cards (with lightweight skeletons on initial load) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
          </div>
        ) : (
          <SummaryCards
            billTotal={totals.billTotal}
            billCount={totals.billCount}
            invoiceCount={0}
            formatAmount={fRM}
          />
        )}

        <Spacing size="lg" />

        {/* Bills */}
        <Heading level={2} align="left" bold>
          {t('dashboard.billsTitle', 'Your Bills')}
        </Heading>
        <TextLine>
          {t('dashboard.billsDesc', 'Below is a summary of your current bills. Click on each bill type for more details and payment options.')}
        </TextLine>

        <Spacing size="sm" />

        {/* Slim, mobile-friendly cards with selection (Assessment-style) */}
        <div className="bg-white shadow rounded-lg p-4 space-y-3">
          {unifiedBills.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              {t('dashboard.noBills', 'No bills available at the moment.')}
            </p>
          ) : (
            unifiedBills.map((b, i) => {
              const paid = (paidLookup[b.billNo]?.status || '').toUpperCase();
              const isPaid = paid === 'PAID' || paid === 'SUCCESS';
              const formattedDate = fmtISO(b.due);
              const overdue = isOverdue(b.due);

              const selectable = toSelectable(b);
              const isSelected = has(selectable);
              const disabled = isPaid || Number(b.amount) <= 0;

              const toggle = () => {
                if (disabled) return;
                if (isSelected) remove(selectable);
                else add(selectable);
              };

              return (
                <div
                  key={i}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
                >
                  {/* Bill Info (3-line layout) */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {b.type} - {b.billNo}
                    </div>
                    <div className={`text-xs mt-1 ${overdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                      Due: {formattedDate}
                    </div>
                    <div className={`text-xs mt-1 ${isPaid ? 'text-emerald-600 font-semibold' : 'text-gray-700 font-semibold'}`}>
                      Amount: {fRM(b.amount)}
                    </div>
                  </div>

                  {/* Right controls: checkbox + button (Assessment-like UX) */}
                  <div className="flex-shrink-0 sm:text-right mt-2 sm:mt-0 w-full sm:w-auto">
                    {!isPaid && (
                      <div className="flex items-center justify-end mb-2">
                        <input
                          type="checkbox"
                          aria-label={t('dashboard.selectBill', 'Select bill')}
                          checked={isSelected}
                          onChange={toggle}
                          disabled={disabled}
                          className="h-4 w-4"
                        />
                      </div>
                    )}

                    {isPaid ? (
                      <a
                        href={
                          paidLookup[b.billNo]?.reference
                            ? `/payment-status/${encodeURIComponent(paidLookup[b.billNo]?.reference!)}`
                            : `/payment-status?bill_no=${encodeURIComponent(b.billNo)}`
                        }
                        className="inline-flex items-center justify-center px-3 h-11 rounded-md bg-indigo-600 text-white text-sm font-medium hover:opacity-90 w-full sm:w-auto"
                      >
                        {t('dashboard.receipt', 'Receipt')}
                      </a>
                    ) : (
                      <button
                        onClick={toggle}
                        disabled={disabled}
                        className={`inline-flex items-center justify-center px-3 h-11 rounded-md text-white text-sm font-medium w-full sm:w-auto hover:opacity-90 disabled:opacity-50 ${
                          isSelected ? 'bg-gray-700' : 'bg-[#00A7A6]'
                        }`}
                      >
                        {isSelected ? t('dashboard.remove', 'Remove') : t('dashboard.select', 'Select')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Total */}
          {unifiedBills.length > 0 && (
            <div className="border-t pt-3 flex items-center justify-between text-sm font-semibold">
              <span>{t('dashboard.total', 'Total')}</span>
              <span className="font-extrabold">{fRM(totals.billTotal)}</span>
            </div>
          )}
        </div>

        <Spacing size="lg" />
        {/* Invoice Section Notice */}
        <div className="mt-6 border rounded-lg bg-gray-50 px-4 py-6 text-center">
          <h3 className="text-sm font-semibold text-gray-900">
            {t('dashboard.invoiceUnavailableTitle', 'Invoices Unavailable')}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {t(
              'dashboard.invoiceUnavailableText',
              'No invoices are currently available for your account. Once invoice data is activated in the MBMB IXORA system, you will be able to view and download them here.'
            )}
          </p>
        </div>

      </div>
    </SidebarLayout>
  );
}