import { useState, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Heading from '../forms/Heading';
import Spacing from '../forms/Spacing';
import LayoutWithoutSidebar from '../main/LayoutWithoutSidebar';
import LineSeparator from '../forms/LineSeparator';
import { invoices as staticInvoices } from '../data/CardList';
import { statusColors } from '../config/StatusColors';
import CardList from '../forms/CardList';
import { businessNameOptions } from '../data/SelectionList';
import { fetchMyBusinesses, fetchBillings, submitPayment } from '@/services/api';
import toast from 'react-hot-toast';
import SelectField from '../forms/SelectField';
import { BillingActions } from '../config/ActionList';
import FilterTabs from '../forms/FilterTabs';
import Tabs, { Tab } from '../forms/Tab';
import Button from '../forms/Button';

export default function Billing() {
    const methods = useForm();
    const [currentTab, setCurrentTab] = useState<string>('All');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [businessId, setBusinessId] = useState<number | null>(null);
    const [businessOptions, setBusinessOptions] = useState<{ value: number; label: string }[]>([]);
    const [fetchedInvoices, setFetchedInvoices] = useState<any[] | null>(null);
    const [loadingInvoices, setLoadingInvoices] = useState(false);

    // Choose data source (live from API or static fallback)
    const sourceInvoices = fetchedInvoices && Array.isArray(fetchedInvoices) ? fetchedInvoices : staticInvoices;

    // Helpers to normalize and classify statuses
    const getStatus = (inv: any) => String(inv?.lastInvoice?.status ?? '').toLowerCase();
    const isPaid = (inv: any) => getStatus(inv) === 'paid';
    const isPending = (inv: any) => /^(overdue|pending|unpaid)$/.test(getStatus(inv));

    // Dynamic badge counts based on current sourceInvoices
    const counts = useMemo(() => {
      const all = Array.isArray(sourceInvoices) ? sourceInvoices.length : 0;
      const pending = Array.isArray(sourceInvoices) ? sourceInvoices.filter(isPending).length : 0;
      const paid = Array.isArray(sourceInvoices) ? sourceInvoices.filter(isPaid).length : 0;
      return { all, pending, paid };
    }, [sourceInvoices]);

    const tabOptions: Tab[] = [
      { name: 'All', href: '#', badge: String(counts.all), badgeColor: 'blue' },
      { name: 'Pending Payment', href: '#', badge: String(counts.pending), badgeColor: 'red' },
      { name: 'Paid', href: '#', badge: String(counts.paid), badgeColor: 'green' },
    ];

    const filteredBilling = sourceInvoices.filter((invoice: any) => {
      if (currentTab === 'All') return true;
      if (currentTab === 'Pending Payment') return isPending(invoice);
      if (currentTab === 'Paid') return isPaid(invoice);
      return true;
    });

    const handleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const totalAmount = filteredBilling
        .filter(item => selectedIds.includes(item.id))
        .reduce((sum, item) => sum + parseFloat(item.lastInvoice.amount.replace(/[^\d.-]/g, '')), 0);

        // Helper to get a readable message from API responses
        const getApiMessage = (res: any, fallback: string) => {
                if (!res) return fallback;
                if (typeof res === 'string') return res;
                if (typeof res?.message === 'string') return res.message;
                if (typeof res?.msg === 'string') return res.msg;
                if (res?.status && typeof res.status === 'string' && !/^(error|fail)/i.test(res.status)) return res.status;
                try {
                    const s = JSON.stringify(res?.message ?? res);
                    return s.length > 140 ? fallback : s;
                } catch {
                    return fallback;
                }
        };

        const handlePaySelected = async () => {
                const selectedInvoices = sourceInvoices.filter((inv: any) => selectedIds.includes(inv.id));
                if (selectedInvoices.length === 0) return;

                // For now, submit as one consolidated payment with total amount
                const orderid = `IXOR-${Date.now()}`;
                const amount = totalAmount.toFixed(2);
                const bill_name = (typeof window !== 'undefined' ? (localStorage.getItem('name') || 'User') : 'User');
                const bill_email = (typeof window !== 'undefined' ? (localStorage.getItem('email') || 'user@example.com') : 'user@example.com');
                const bill_mobile = (typeof window !== 'undefined' ? (localStorage.getItem('mobile') || '0123456789') : '0123456789');
                const bill_desc = selectedInvoices.map((s: any) => s?.name).filter(Boolean).join(', ').slice(0, 120) || 'IXORA';
                const country = 'MY';

                try {
                    const res = await submitPayment({ orderid, amount, bill_name, bill_email, bill_mobile, bill_desc, country });
                    if (res && typeof res.url === 'string' && res.url) {
                        // Redirect user to payment gateway
                        if (typeof window !== 'undefined') window.location.href = res.url;
                        return;
                    }
                    toast.success(getApiMessage(res, 'Payment submitted'));
                } catch (e: any) {
                    const errMsg = getApiMessage(e?.response?.data ?? e?.message, 'Failed to submit payment');
                    toast.error(errMsg);
                }
        };

    useEffect(() => {
        // fetch user's businesses and populate select options (similar to Business Team Management)
        fetchMyBusinesses()
            .then((data) => {
                if (!data || (Array.isArray(data) && data.length === 0)) {
                    // keep fallback static options but inform user
                    // toast.info('No businesses found. Showing default options.');
                    return;
                }
                // exclude withdrawn businesses
                const isWithdrawn = (item: any) => {
                    const direct = (item && (item.status || item.state || item.applicationStatus || item.statusName || item.currentStatus || item.application_status || item.status_name || item.current_status));
                    if (typeof direct === 'string') {
                        return String(direct).toLowerCase() === 'withdrawn';
                    }
                    for (const [k, v] of Object.entries(item || {})) {
                        if (typeof v === 'string' && /withdrawn/i.test(String(v))) return true;
                    }
                    return false;
                };

                const options = (data as any[])
                    .filter((biz) => !isWithdrawn(biz))
                    .map((biz) => ({
                        value: biz.id,
                        label: biz.name || biz.companyName || `#${biz.id}`,
                    }));
                setBusinessOptions(options);
                // Preselect default if exists and present in options
                try {
                    const saved = typeof window !== 'undefined' ? localStorage.getItem('activeBusinessId') : null;
                    if (saved) {
                        const id = Number(saved);
                        if (!Number.isNaN(id) && options.some(o => Number(o.value) === id)) {
                            setBusinessId(id);
                        }
                    }
                } catch {}
            })
            .catch((err) => {
                console.error('Failed to fetch businesses for billing select', err);
                toast.error('Failed to load your businesses');
            });
    }, []);

    // React to default business changes across the app
    useEffect(() => {
        const handler = () => {
            try {
                const saved = typeof window !== 'undefined' ? localStorage.getItem('activeBusinessId') : null;
                if (saved) {
                    const id = Number(saved);
                    if (!Number.isNaN(id)) setBusinessId(id);
                }
            } catch {}
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('ixora:businessChange', handler as EventListener);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('ixora:businessChange', handler as EventListener);
            }
        };
    }, []);

    // Fetch billings when a business is selected
    useEffect(() => {
        if (!businessId) return;

        setLoadingInvoices(true);
        fetchBillings(businessId)
            .then((data) => {
                if (!data) {
                    setFetchedInvoices([]);
                    toast('No billings found for selected business');
                    return;
                }

                setFetchedInvoices(Array.isArray(data) ? data : [data]);
            })
            .catch((err) => {
                console.error('Failed to fetch billings for business', err);
                toast.error('Failed to load billings');
                setFetchedInvoices([]);
            })
            .finally(() => setLoadingInvoices(false));
    }, [businessId]);

    return (
        <FormProvider {...methods}>
            <LayoutWithoutSidebar shiftY="-translate-y-0">
                <Heading level={5} align="left" bold>
                    Invoice Billing
                </Heading>

                <Spacing size="lg" />
                <SelectField id="businessName" name="businessName" label="Business Name" options={(businessOptions.length > 0 ? businessOptions : businessNameOptions)} onChange={(e) => setBusinessId(Number(e.target.value))} />

                <Spacing size="sm" />
                <LineSeparator />

                <FilterTabs
                    tabs={tabOptions}
                    currentTab={currentTab}
                    onTabChange={(tab) => {
                        setCurrentTab(tab.name);
                        setSelectedIds([]); // Clear selection on tab switch
                    }}
                />

                {currentTab === 'Pending Payment' && (
                    <>
                        <div className="flex justify-between items-center mt-4 mb-2">
                            <p className="text-sm font-semibold text-gray-700">
                                Total Selected: RM {totalAmount.toFixed(2)}
                            </p>
                            <Button
                                onClick={handlePaySelected}
                                disabled={selectedIds.length === 0}
                                className="px-4 py-2 text-sm"
                            >
                                Pay Selected
                            </Button>
                        </div>
                    </>
                )}

                <CardList
                    items={filteredBilling}
                    statusColors={statusColors}
                    actions={BillingActions}
                    selectable={currentTab === 'Pending Payment'}
                    selectedIds={selectedIds}
                    onSelect={handleSelect}
                />
            </LayoutWithoutSidebar>
        </FormProvider>
    );
}
