// components/forms/SelectField.tsx
import { useFormContext } from "react-hook-form";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  options: Option[];
  requiredMessage?: string;
  placeholder?: string; // 👈 NEW
  colSpan?: string;
};

export default function SelectField({
  id,
  name,
  label,
  options,
  requiredMessage,
  placeholder = "Please select...",
  colSpan = "sm:col-span-3",
}: SelectFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={`w-full ${colSpan}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <select
          id={id}
          {...register(name, requiredMessage ? { required: requiredMessage } : {})}
          className="w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border outline-gray-300 focus:outline-indigo-600"
        >
          <option value="">{placeholder}</option> {/* 👈 default dynamic placeholder */}
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
