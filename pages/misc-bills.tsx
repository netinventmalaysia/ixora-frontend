import { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import FormWrapper from 'todo/components/forms/FormWrapper';
import Button from 'todo/components/forms/Button';
import Spacing from 'todo/components/forms/Spacing';
import Heading from 'todo/components/forms/Heading';
import LineSeparator from 'todo/components/forms/LineSeparator';
import FormActions from 'todo/components/forms/FormActions';
import { MiscBill, fetchMiscOutstanding } from '@/services/api';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import AssessmentBillsTable from '@/components/assessment/AssessmentBillsTable';
import SearchControls from '@/components/assessment/SearchControls';

type SearchType = 'ic' | 'misc';
type FormValues = { searchType: SearchType; query: string };

export default function MiscBillsPage() {
  const { t } = useTranslation();
  const icDefault = typeof window !== 'undefined' ? localStorage.getItem('ic') || '' : '';
  const methods = useForm<FormValues>({ defaultValues: { searchType: 'ic', query: icDefault } });
  const { handleSubmit, getValues } = methods;

  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState<MiscBill[]>([]);
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
      const mapped = params.searchType === 'ic' ? { ic: params.query } : { misc_no: params.query };
      const res = await fetchMiscOutstanding(mapped as any);
      const list: MiscBill[] = Array.isArray(res) ? (res as any) : (res?.data || []);
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
            {t('misc.title', 'Miscellaneous Bills')}
          </Heading>
          <Spacing size="md" />

          <SearchControls
            loading={loading}
            onRefresh={() => fetchData(getValues())}
            t={t}
            secondOption={{ label: t('misc.byBill', 'Bill Reference No.'), value: 'misc' }}
            numberFieldLabel={t('misc.billRef', 'Bill Reference No.')}
            numberFieldPlaceholder={t('misc.billPlaceholder', 'Enter Bill Reference No.')}
            icFieldLabel={t('misc.ic', 'IC Number')}
            icFieldPlaceholder={t('misc.icPlaceholder', 'Enter IC Number')}
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
              {t('misc.paySelected', 'Pay selected')}
            </Button>
          </FormActions>
        </FormWrapper>
      </FormProvider>
    </SidebarLayout>
  );
}
