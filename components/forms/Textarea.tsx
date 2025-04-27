
import { useFormContext } from "react-hook-form";

export default function Textarea({
  name,
  label,
  placeholder = "",
  required = false,
  rows = 4,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-medium text-sm text-gray-700">{label}</label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
        {...register(name, { required: required ? `${label} is required` : false })}
      />
      {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]?.message as string}</p>}
    </div>
  );
}