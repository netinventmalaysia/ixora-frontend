
import { useFormContext } from "react-hook-form";

export default function DateInput({
  name,
  label,
  required = false,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-medium text-sm text-gray-700">{label}</label>
      <input
        type="date"
        id={name}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
        {...register(name, { required: required ? `${label} is required` : false })}
      />
      {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]?.message as string}</p>}
    </div>
  );
}