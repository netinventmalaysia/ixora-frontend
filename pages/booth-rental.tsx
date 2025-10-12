import { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
// removed FormWrapper to avoid nested form contexts
// Button + FormActions removed (global checkout tray handles payment)
import Spacing from 'todo/components/forms/Spacing';
import Heading from 'todo/components/forms/Heading';
import LineSeparator from 'todo/components/forms/LineSeparator';
// import FormActions from 'todo/components/forms/FormActions';
import { BoothBill, fetchBoothOutstanding, fetchBillingItemsByBillNo } from '@/services/api';
import { useBillSelection } from '@/context/BillSelectionContext';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import AssessmentBillsTable from '@/components/assessment/AssessmentBillsTable';
import SearchControls from '@/components/assessment/SearchControls';
import LogoSpinner from '@/components/common/LogoSpinner';

type SearchType = 'ic' | 'booth';
type FormValues = {
  searchType: SearchType;
  query: string;
};

export default function BoothRentalPage() {
  const { t } = useTranslation();
  const icDefault = typeof window !== 'undefined' ? localStorage.getItem('ic') || '' : '';
  const methods = useForm<FormValues>({
    defaultValues: { searchType: 'ic', query: icDefault },
  });
  const { handleSubmit, getValues } = methods;

  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState<BoothBill[]>([]);
  const [paidLookup, setPaidLookup] = useState<Record<string, { paid: boolean; reference?: string }>>({});
  // Global selection (remove local selectedIds/pay button)
  const { add, remove, has } = useBillSelection();
  const [error, setError] = useState<string | null>(null);

  const sortedBills = useMemo(() => {
    const copy = [...bills];
    copy.sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime());
    return copy;
  }, [bills]);

  const fetchData = async (params: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const mapped = params.searchType === 'ic' ? { ic: params.query } : { account_no: params.query };
      const res = await fetchBoothOutstanding(mapped as any);
      const list: BoothBill[] = Array.isArray(res) ? (res as any) : (res?.data || []);
      setBills(list);
  // Do not clear global selection; allow cross-page aggregation
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const v = getValues();
    if (v.query && v.searchType === 'ic') {
      fetchData(v);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => fetchData(getValues());
    window.addEventListener('ixora:pulltorefresh', handler as EventListener);
    return () => window.removeEventListener('ixora:pulltorefresh', handler as EventListener);
  }, [getValues]);

  const onSearch = (data: FormValues) => fetchData(data);

  const toggleSelect = (id: string | number) => {
    const bill = sortedBills.find(b => b.id === id);
    if (!bill) return;
    if (bill.bill_no && paidLookup[bill.bill_no]?.paid) return;
    const selectable = {
      id: bill.id,
      bill_no: bill.bill_no,
      amount: bill.amount,
      due_date: bill.due_date,
      description: bill.description,
      source: 'booth' as const,
      meta: { item_type: '02', account_no: String(bill.id), raw: bill }
    };
    if (has(selectable)) remove(selectable); else if (bill.amount > 0) add(selectable);
  };

  const toggleAll = () => {
    const selectableBills = sortedBills.filter(b => !(b.bill_no && paidLookup[b.bill_no]?.paid));
    const allSelected = selectableBills.every(b => has({ id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'booth', meta: { item_type: '02', account_no: String(b.id) } } as any));
    selectableBills.forEach(b => {
      const selectable = { id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'booth' as const, meta: { item_type: '02', account_no: String(b.id), raw: b } };
      if (allSelected) remove(selectable); else if (!has(selectable) && b.amount > 0) add(selectable);
    });
  };

  const selectedIds = useMemo(() => new Set(sortedBills.filter(b => !paidLookup[b.bill_no]?.paid && has({ id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'booth', meta: { item_type: '02', account_no: String(b.id) } } as any)).map(b => b.id)), [sortedBills, has, paidLookup]);

  // Lookup and purge paid bills
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const unique = Array.from(new Set((bills || []).map(b => b.bill_no).filter(Boolean)));
      const results: Record<string, { paid: boolean; reference?: string }> = {};
      await Promise.all(unique.map(async (bn) => {
        const list = await fetchBillingItemsByBillNo(bn!);
        const paidItem = (list || []).find(it => String(it?.status || it?.billing_status || '').toUpperCase() === 'PAID');
        results[bn!] = paidItem ? { paid: true, reference: paidItem.reference } : { paid: false };
      }));
      if (!cancelled) {
        setPaidLookup(results);
        (bills || []).forEach(b => {
          if (b.bill_no && results[b.bill_no]?.paid) {
            const selectable = { id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'booth' as const, meta: { item_type: '02', account_no: String(b.id), raw: b } };
            if (has(selectable)) remove(selectable);
          }
        });
      }
    };
    if ((bills || []).length > 0) run(); else setPaidLookup({});
    return () => { cancelled = true; };
  }, [bills]);

  const onReceipt = (bill_no: string, reference?: string) => {
    if (reference) window.location.href = `/payment-status/${encodeURIComponent(reference)}`;
  };

  return (
    <SidebarLayout>
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60" aria-hidden="true">
          <LogoSpinner size={56} className="drop-shadow-md" title={t('common.loading', 'Loading...')} />
        </div>
      )}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSearch)} className="w-full max-w-3xl mx-auto">
          <Heading level={2} align="left" bold>
            {t('booth.title', 'Booth Rental')}
          </Heading>
          <Spacing size="md" />

          <SearchControls
            loading={loading}
            onRefresh={() => handleSubmit(onSearch)()}
            t={t}
            secondOption={{ label: t('booth.byBooth', 'Booth Reference No.'), value: 'booth' }}
            numberFieldLabel={t('booth.boothNo', 'Booth Reference No.')}
            numberFieldPlaceholder={t('booth.boothPlaceholder', 'Enter Booth Reference No.')}
            icFieldLabel={t('booth.ic', 'IC Number')}
            icFieldPlaceholder={t('booth.icPlaceholder', 'Enter IC Number')}
          />

          <Spacing size="md" />
          <LineSeparator />
          <Spacing size="md" />

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {loading && <p className="text-gray-600 text-sm">{t('common.loading', 'Loading...')}</p>}

          <AssessmentBillsTable
            bills={sortedBills as any}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
            onToggleAll={toggleAll}
            loading={loading}
            t={t}
            paidLookup={paidLookup}
            onReceipt={onReceipt}
          />

          <Spacing size="md" />
          {/* Local pay button removed in favor of global CheckoutTray */}
        </form>
      </FormProvider>
    </SidebarLayout>
  );
}
