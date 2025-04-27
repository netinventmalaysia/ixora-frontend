
import { useFormContext } from "react-hook-form";

export default function FileUpload({
  name,
  label,
  required = false,
  accept = "*",
}: {
  name: string;
  label: string;
  required?: boolean;
  accept?: string;
}) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-medium text-sm text-gray-700">{label}</label>
      <input
        type="file"
        accept={accept}
        id={name}
        className="mt-1 block w-full text-sm text-gray-700"
        {...register(name, { required: required ? `${label} is required` : false })}
      />
      {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]?.message as string}</p>}
    </div>
  );
}