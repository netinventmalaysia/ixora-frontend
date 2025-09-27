import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import RadioGroupField from 'todo/components/forms/RadioGroupField';
import InputText from 'todo/components/forms/InputText';
import Button from 'todo/components/forms/Button';
import { useTranslation } from '@/utils/i18n';

type SearchType = string; // treat as flexible; 'ic' is special-cased below

type SecondOption = {
  label: string;
  value: string; // e.g., 'assessment' | 'compound'
};

export default function SearchControls({
  loading,
  onRefresh,
  t,
  secondOption = { label: t('assessment.byAssessment', 'Assessment No.'), value: 'assessment' },
  numberFieldLabel = t('assessment.assessmentNo', 'Assessment No.'),
  numberFieldPlaceholder = t('assessment.assessmentPlaceholder', 'Enter Assessment No.'),
  icFieldLabel = t('assessment.ic', 'IC Number'),
  icFieldPlaceholder = t('assessment.icPlaceholder', 'Enter IC Number'),
}: {
  loading: boolean;
  onRefresh: () => void;
  t: ReturnType<typeof useTranslation>['t'];
  secondOption?: SecondOption;
  numberFieldLabel?: string;
  numberFieldPlaceholder?: string;
  icFieldLabel?: string;
  icFieldPlaceholder?: string;
}) {
  const { control } = useFormContext();
  const currentType = useWatch({ control, name: 'searchType' }) as SearchType | undefined;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <RadioGroupField
          name="searchType"
          label={t('assessment.searchBy', 'Search by')}
          inline
          options={[
            { label: t('assessment.byIc', 'IC Number'), value: 'ic' },
            { label: secondOption.label, value: secondOption.value },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <InputText
            key={currentType || 'ic'}
            id="query"
            name="query"
            label={currentType === 'ic' ? icFieldLabel : numberFieldLabel}
            placeholder={currentType === 'ic' ? icFieldPlaceholder : numberFieldPlaceholder}
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
