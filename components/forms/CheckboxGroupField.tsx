import { useFormContext } from "react-hook-form";

type CheckboxOption = {
  value: string;
  label: string;
  description?: string;
  required?: boolean;
  requiredMessage?: string;
};

type CheckboxGroupFieldProps = {
  name: string;
  legend: string;
  options: CheckboxOption[];
};

export default function CheckboxGroupField({
  name,
  legend,
  options,
}: CheckboxGroupFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mt-10 space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold text-gray-900">{legend}</legend>
        <div className="mt-4 space-y-4">
          {options.map((option) => {
            const validationRules = option.required
              ? { required: option.requiredMessage || `Please tick ${option.label}` }
              : {};

            return (
              <div key={option.value} className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    id={`${name}.${option.value}`}
                    {...register(`${name}.${option.value}`, validationRules)}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="text-sm leading-6">
                  <label htmlFor={`${name}.${option.value}`} className="font-medium text-gray-900">
                    {option.label}
                  </label>
                  {option.description && (
                    <p className="text-gray-500">{option.description}</p>
                  )}
                  {/* Show field-level error if present */}
                  {errors?.[name] && (errors[name] as Record<string, any>)[option.value] && (
                    <p className="text-sm text-red-500 mt-1">
                      {(errors[name] as Record<string, any>)[option.value]?.message as string}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
