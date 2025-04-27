import { useFormContext } from "react-hook-form";

export default function TextInput({ name, label, type = "text", placeholder, required = false }: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm/6 font-medium text-gray-900">{label}</label>
      <div className="mt-2">
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        {...register(name, { required: required ? `${label} is required` : false })}
      />
      </div>
      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">{errors[name]?.message as string}</p>
      )}
    </div>
  );
}