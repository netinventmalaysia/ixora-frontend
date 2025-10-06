import React from 'react';
import Badge from '@/components/forms/Badge';
import Spacing from '@/components/forms/Spacing';

export interface PaymentResultProps {
  status: 'pending' | 'success' | 'failed';
  reference: string;
  amount?: number;
  paidAt?: string | null;
  receiptNo?: string | null;
  bills?: Array<{ bill_no?: string; account_no?: string; item_type?: string; amount?: number }>;
  gateway?: { orderid?: string; bill_desc?: string; bill_email?: string; bill_mobile?: string; [k: string]: any } | null;
  loading?: boolean;
  onRetry?: () => void;
  onDownload?: () => void;
}

const statusMeta: Record<string, { label: string; color: any; desc: string }> = {
  pending: { label: 'Pending', color: 'yellow', desc: 'We have not received final confirmation yet. This page will refresh automatically.' },
  success: { label: 'Success', color: 'green', desc: 'Your payment has been confirmed. You can download the receipt below.' },
  failed: { label: 'Failed', color: 'red', desc: 'The payment did not complete. You may retry your payment.' },
};

const PaymentResult: React.FC<PaymentResultProps> = ({ status, reference, amount, paidAt, receiptNo, bills = [], gateway, loading, onRetry, onDownload }) => {
  const meta = statusMeta[status] || statusMeta.pending;
  const total = amount ?? bills.reduce((s, b) => s + (Number(b.amount) || 0), 0);

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white dark:bg-gray-900 p-6 space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">Payment Status</h2>
          <p className="text-xs text-gray-500 font-mono">Reference: {reference}</p>
        </div>
        <Badge label={meta.label} color={meta.color} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{meta.desc}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1">
          <div className="text-gray-500">Total Amount</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">RM {total.toFixed(2)}</div>
        </div>
        <div className="space-y-1">
          <div className="text-gray-500">Receipt No.</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{receiptNo || '-'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-gray-500">Paid At</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{paidAt ? new Date(paidAt).toLocaleString() : '-'}</div>
        </div>
        {gateway?.orderid && (
          <div className="space-y-1">
            <div className="text-gray-500">Gateway Order</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{gateway.orderid}</div>
          </div>
        )}
        {gateway?.bill_email && (
          <div className="space-y-1">
            <div className="text-gray-500">Payer Email</div>
            <div className="font-medium text-gray-900 dark:text-gray-100 break-all">{gateway.bill_email}</div>
          </div>
        )}
        {gateway?.bill_mobile && (
          <div className="space-y-1">
            <div className="text-gray-500">Payer Mobile</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{gateway.bill_mobile}</div>
          </div>
        )}
      </div>
      <Spacing size="sm" />
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">Bills</h3>
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-2 py-1 text-left font-medium">Bill No</th>
                <th className="px-2 py-1 text-left font-medium">Account</th>
                <th className="px-2 py-1 text-left font-medium">Item Type</th>
                <th className="px-2 py-1 text-right font-medium">Amount (RM)</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-2 py-4 text-center text-gray-400">No bill details available.</td>
                </tr>
              )}
              {bills.map((b, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="px-2 py-1 font-mono">{b.bill_no || '-'}</td>
                  <td className="px-2 py-1 font-mono">{b.account_no || '-'}</td>
                  <td className="px-2 py-1">{b.item_type || '-'}</td>
                  <td className="px-2 py-1 text-right">{Number(b.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-2 border-t">
        {status === 'failed' && (
          <button onClick={onRetry} disabled={loading} className="px-3 py-1.5 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50">Retry Payment</button>
        )}
        {status === 'success' && (
          <button onClick={onDownload} disabled={loading} className="px-3 py-1.5 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-700 disabled:opacity-50">Download Receipt (PDF)</button>
        )}
        <a href="/dashboard" className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50 dark:hover:bg-gray-800">Dashboard</a>
        <a href="/" className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50 dark:hover:bg-gray-800">Home</a>
      </div>
      {loading && <div className="text-xs text-gray-500 italic">Updating status...</div>}
    </div>
  );
};

export default PaymentResult;
