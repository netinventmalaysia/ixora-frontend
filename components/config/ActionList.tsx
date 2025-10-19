export const RegistrationApplicationActions = [
    {
        label: 'Edit',
        onClick: (item : any) => console.log('Edit', item),
    },
    {
        label: 'Set as default',
        // Handling is centralized in ItemList; this onClick is optional for external hooks
        onClick: (item: any) => console.log('Set as default', item?.id),
    },
    {
        label: 'Withdraw',
        onClick: (item : any) => console.log(`Withdraw ${item.name}`),
    },
];


import { submitPayment } from '@/services/api';
import toast from 'react-hot-toast';
import { generateReference } from '@/utils/reference';

const parseAmount = (amountStr: string): string => {
    // Extract numeric value from strings like "RM 2,000.00"
    const n = parseFloat(String(amountStr).replace(/[^\d.-]/g, ''));
    return isFinite(n) ? n.toFixed(2) : '0.00';
};

export const BillingActions = [
    {
        label: 'View',
        onClick: (item: any) => console.log('View', item),
    },
    {
        label: 'Download',
        onClick: (item: any) => toast.success(`Downloading ${item.name}`),
    },
    {
        label: 'Pay',
    onClick: async (item: any) => {
            try {
                const orderid = generateReference('IXO');
                const amount = parseAmount(item?.lastInvoice?.amount);
                const bill_name = (typeof window !== 'undefined' ? (localStorage.getItem('name') || 'User') : 'User');
                const bill_email = (typeof window !== 'undefined' ? (localStorage.getItem('email') || 'user@example.com') : 'user@example.com');
                const bill_mobile = (typeof window !== 'undefined' ? (localStorage.getItem('mobile') || '0123456789') : '0123456789');
                const bill_desc = item?.name || 'IXORA';
                const country = 'MY';

                const res = await submitPayment({ orderid, amount, bill_name, bill_email, bill_mobile, bill_desc, country });
                if (res && typeof res.url === 'string' && res.url) {
                    if (typeof window !== 'undefined') window.location.href = res.url;
                    return;
                }
                const msg = typeof res?.message === 'string' ? res.message : 'Payment submitted';
                toast.success(msg);
            } catch (e: any) {
        const err = e?.response?.data?.message || e?.message || 'Failed to submit payment';
        toast.error(String(err));
            }
        },
    },
];

export const MySkbActions = [
    {
        label: 'View',
        onClick: (item : any) => console.log('View', item),
    },
    {
    label: 'Download',
    onClick: (item : any) => toast.success(`Downloading ${item.name}`),
    },
    {
    label: 'Pay',
    onClick: async (item : any) => {
        try {
            // Allow payment only when project is Pending (after admin approval)
            const status = String(item?.status || '').toLowerCase();
            if (status !== 'pending') {
                toast('Payment is available once the application is Pending');
                return;
            }

            const data = (item && typeof item === 'object' ? (item.data || item.form || {}) : {}) as any;
            // Primary: explicit processingFees on the form
            let amountNum = Number(data?.processingFees || 0);
            // Fallback: sum building processingFee
            if ((!amountNum || Number.isNaN(amountNum)) && Array.isArray(data?.buildings)) {
                amountNum = data.buildings.reduce((acc: number, b: any) => acc + Number(b?.processingFee || 0), 0);
            }
            if (!amountNum || Number.isNaN(amountNum) || amountNum <= 0) {
                toast.error('No processing fee found for this project.');
                return;
            }

            const orderid = generateReference('IXO');
            const amount = amountNum.toFixed(2);
            const bill_name = (typeof window !== 'undefined' ? (localStorage.getItem('name') || 'User') : 'User');
            const bill_email = (typeof window !== 'undefined' ? (localStorage.getItem('email') || 'user@example.com') : 'user@example.com');
            const bill_mobile = (typeof window !== 'undefined' ? (localStorage.getItem('mobile') || '0123456789') : '0123456789');
            const bill_desc = item?.name || `MySKB Project #${item?.id}`;
            const country = 'MY';

            const res = await submitPayment({ orderid, amount, bill_name, bill_email, bill_mobile, bill_desc, country });
            if (res && typeof res.url === 'string' && res.url) {
                if (typeof window !== 'undefined') window.location.href = res.url;
                return;
            }
            const msg = typeof res?.message === 'string' ? res.message : 'Payment submitted';
            toast.success(msg);
        } catch (e: any) {
            const err = e?.response?.data?.message || e?.message || 'Failed to submit payment';
            toast.error(String(err));
        }
    },
    },
    {
    label: 'Withdraw',
    onClick: (item : any) => toast(`Withdraw ${item.name}`),
        danger: true,
    }
]