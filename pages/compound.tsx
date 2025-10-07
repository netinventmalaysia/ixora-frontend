import { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
// Button & per-page FormActions removed (global checkout tray)
import InputText from 'todo/components/forms/InputText';
import Spacing from 'todo/components/forms/Spacing';
import Heading from 'todo/components/forms/Heading';
import LineSeparator from 'todo/components/forms/LineSeparator';
// import FormActions from 'todo/components/forms/FormActions';
import { CompoundBill, fetchCompoundOutstanding } from '@/services/api';
import { useBillSelection } from '@/context/BillSelectionContext';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import AssessmentBillsTable from '@/components/assessment/AssessmentBillsTable';
import SearchControls from '@/components/assessment/SearchControls';
import LogoSpinner from '@/components/common/LogoSpinner';

type SearchType = 'ic' | 'compound';
type FormValues = {
  searchType: SearchType;
  query: string;
  vehicle_registration_no?: string;
};

export default function CompoundPage() {
  const { t } = useTranslation();
  const icDefault = typeof window !== 'undefined' ? localStorage.getItem('ic') || '' : '';
  const methods = useForm<FormValues>({
    defaultValues: {
      searchType: 'ic',
      query: icDefault,
      vehicle_registration_no: '',
    },
  });
  const { handleSubmit, getValues } = methods;

  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState<CompoundBill[]>([]);
  // Global selection
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
      const trimmedQuery = (params.query || '').trim();
      const trimmedVrn = (params.vehicle_registration_no || '').trim();
      if (!trimmedQuery && !trimmedVrn) {
        setError(t('compound.requireQuery', 'Please enter IC, Compound No., or Vehicle Registration No.'));
        console.warn('[Compound] No IC/Compound/VRN provided; skipping request');
        return;
      }
      let mapped: any = {};
      if (trimmedQuery) {
        mapped = params.searchType === 'ic' ? { ic: trimmedQuery } : { compound_no: trimmedQuery };
        if (trimmedVrn) mapped.vehicle_registration_no = trimmedVrn; // optional narrowing
      } else {
        mapped = { vehicle_registration_no: trimmedVrn };
      }
      console.log('[Compound] form params:', params);
      console.log('[Compound] mapped query:', mapped);
      const res = await fetchCompoundOutstanding(mapped as any);
      const list: CompoundBill[] = Array.isArray(res) ? (res as any) : (res?.data || []);
  setBills(list);
  // Do not clear global selection to allow multi-category checkout
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch by IC if present
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
    const selectable = {
      id: bill.id,
      bill_no: bill.bill_no,
      amount: bill.amount,
      due_date: bill.due_date,
      description: bill.description,
      source: 'compound' as const,
      meta: { item_type: '04', compound_no: String(bill.id), raw: bill }
    };
    if (has(selectable)) remove(selectable); else if (bill.amount > 0) add(selectable);
  };

  const toggleAll = () => {
  const allSelected = sortedBills.every(b => has({ id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'compound', meta: { item_type: '04', compound_no: String(b.id) } } as any));
    sortedBills.forEach(b => {
  const selectable = { id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'compound' as const, meta: { item_type: '04', compound_no: String(b.id), raw: b } };
      if (allSelected) remove(selectable); else if (!has(selectable) && b.amount > 0) add(selectable);
    });
  };

  const selectedIds = useMemo(() => new Set(sortedBills.filter(b => has({ id: b.id, bill_no: b.bill_no, amount: b.amount, due_date: b.due_date, description: b.description, source: 'compound', meta: { item_type: '04', compound_no: String(b.id) } } as any)).map(b => b.id)), [sortedBills, has]);

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
            {t('compound.title', 'Compound')}
          </Heading>
          <Spacing size="md" />

          <SearchControls
            loading={loading}
            onRefresh={() => handleSubmit(onSearch)()}
            t={t}
            secondOption={{ label: t('compound.byCompound', 'Compound No.'), value: 'compound' }}
            numberFieldLabel={t('compound.compoundNo', 'Compound No.')}
            numberFieldPlaceholder={t('compound.compoundPlaceholder', 'Enter Compound No.')}
            icFieldLabel={t('compound.ic', 'IC Number')}
            icFieldPlaceholder={t('compound.icPlaceholder', 'Enter IC Number')}
          />

          <Spacing size="sm" />
          <InputText
            id="vehicle_registration_no"
            name="vehicle_registration_no"
            label={t('compound.vrnOpt', 'Vehicle Registration No. (optional)')}
            placeholder={t('compound.vrnPlaceholder', 'Enter Vehicle Registration No.')}
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
          />

          <Spacing size="md" />
          {/* Local pay button removed in favor of global CheckoutTray */}
        </form>
      </FormProvider>
    </SidebarLayout>
  );
}
