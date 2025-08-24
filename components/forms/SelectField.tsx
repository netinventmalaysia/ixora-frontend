import { useFormContext } from 'react-hook-form';
import { useState } from 'react';

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

  // respect controlled value prop when provided, otherwise fall back to form/watch/local state
  const selectedValue = value !== undefined ? value : watch(name);

  return (
    <div className={`w-full ${colSpan}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <select
          id={id}
          {...(methods ? register(name, requiredMessage ? { required: requiredMessage } : {}) : {})}
          value={selectedValue ?? ''}
          onChange={(e) => {
            // when using react-hook-form, setValue will update the form state
            // otherwise, update local fallback state
            try {
              setValue(name, e.target.value, { shouldValidate: true });
            } catch (err) {
              setLocalValue(e.target.value);
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
            <option key={option.value} value={option.value}>
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
