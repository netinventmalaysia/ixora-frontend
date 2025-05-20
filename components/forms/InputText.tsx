import { useFormContext } from "react-hook-form";

type InputTextProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  prefix?: string;
  requiredMessage?: string; // If undefined, the field is optional
  colSpan?: string;
  type?: "text" | "password" | "number"; // NEW: Control input type
};

export default function InputText({
  id,
  name,
  label,
  placeholder,
  prefix,
  requiredMessage,
  colSpan = "sm:col-span-3",
  type = "text", // Default to free text
}: InputTextProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const validationRules = requiredMessage
    ? { required: requiredMessage }
    : {};

  return (
    <div className={`w-full ${colSpan}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
          {prefix && (
            <span className="shrink-0 text-sm text-gray-500">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type={type}
            {...register(name, validationRules)}
            placeholder={placeholder}
            className="block w-full grow py-1.5 pl-1 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
        {errors[name] && (
          <p className="text-sm text-red-500 mt-1">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
