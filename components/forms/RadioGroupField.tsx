import { useFormContext } from 'react-hook-form';

type RadioOption = {
  label: string;
  value: string;
};

type RadioGroupFieldProps = {
  name: string;
  label: string;
  options: RadioOption[];
  inline?: boolean;
  requiredMessage?: string;
};

export default function RadioGroupField({
  name,
  label,
  options,
  inline = false,
  requiredMessage,
}: RadioGroupFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="mb-4">
  <label className="block text-sm font-medium text-gray-900 mb-2">{label}{requiredMessage && <span className="ml-0.5 text-red-600">*</span>}</label>
      {/* When inline requested, stack vertically on very small screens and switch to horizontal from sm breakpoint */}
      <div
        className={inline ? 'space-y-2 sm:flex sm:space-y-0 sm:gap-4' : 'space-y-2'}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          if (target?.type === 'radio' && target?.name === name) {
            console.log(`[RadioGroupField] onChange bubbled: ${name} ->`, target.value);
          }
        }}
      >
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const field = register(name, { required: requiredMessage });
          return (
            <label key={option.value} htmlFor={id} className="flex items-center text-sm text-gray-700">
              <input
                id={id}
                type="radio"
                value={option.value}
                {...field}
                onChange={(e) => {
                  // Ensure RHF updates the value then log for debugging
                  field.onChange(e);
                  if (typeof window !== 'undefined') {
                    console.log(`[RadioGroupField] ${name} changed to`, option.value);
                  }
                }}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}