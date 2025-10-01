import { useEffect, useMemo, useRef, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import FormWrapper from 'todo/components/forms/FormWrapper';
import InputText from 'todo/components/forms/InputText';
import Button from 'todo/components/forms/Button';
import Spacing from 'todo/components/forms/Spacing';
import Heading from 'todo/components/forms/Heading';
import LineSeparator from 'todo/components/forms/LineSeparator';
import FormActions from 'todo/components/forms/FormActions';
import RadioGroupField from 'todo/components/forms/RadioGroupField';
import { AssessmentBill, fetchAssessmentOutstanding } from '@/services/api';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import AssessmentBillsTable from '@/components/assessment/AssessmentBillsTable';
import SearchControls from '@/components/assessment/SearchControls';
import LogoSpinner from '@/components/common/LogoSpinner';

type SearchType = 'ic' | 'account' | 'bill';
type FormValues = {
  searchType: SearchType;
  query: string;
  bill_no?: string; // optional narrowing
};

export default function AssessmentTaxPage() {
  const { t } = useTranslation();
  const icDefault = typeof window !== 'undefined' ? localStorage.getItem('ic') || '' : '';
  const methods = useForm<FormValues>({
    defaultValues: {
      searchType: 'ic',
      query: icDefault,
      bill_no: '',
    },
  });
  const { handleSubmit, getValues } = methods;

  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState<AssessmentBill[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
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
      console.log('[Assessment] form params:', params);
      const mapped: any =
        params.searchType === 'ic' ? { ic: params.query }
        : params.searchType === 'account' ? { account_no: params.query }
        : { bill_no: params.query };
      console.log('[Assessment] mapped query:', mapped);
      const res = await fetchAssessmentOutstanding(mapped as any);
      const list: AssessmentBill[] = Array.isArray(res) ? res as any : (res?.data || []);
      setBills(list);
      setSelectedIds(new Set());
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
    console.log('[Assessment] onSearch submit:', data);
    fetchData(data);
  };

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
  const totalSelected = selectedBills.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <SidebarLayout>
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60" aria-hidden="true">
          <LogoSpinner size={56} className="drop-shadow-md" title={t('common.loading', 'Loading...')} />
        </div>
      )}
      <FormProvider {...methods}>
        <FormWrapper onSubmit={handleSubmit(onSearch)}>
          <Heading level={2} align="left" bold>
            {t('assessment.title', 'Assessment Tax')}
          </Heading>
          <Spacing size="md" />

          <SearchControls
            loading={loading}
            onRefresh={() => handleSubmit(onSearch)()}
            t={t}
            // multiple radio options: Account No., Bill No.
            extras={[
              {
                label: t('assessment.byAccount', 'Account No.'),
                value: 'account',
                numberFieldLabel: t('assessment.accountNo', 'Account No.'),
                numberFieldPlaceholder: t('assessment.accountPlaceholder', 'Enter Account No.'),
              },
              {
                label: t('assessment.byBill', 'Bill No.'),
                value: 'bill',
                numberFieldLabel: t('assessment.billNo', 'Bill No.'),
                numberFieldPlaceholder: t('assessment.billNoPlaceholder', 'Enter Bill No.'),
              },
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
          />

          <Spacing size="md" />
          <FormActions>
            <Button type="button" variant="primary" disabled={selectedIds.size === 0} onClick={() => alert('Proceed to payment with ' + selectedIds.size + ' bill(s) totaling RM ' + totalSelected.toFixed(2))}>
              {t('assessment.paySelected', 'Pay selected')}
            </Button>
          </FormActions>
        </FormWrapper>
      </FormProvider>
    </SidebarLayout>
  );
}
