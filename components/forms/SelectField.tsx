import { useFormContext } from 'react-hook-form';

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
  onChange,
}: SelectFieldProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedValue = watch(name);

  return (
    <div className={`w-full ${colSpan}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <select
          id={id}
          {...register(name, requiredMessage ? { required: requiredMessage } : {})}
          value={selectedValue || ''}
          onChange={(e) => {
            setValue(name, e.target.value, { shouldValidate: true });
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
