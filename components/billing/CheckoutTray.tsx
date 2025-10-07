import React, { useState, useEffect } from 'react';
import { useBillSelection } from '@/context/BillSelectionContext';
import { checkoutOutstandingBills, fetchUserByEmail } from '@/services/api';
import { generateReference } from '@/utils/reference';
import toast from 'react-hot-toast';

interface PayerFormState {
  name: string;
  email: string;
  mobile: string;
}

const defaultForm: PayerFormState = { name: '', email: '', mobile: '' };

const CheckoutTray: React.FC = () => {
  const { bills, total, count, clear } = useBillSelection();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PayerFormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Determine mobile viewport (SSR safe)
  useEffect(() => {
    const calc = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Allow other parts of the app to open the tray programmatically
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('ixora:openCheckout', handler as EventListener);
    return () => window.removeEventListener('ixora:openCheckout', handler as EventListener);
  }, []);

  // Autofill from stored user info (login sets username/email; mobile may be stored later under 'mobile' or 'phone')
  useEffect(() => {
    try {
      const storedName = typeof window !== 'undefined' ? (localStorage.getItem('username') || '') : '';
      const storedEmail = typeof window !== 'undefined' ? (localStorage.getItem('email') || '') : '';
      const storedMobile = typeof window !== 'undefined'
        ? (localStorage.getItem('mobile') || localStorage.getItem('phone') || localStorage.getItem('contact') || '')
        : '';
      setForm(prev => ({
        name: prev.name || storedName,
        email: prev.email || storedEmail,
        mobile: prev.mobile || storedMobile,
      }));
      // Fetch freshest user data from API if email exists
      const enrichFromUserObj = (user: any) => {
        if (!user) return;
        const first = user.first_name || user.firstname || user.firstName || '';
        const last = user.last_name || user.lastname || user.lastName || '';
        const combined = (first || last) ? `${first} ${last}`.trim() : '';
        const apiName = combined || user.full_name || user.fullName || user.name || user.username;
        const apiEmail = user.email || storedEmail;
        const apiMobile = user.mobile || user.phone || user.phone_number || user.phoneNumber || user.contact_no || user.contactNo || user.contact || user.msisdn || user.phoneNumber || '';
        setForm(prev2 => ({
          name: prev2.name || apiName || '',
          email: prev2.email || apiEmail || '',
          mobile: prev2.mobile || apiMobile || '',
        }));
        try {
          if (apiName) localStorage.setItem('payerName', apiName);
          if (apiMobile) localStorage.setItem('payerMobile', apiMobile);
        } catch { /* ignore */ }
      };

      if (storedEmail) {
        fetchUserByEmail(storedEmail).then(data => {
          try {
            // Backend might return array or object
            const user = Array.isArray(data) ? data[0] : data?.user || data;
            enrichFromUserObj(user);
          } catch { /* swallow */ }
        }).catch(() => {/* ignore fetch errors for payer autofill */});
        // If after short delay mobile still blank, fallback to /user
        // Removed fetchCurrentUser fallback (endpoint not available)
      }
    } catch { /* ignore */ }
  }, []);

  const onCheckout = async () => {
    if (!form.name || !form.email || !form.mobile) {
      toast.error('Fill all payer fields');
      return;
    }
    setSubmitting(true);
    try {
      const billNumbers = bills.map(b => b.bill_no || String(b.id)).filter(Boolean);
      let billDesc = '';
      if (billNumbers.length === 1) billDesc = billNumbers[0]!;
      else if (billNumbers.length > 1) {
        const preview = billNumbers.slice(0, 5).join(', ');
        billDesc = billNumbers.length > 5 ? `${preview} +${billNumbers.length - 5} more` : preview;
      } else {
        billDesc = `Payment for ${count} bill(s)`;
      }
      const userIdStr = typeof window !== 'undefined' ? localStorage.getItem('userId') : undefined;
      const businessIdStr = typeof window !== 'undefined' ? localStorage.getItem('activeBusinessId') : undefined;
      const base = {
        billName: form.name,
        billEmail: form.email,
        billMobile: form.mobile.replace(/\s+/g, ''),
        billDesc,
        userId: userIdStr ? Number(userIdStr) : undefined,
        businessId: businessIdStr ? Number(businessIdStr) : undefined,
        bills: bills.map(b => ({
          account_no: b.meta?.account_no || String(b.id),
            item_type: b.meta?.item_type || (b.source === 'assessment' ? '01' : b.source === 'booth' ? '02' : b.source === 'misc' ? (b.meta?.item_type || '05') : '99'),
          amount: b.amount,
          bill_no: b.bill_no || undefined,
        })),
      } as const;

      let attempt = 0;
      let lastData: any = null;
      while (attempt < 2) {
        const payload = { reference: generateReference(), ...base } as any;
        if (attempt === 0 && typeof window !== 'undefined') {
          console.log('[CheckoutTray] Attempt 1 payload bills length:', payload.bills.length, 'ref:', payload.reference);
        }
        const { data } = await checkoutOutstandingBills(payload);
        lastData = data;
        if (data?.url) break;
        attempt += 1;
        if (attempt >= 2) {
          toast.error('Checkout failed (no redirect URL).');
          setSubmitting(false);
          return;
        }
        console.warn('[CheckoutTray] Missing url, retrying with new reference...');
      }
      if (!lastData?.url) {
        toast.error('Checkout failed (no redirect URL).');
        setSubmitting(false);
        return;
      }
      toast.success('Redirecting to payment...');
      setTimeout(() => { window.location.href = lastData.url!; }, 600);
    } catch (e: any) {
      toast.error(e?.message || 'Checkout failed');
      setSubmitting(false);
    }
  };

  // Shared bill list UI (desktop scroll panel / mobile scroll body)
  const billList = (
    <>
      <h4 className="font-semibold">Selected Bills</h4>
      <ul className="divide-y border rounded">
        {bills.map(b => (
          <li key={`${b.source}-${b.id}-${b.bill_no}`} className="p-2 flex flex-col gap-0.5">
            <div className="flex justify-between">
              <span className="font-medium text-xs truncate max-w-[140px]" title={b.bill_no || String(b.id)}>{b.bill_no || b.id}</span>
              <span className="text-xs whitespace-nowrap">RM {b.amount.toFixed(2)}</span>
            </div>
            <div className="text-[10px] text-gray-500 flex justify-between"><span>{b.source}</span><span>{b.due_date ? new Date(b.due_date).toLocaleDateString() : '-'}</span></div>
          </li>
        ))}
      </ul>
      <div className="pt-2 border-t flex justify-between font-semibold">
        <span>Total</span>
        <span>RM {total.toFixed(2)}</span>
      </div>
      <div className="space-y-2">
        <input type="text" placeholder="Payer name" className="w-full border rounded px-2 py-1 text-sm bg-gray-50" value={form.name} readOnly />
        <input type="email" placeholder="Email" className="w-full border rounded px-2 py-1 text-sm bg-gray-50" value={form.email} readOnly />
        <input type="tel" placeholder="Mobile" className="w-full border rounded px-2 py-1 text-sm bg-gray-50" value={form.mobile} readOnly />
        <div className="text-[10px] text-gray-500">Description auto-set to bill number(s) on submission.</div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[200] pointer-events-none">
        {/* Toggle button (floating) when closed */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="pointer-events-auto fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 text-sm"
          >Cart ({count}) RM {total.toFixed(2)}</button>
        )}
        {open && (
          <div className="pointer-events-auto absolute inset-0 flex flex-col bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
              <div className="font-semibold text-sm">Checkout ({count})</div>
              <button onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-gray-800">Close</button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3 text-sm">
              {billList}
            </div>
            <div className="border-t bg-white p-3 flex gap-2 sticky bottom-0">
              <button
                onClick={() => clear()}
                disabled={submitting}
                className="flex-1 px-3 py-2 rounded border text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
              >Clear</button>
              <button
                onClick={onCheckout}
                disabled={submitting || total <= 0}
                className="flex-1 px-3 py-2 rounded bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 disabled:opacity-50"
              >{submitting ? 'Processing…' : 'Pay Now'}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop floating tray
  return (
    <div className="fixed bottom-4 right-4 z-[200]">
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 text-sm"
      >
        {open ? 'Close' : 'Checkout'} ({count}) RM {total.toFixed(2)}
      </button>
      {open && (
        <div className="mt-2 w-[340px] max-h-[75vh] overflow-auto bg-white border border-gray-200 rounded shadow-lg p-4 space-y-3 text-sm">
          {billList}
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => clear()}
              disabled={submitting}
              className="px-3 py-1 rounded border text-xs hover:bg-gray-50 disabled:opacity-50"
            >Clear</button>
            <button
              onClick={onCheckout}
              disabled={submitting || total <= 0}
              className="px-3 py-1 rounded bg-purple-600 text-white text-xs hover:bg-purple-700 disabled:opacity-50"
            >{submitting ? 'Processing...' : 'Pay Now'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutTray;
