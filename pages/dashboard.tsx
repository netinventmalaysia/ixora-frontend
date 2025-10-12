import React, { useEffect, useMemo, useState } from 'react';
import SummaryCards from '@/components/dashboard/SummaryCards';
import PaidUnpaidPie from '@/components/dashboard/PaidUnpaidPie';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import TextLine from '@/components/forms/HyperText';
import { useTranslation } from '@/utils/i18n';
import LogoSpinner from '@/components/common/LogoSpinner';
import { fetchAssessmentOutstanding, fetchBoothOutstanding, fetchCompoundOutstanding, fetchMiscOutstanding, AssessmentBill, BoothBill, CompoundBill, MiscBill, fetchBillingItemsByBillNo } from '@/services/api';
import { useBillSelection } from '@/context/BillSelectionContext';
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

type BillRow = { type: string; id: string | number; billNo: string; amount: number; due: string; color?: string };

export default function DashboardPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { add } = useBillSelection();
  const [assess, setAssess] = useState<AssessmentBill[]>([]);
  const [compound, setCompound] = useState<CompoundBill[]>([]);
  const [booth, setBooth] = useState<BoothBill[]>([]);
  const [misc, setMisc] = useState<MiscBill[]>([]);
  const [paidLookup, setPaidLookup] = useState<Record<string, { reference?: string; status?: string }>>({});

  // Fetch all categories by IC after login
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
        if (!cancel) {
          setAssess(a as AssessmentBill[]);
          setCompound(c as CompoundBill[]);
          setBooth(b as BoothBill[]);
          setMisc(m as MiscBill[]);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    run();
    return () => { cancel = true; };
  }, []);

  // ====== Helpers ======
  const fRM = (n: number) => `RM ${n.toFixed(2)}`;

  const unifiedBills: BillRow[] = useMemo(() => {
    const norm = (type: string, id: string | number, billNo: string, amount: number, due: string): BillRow => ({ type, id, billNo, amount: Number(amount) || 0, due: due || '-', color: amount > 0 ? 'text-emerald-600' : 'text-gray-500' });
    const a = (assess || []).map(b => norm('Assessment Tax', b.id, (b as any).bill_no || (b as any).no_bil || String(b.id), b.amount, b.due_date));
    const c = (compound || []).map(b => norm('Compound', (b as any).id ?? (b as any).compound_no ?? (b as any).nokmp ?? (b as any).no_kompaun ?? (b as any).bill_no ?? (b as any).no_rujukan ?? String((b as any).id ?? ''), (b as any).bill_no ?? (b as any).nokmp ?? (b as any).no_kompaun ?? (b as any).no_rujukan ?? String((b as any).id ?? ''), (b as any).amount ?? (b as any).jumlah ?? 0, (b as any).due_date ?? (b as any).trk_bil ?? ''));
    const br = (booth || []).map(b => norm('Booth Rental', b.id, (b as any).bill_no ?? (b as any).no_bil ?? String(b.id), b.amount, b.due_date));
    const ms = (misc || []).map(b => norm('Misc Bill', b.id, (b as any).bill_no ?? (b as any).billNo ?? (b as any).no_rujukan ?? String(b.id), b.amount, b.due_date));
    return [...a, ...c, ...br, ...ms];
  }, [assess, compound, booth, misc]);

  // After bills are loaded, check if any have been paid and capture their reference for receipts
  useEffect(() => {
    const run = async () => {
      const entries: Array<[string, { reference?: string; status?: string }]> = [];
      const seen = new Set<string>();
      const bills = unifiedBills.slice(0, 30); // guard excessive calls
      await Promise.all(bills.map(async (b) => {
        const key = b.billNo || String(b.id || '');
        if (!key || seen.has(key)) return;
        seen.add(key);
        try {
          const items = await fetchBillingItemsByBillNo(key);
          const first = Array.isArray(items) ? items.find(it => (it.status || '').toUpperCase() === 'PAID' || (it.billing_status || '').toUpperCase() === 'PAID' || (it.billing_status || '').toUpperCase() === 'SUCCESS') : undefined;
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

  const totals = useMemo(() => {
    const isPaid = (b: BillRow) => {
      const p = paidLookup[b.billNo];
      const s = (p?.status || '').toUpperCase();
      return s === 'PAID' || s === 'SUCCESS';
    };
    const unpaid = unifiedBills.filter(b => !isPaid(b));
    const billTotal = unpaid.reduce((s, b) => s + (Number(b.amount) || 0), 0);
    const billCount = unpaid.length;
    const paidAmount = unifiedBills.filter(isPaid).reduce((s, b) => s + (Number(b.amount) || 0), 0);
    const unpaidAmount = billTotal;
    return { billTotal, billCount, paidAmount, unpaidAmount };
  }, [unifiedBills, paidLookup]);

  // Features list removed per request

  return (
    <SidebarLayout>
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60" aria-hidden="true">
          <LogoSpinner size={56} className="drop-shadow-md" title={t('common.loading', 'Loading...')} />
        </div>
      )}
      <Heading level={1} align="left" bold>
        {t('dashboard.welcome', 'Welcome to MBMB IXORA')}
      </Heading>
      <TextLine>
        {t('dashboard.description', 'MBMB IXORA is the official digital portal of Majlis Bandaraya Melaka Bersejarah that simplifies citizen and business transactions online.')}
      </TextLine>

      <Spacing size="lg" />

      {/* Paid vs Unpaid pie */}
          <PaidUnpaidPie paidAmount={totals.paidAmount} unpaidAmount={totals.unpaidAmount} title={t('dashboard.pieTitle', 'Paid vs Unpaid (Bills)')} />

          <Spacing size="md" />
          {/* ===================== SUMMARY CARDS (REUSABLE) ===================== */}
          <SummaryCards
            billTotal={totals.billTotal}
            billCount={totals.billCount}
            invoiceCount={0}
            formatAmount={fRM}
          />


      <Spacing size="lg" />

      {/* ===================== BILLS TABLE ===================== */}
      <Heading level={2} align="left" bold>
        {t('dashboard.billsTitle', 'Your Bills')}
      </Heading>
      <TextLine>
        {t('dashboard.billsDesc', 'Below is a summary of your current bills. Click on each bill type for more details and payment options.')}
      </TextLine>
      <Spacing size="sm" />
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <Table>
          <TableCaption className="sr-only">{t('dashboard.billsTitle', 'Your Bills')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[45%]">Bill Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unifiedBills.map((b, i) => (
              <TableRow key={i}>
                <TableCell>{b.type} - {b.billNo}</TableCell>
                <TableCell className={`font-bold ${(
                  (() => {
                    const p = paidLookup[b.billNo];
                    const s = (p?.status || '').toUpperCase();
                    return s === 'PAID' || s === 'SUCCESS';
                  })()
                ) ? 'text-emerald-600' : 'text-red-600'}`}>{fRM(b.amount)}</TableCell>
                <TableCell className="text-xs text-gray-500">{b.due}</TableCell>
                <TableCell className="text-right">
                  {(() => {
                    const paid = paidLookup[b.billNo];
                    const isPaid = paid && ((paid.status || '').toUpperCase() === 'PAID' || (paid.status || '').toUpperCase() === 'SUCCESS');
                    if (isPaid) {
                      const href = paid?.reference ? `/payment-status/${encodeURIComponent(paid.reference!)}` : `/payment-status?bill_no=${encodeURIComponent(b.billNo)}`;
                      return (
                        <a href={href} className="inline-flex items-center px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:opacity-90">
                          Receipt
                        </a>
                      );
                    }
                    return (
                      <button
                        className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#00A7A6] text-white hover:opacity-90"
                        onClick={() => {
                          const mapSource = (t: string) => t.toLowerCase().includes('assessment') ? 'assessment' : t.toLowerCase().includes('booth') ? 'booth' : t.toLowerCase().includes('misc') ? 'misc' : 'compound';
                          const source = mapSource(b.type) as 'assessment' | 'booth' | 'misc' | 'compound';
                          const selectable = { id: b.id ?? b.billNo, bill_no: b.billNo, amount: b.amount, due_date: b.due, description: b.type, source, meta: {} } as any;
                          add(selectable);
                          // Open checkout tray
                          try { window.dispatchEvent(new Event('ixora:openCheckout')); } catch {}
                        }}
                      >
                        Bayar
                      </button>
                    );
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="font-semibold">Total</TableCell>
              <TableCell className="font-extrabold">{fRM(totals.billTotal)}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <Spacing size="lg" />

      {/* Invoices section hidden until backend provides invoice endpoint */}

      <Spacing size="lg" />
      <LineSeparator />

      {/* Features section removed */}
    </SidebarLayout>
  );
}
