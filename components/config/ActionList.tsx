export const RegistrationApplicationActions = [
    {
        label: 'Edit',
        onClick: (item : any) => console.log('Edit', item),
    },
    {
        label: 'Withdraw',
        onClick: (item : any) => console.log(`Withdraw ${item.name}`),
    },
];


import { submitPayment } from '@/services/api';

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
        onClick: (item: any) => alert(`Download ${item.name}`),
    },
    {
        label: 'Pay',
        onClick: async (item: any) => {
            try {
                const orderid = `IXOR-${Date.now()}`;
                const amount = parseAmount(item?.lastInvoice?.amount);
                const bill_name = (typeof window !== 'undefined' ? (localStorage.getItem('name') || 'User') : 'User');
                const bill_email = (typeof window !== 'undefined' ? (localStorage.getItem('email') || 'user@example.com') : 'user@example.com');
                const bill_mobile = (typeof window !== 'undefined' ? (localStorage.getItem('mobile') || '0123456789') : '0123456789');
                const bill_desc = item?.name || 'IXORA';
                const country = 'MY';

                const res = await submitPayment({ orderid, amount, bill_name, bill_email, bill_mobile, bill_desc, country });
                alert(res?.message || 'Payment submitted');
            } catch (e: any) {
                alert(e?.response?.data?.message || 'Failed to submit payment');
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
        onClick: (item : any) => alert(`Download ${item.name}`),
    },
    {
        label: 'Pay',
        onClick: (item : any) => alert(`Pay ${item.name}`),
    },
    {
        label: 'Withdraw',
        onClick: (item : any) => alert(`Withdraw ${item.name}`),
        danger: true,
    }
]