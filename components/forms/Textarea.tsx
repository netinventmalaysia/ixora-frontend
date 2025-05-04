import { useFormContext } from "react-hook-form";

type TextAreaFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  requiredMessage?: string;
  rows?: number;
};

export default function TextAreaField({
  id,
  name,
  label,
  placeholder,
  requiredMessage,
  rows = 3,
}: TextAreaFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="col-span-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <textarea
          id={id}
          {...register(name, requiredMessage ? { required: requiredMessage } : {})}
          rows={rows}
          className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
          placeholder={placeholder}
        />
        {errors[name] && (
          <p className="text-sm text-red-500 mt-1">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    </div>
  );
}