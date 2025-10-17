import { useFormContext } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';

type Option = {
  value: string | number;
  label: string;
};

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  options: Option[];
  requiredMessage?: string;
  placeholder?: string;
  colSpan?: string;
  // optional controlled value when using this component outside react-hook-form
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectField({
  id,
  name,
  label,
  options,
  requiredMessage,
  placeholder = 'Please select...',
  colSpan = 'sm:col-span-3',
  value,
  onChange,
}: SelectFieldProps) {
  // react-hook-form's useFormContext will throw or return null when no FormProvider is present.
  // Support using this component standalone (no form) by falling back to local state.
  let methods: any = null;
  try {
    methods = useFormContext();
  } catch (e) {
    methods = null;
  }

  const [localValue, setLocalValue] = useState<string | number>('');

  let register: any = () => ({});
  let watch: any = () => localValue;
  let setValue: any = (_n: string, v: any) => setLocalValue(v);
  let errors: any = {};

  if (methods) {
    register = methods.register;
    watch = methods.watch;
    setValue = methods.setValue;
    errors = methods.formState?.errors || {};
  }

  // Are option values numeric? If so, we will cast onChange to number.
  const isNumeric = useMemo(() => options.every((o) => typeof o.value === 'number'), [options]);

  // Respect controlled value prop when provided, otherwise fall back to form/watch/local state
  const watched = value !== undefined ? value : watch(name);
  const selectedValueString = (watched ?? localValue ?? '') === '' ? '' : String(watched ?? localValue ?? '');
  // Debug: log value changes for monitoring
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('SelectField value changed', { id, name, value: selectedValueString });
  }, [id, name, selectedValueString]);

  // Debug: log options metadata once
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('SelectField mount', { id, name, optionsCount: options.length, isNumeric });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Prepare register and preserve react-hook-form's onChange
  const reg = methods ? register(name, requiredMessage ? { required: requiredMessage } : {}) : undefined;
  return (
    <div className={`w-full ${colSpan}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}{requiredMessage && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      <div className="mt-2">
        <select
          id={id}
          {...(reg || {})}
          value={selectedValueString}
          onChange={(e) => {
            // when using react-hook-form, setValue will update the form state
            // otherwise, update local fallback state
            // Invoke RHF's own onChange if present
            try { (reg as any)?.onChange?.(e); } catch {}
            const raw = e.target.value;
            const nextVal = (isNumeric && raw !== '') ? Number(raw) : raw;
            // eslint-disable-next-line no-console
            console.log('SelectField onChange', { id, name, raw, nextVal, type: typeof nextVal, isNumeric });
            try {
              setValue(name, nextVal, { shouldValidate: true, shouldDirty: true });
            } catch {
              setLocalValue(nextVal);
            }
            onChange?.(e);
          }}
          className={`w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border 
            ${errors[name] ? 'border-red-500' : 'border-gray-300'} 
            focus:outline-none focus:ring-1 focus:ring-indigo-500`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
