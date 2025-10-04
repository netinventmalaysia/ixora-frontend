import { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Button from 'todo/components/forms/Button';
import InputText from 'todo/components/forms/InputText';
import Spacing from 'todo/components/forms/Spacing';
import Heading from 'todo/components/forms/Heading';
import LineSeparator from 'todo/components/forms/LineSeparator';
import FormActions from 'todo/components/forms/FormActions';
import { CompoundBill, fetchCompoundOutstanding } from '@/services/api';
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
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
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
      setSelectedIds(new Set());
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
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === sortedBills.length) return new Set();
      return new Set(sortedBills.map((b) => b.id));
    });
  };

  const selectedBills = sortedBills.filter((b) => selectedIds.has(b.id));
  const totalSelected = selectedBills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

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
          <FormActions>
            <Button
              type="button"
              variant="primary"
              disabled={selectedIds.size === 0}
              onClick={() =>
                alert(
                  'Proceed to payment with ' +
                    selectedIds.size +
                    ' bill(s) totaling RM ' +
                    totalSelected.toFixed(2)
                )
              }
            >
              {t('compound.paySelected', 'Pay selected')}
            </Button>
          </FormActions>
        </form>
      </FormProvider>
    </SidebarLayout>
  );
}
