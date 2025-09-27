import React, { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import RadioGroupField from 'todo/components/forms/RadioGroupField';
import InputText from 'todo/components/forms/InputText';
import Button from 'todo/components/forms/Button';
import { useTranslation } from '@/utils/i18n';

type SearchType = 'ic' | 'assessment';

export default function SearchControls({
  loading,
  onRefresh,
  t,
}: {
  loading: boolean;
  onRefresh: () => void;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const { control } = useFormContext();
  const currentType = useWatch({ control, name: 'searchType' }) as SearchType | undefined;

  // No debug logs here to keep UI clean
  // const didMountRef = useRef(false);
  // useEffect(() => {
  //   if (!didMountRef.current) { didMountRef.current = true; return; }
  // }, [currentType]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <RadioGroupField
          name="searchType"
          label={t('assessment.searchBy', 'Search by')}
          inline
          options={[
            { label: t('assessment.byIc', 'IC Number'), value: 'ic' },
            { label: t('assessment.byAssessment', 'Assessment No.'), value: 'assessment' },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <InputText
            key={currentType || 'ic'}
            id="query"
            name="query"
            label={currentType === 'ic' ? t('assessment.ic', 'IC Number') : t('assessment.assessmentNo', 'Assessment No.')}
            placeholder={currentType === 'ic' ? t('assessment.icPlaceholder', 'Enter IC Number') : t('assessment.assessmentPlaceholder', 'Enter Assessment No.')}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={loading}>
            {t('common.search', 'Search')}
          </Button>
          <Button type="button" variant="secondary" onClick={onRefresh} disabled={loading}>
            {t('common.refresh', 'Refresh')}
          </Button>
        </div>
      </div>
    </div>
  );
}
