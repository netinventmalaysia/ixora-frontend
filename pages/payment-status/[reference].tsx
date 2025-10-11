import SidebarLayout from '@/components/main/SidebarLayout';
import PaymentResult from '@/components/billing/PaymentResult';
import { fetchBillingStatus, fetchBillingReceipt } from '@/services/api';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

interface BillingStatusData {
  reference: string;
  status: 'pending' | 'success' | 'failed' | string;
  paid_at?: string;
  amount?: number;
  receipt_no?: string;
  bills?: Array<{ bill_no?: string; account_no?: string; item_type?: string; amount?: number }>;
  gateway?: any;
}

export default function PaymentStatusByRefPage() {
  const router = useRouter();
  const [reference, setReference] = useState<string>('');
  const [data, setData] = useState<BillingStatusData | null>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get reference from dynamic route
  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query?.reference;
    const ref = Array.isArray(q) ? q[0] : (q || '');
    setReference(ref);
  }, [router.isReady, router.query]);

  const pollStatus = useCallback(async (ref: string) => {
    if (!ref) return;
    setLoading(true);
    try {
      const statusData = await fetchBillingStatus(ref);
      setData(statusData);
      if (statusData?.status === 'success') {
        const receiptData = await fetchBillingReceipt(ref);
        if (receiptData) setReceipt(receiptData);
      }
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll every 4s while pending (stop after success or failed or 2 minutes)
  useEffect(() => {
    if (!reference) return;
    let attempts = 0;
    let active = true;
    const run = async () => {
      if (!active) return;
      attempts += 1;
      await pollStatus(reference);
      const currentStatus = (data?.status || 'pending');
      if (currentStatus === 'pending' && attempts < 30) {
        setTimeout(run, 4000);
      }
    };
    run();
    return () => { active = false; };
  }, [reference]);

  const onRetry = () => {
    if (reference) pollStatus(reference);
  };

  const onDownload = () => {
    try {
      const blob = new Blob([JSON.stringify({ data, receipt }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${reference}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch { /* ignore */ }
  };

  const status: 'pending' | 'success' | 'failed' = (data?.status === 'success' || data?.status === 'failed') ? data.status : 'pending';
  const bills = data?.bills || receipt?.bills || [];
  const amount = data?.amount || receipt?.amount;
  const receiptNo = data?.receipt_no || receipt?.receipt_no || receipt?.number;
  const paidAt = data?.paid_at || receipt?.paid_at || receipt?.paidAt;

  return (
    <SidebarLayout>
      <div className="w-full max-w-4xl mx-auto py-10 px-4 space-y-6">
        {!reference && (
          <div className="rounded bg-red-50 border border-red-200 p-4 text-sm text-red-700">Missing reference. Please return to the dashboard.</div>
        )}
        {reference && (
          <PaymentResult
            status={status}
            reference={reference}
            amount={amount}
            receiptNo={receiptNo}
            paidAt={paidAt}
            bills={bills}
            gateway={data?.gateway}
            loading={loading}
            onRetry={onRetry}
            onDownload={onDownload}
          />
        )}
        {error && <div className="text-xs text-red-600">{error}</div>}
        {status === 'pending' && !error && (
          <div className="text-[11px] text-gray-500">This page will refresh automatically. Keep it open until you see Success or Failed.</div>
        )}
      </div>
    </SidebarLayout>
  );
}
