import { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
// removed FormWrapper to avoid nested form contexts
import InputText from 'todo/components/forms/InputText';
import Button from 'todo/components/forms/Button';
import Spacing from 'todo/components/forms/Spacing';
import Heading from 'todo/components/forms/Heading';
import LineSeparator from 'todo/components/forms/LineSeparator';
import FormActions from 'todo/components/forms/FormActions';
import RadioGroupField from 'todo/components/forms/RadioGroupField';
import { AssessmentBill, fetchAssessmentOutstanding, fetchBillingItemsByBillNo } from '@/services/api';
import { useBillSelection } from '@/context/BillSelectionContext';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import AssessmentBillsTable from '@/components/assessment/AssessmentBillsTable';
import SearchControls from '@/components/assessment/SearchControls';
import LogoSpinner from '@/components/common/LogoSpinner';

type SearchType = 'ic' | 'account' | 'bill';
type FormValues = {
  searchType: SearchType;
  query: string;
};

export default function AssessmentTaxPage() {
  const { t } = useTranslation();
  const icDefault = typeof window !== 'undefined' ? localStorage.getItem('ic') || '' : '';
  const methods = useForm<FormValues>({
    defaultValues: {
      searchType: 'ic',
      query: icDefault,
    },
  });
  const { handleSubmit, getValues } = methods;

  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState<AssessmentBill[]>([]);
  const [paidLookup, setPaidLookup] = useState<Record<string, { paid: boolean; reference?: string }>>({});
  // Global selection store
  const { add, remove, has } = useBillSelection();
  const [error, setError] = useState<string | null>(null);

  const sortedBills = useMemo(() => {
    const copy = [...bills];
    copy.sort((a, b) => {
      const da = new Date(a.due_date).getTime();
      const db = new Date(b.due_date).getTime();
      return db - da; // latest first
    });
    return copy;
  }, [bills]);

  const fetchData = async (params: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const mapped = params.searchType === 'ic'
        ? { ic: params.query }
        : params.searchType === 'account'
          ? { account_no: params.query }
          : { bill_no: params.query };
  const list = await fetchAssessmentOutstanding(mapped as any);
  if (typeof window !== 'undefined') console.log('[Assessment] received bills length:', list.length, 'sample:', list[0]);
  setBills(list as AssessmentBill[]);
  // No need to manually clear global selection; we allow cross-page multi-category.
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // On load: auto fetch by IC if exists
  useEffect(() => {
    const v = getValues();
    if (v.query && v.searchType === 'ic') {
      fetchData(v);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global pull-to-refresh handler
  useEffect(() => {
    const handler = () => fetchData(getValues());
    window.addEventListener('ixora:pulltorefresh', handler as EventListener);
    return () => window.removeEventListener('ixora:pulltorefresh', handler as EventListener);
  }, [getValues]);

  const onSearch = (data: FormValues) => {
    fetchData(data);
  };

  const toggleSelect = (id: string | number) => {
    const bill = sortedBills.find(b => b.id === id);
    if (!bill) return;
    // Prevent selecting paid items
    if (bill.bill_no && paidLookup[bill.bill_no]?.paid) return;
    const selectable = {
      id: bill.id,
      bill_no: bill.bill_no,
      amount: bill.amount,
      due_date: bill.due_date,
      description: bill.description,
      source: 'assessment' as const,
      meta: { item_type: '01', account_no: String(bill.id), raw: bill }
    };
    if (has(selectable)) remove(selectable); else add(selectable);
  };

  const toggleAll = () => {
    const selectableBills = sortedBills.filter(b => !(b.bill_no && paidLookup[b.bill_no]?.paid));
    const allSelected = selectableBills.every(b => has({ id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'assessment', meta: { item_type: '01', account_no: String(b.id) } } as any));
    selectableBills.forEach(b => {
      const selectable = { id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'assessment' as const, meta: { item_type: '01', account_no: String(b.id), raw: b } };
      if (allSelected) remove(selectable); else if (!has(selectable) && b.amount > 0) add(selectable);
    });
  };

  const selectedIds = useMemo(() => new Set(sortedBills.filter(b => !paidLookup[b.bill_no]?.paid && has({ id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'assessment', meta: { item_type: '01', account_no: String(b.id) } } as any)).map(b => b.id)), [sortedBills, has, paidLookup]);

  // After bills load, lookup each bill_no to see if it was already paid
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const unique = Array.from(new Set((bills || []).map(b => b.bill_no).filter(Boolean)));
      const results: Record<string, { paid: boolean; reference?: string }> = {};
      await Promise.all(unique.map(async (bn) => {
        const list = await fetchBillingItemsByBillNo(bn!);
        // Consider paid if any item has status PAID (case-insensitive)
        const paidItem = (list || []).find(it => String(it?.status || it?.billing_status || '').toUpperCase() === 'PAID');
        if (paidItem) {
          results[bn!] = { paid: true, reference: paidItem.reference };
        } else {
          results[bn!] = { paid: false };
        }
      }));
      if (!cancelled) {
        setPaidLookup(results);
        // Also purge any now-paid bills from the global selection to prevent checkout
        (bills || []).forEach(b => {
          if (b.bill_no && results[b.bill_no]?.paid) {
            const selectable = { id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'assessment' as const, meta: { item_type: '01', account_no: String(b.id), raw: b } };
            if (has(selectable)) remove(selectable);
          }
        });
      }
    };
    if ((bills || []).length > 0) run(); else setPaidLookup({});
    return () => { cancelled = true; };
  }, [bills]);

  const onReceipt = (bill_no: string, reference?: string) => {
    if (reference) {
      window.location.href = `/payment-status/${encodeURIComponent(reference)}`;
    } else {
      // fallback: just search by bill no into the status page query (legacy) if needed
      window.location.href = `/payment-status?bill_no=${encodeURIComponent(bill_no)}`;
    }
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
            {t('assessment.title', 'Assessment Tax')}
          </Heading>
          <Spacing size="md" />

          <SearchControls
            loading={loading}
            onRefresh={() => handleSubmit(onSearch)()}
            t={t}
            extras={[
              { label: t('assessment.byAccount', 'Account No.'), value: 'account', numberFieldLabel: t('assessment.accountNo', 'Account No.'), numberFieldPlaceholder: t('assessment.accountPlaceholder', 'Enter Account No.') },
              { label: t('assessment.byBill', 'Bill No.'), value: 'bill', numberFieldLabel: t('assessment.billNo', 'Bill No.'), numberFieldPlaceholder: t('assessment.billNoPlaceholder', 'Enter Bill No.') },
            ]}
          />

          <Spacing size="md" />
          <LineSeparator />
          <Spacing size="md" />

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {loading && <p className="text-gray-600 text-sm">{t('common.loading', 'Loading...')}</p>}

          <AssessmentBillsTable
            bills={sortedBills}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
            onToggleAll={toggleAll}
            loading={loading}
            t={t}
            paidLookup={paidLookup}
            onReceipt={onReceipt}
          />

          <Spacing size="md" />
          {/* Per-page pay button removed in favor of global checkout tray */}
        </form>
      </FormProvider>
    </SidebarLayout>
  );
}
