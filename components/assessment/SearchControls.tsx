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

type ExtraOption = {
  label: string;
  value: string;
  numberFieldLabel?: string;
  numberFieldPlaceholder?: string;
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
  extras,
}: {
  loading: boolean;
  onRefresh: () => void;
  t: ReturnType<typeof useTranslation>['t'];
  secondOption?: SecondOption;
  numberFieldLabel?: string;
  numberFieldPlaceholder?: string;
  icFieldLabel?: string;
  icFieldPlaceholder?: string;
  extras?: ExtraOption[];
}) {
  const { control } = useFormContext();
  const currentType = (useWatch({ control, name: 'searchType' }) as SearchType | undefined) || 'ic';

  // Build radio options: always include IC; then extras (if provided) or fallback to single secondOption
  const radioOptions = [
    { label: t('assessment.byIc', 'IC Number'), value: 'ic' },
    ...(
      Array.isArray(extras) && extras.length > 0
        ? extras.map((e) => ({ label: e.label, value: e.value }))
        : [secondOption]
    ),
  ];

  // Determine label/placeholder for the text field based on selected type
  let activeNumberLabel = numberFieldLabel;
  let activeNumberPlaceholder = numberFieldPlaceholder;
  if (currentType && currentType !== 'ic' && Array.isArray(extras)) {
    const found = extras.find((e) => e.value === currentType);
    if (found) {
      if (found.numberFieldLabel) activeNumberLabel = found.numberFieldLabel;
      if (found.numberFieldPlaceholder) activeNumberPlaceholder = found.numberFieldPlaceholder;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <RadioGroupField
          name="searchType"
          label={t('assessment.searchBy', 'Search by')}
          inline
          options={radioOptions}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <InputText
            key={currentType || 'ic'}
            id="query"
            name="query"
            label={currentType === 'ic' ? icFieldLabel : activeNumberLabel}
            placeholder={currentType === 'ic' ? icFieldPlaceholder : activeNumberPlaceholder}
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
