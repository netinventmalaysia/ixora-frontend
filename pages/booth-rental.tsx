import { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import FormWrapper from 'todo/components/forms/FormWrapper';
import Button from 'todo/components/forms/Button';
import Spacing from 'todo/components/forms/Spacing';
import Heading from 'todo/components/forms/Heading';
import LineSeparator from 'todo/components/forms/LineSeparator';
import FormActions from 'todo/components/forms/FormActions';
import { BoothBill, fetchBoothOutstanding } from '@/services/api';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import AssessmentBillsTable from '@/components/assessment/AssessmentBillsTable';
import SearchControls from '@/components/assessment/SearchControls';

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
      const mapped = params.searchType === 'ic' ? { ic: params.query } : { booth_no: params.query };
      const res = await fetchBoothOutstanding(mapped as any);
      const list: BoothBill[] = Array.isArray(res) ? (res as any) : (res?.data || []);
      setBills(list);
      setSelectedIds(new Set());
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
      <FormProvider {...methods}>
        <FormWrapper onSubmit={handleSubmit(onSearch)}>
          <Heading level={2} align="left" bold>
            {t('booth.title', 'Booth Rental')}
          </Heading>
          <Spacing size="md" />

          <SearchControls
            loading={loading}
            onRefresh={() => fetchData(getValues())}
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
              {t('booth.paySelected', 'Pay selected')}
            </Button>
          </FormActions>
        </FormWrapper>
      </FormProvider>
    </SidebarLayout>
  );
}
