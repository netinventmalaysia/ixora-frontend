// components/FileUploadField.tsx
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useFormContext } from "react-hook-form";

type FileUploadFieldProps = {
  id: string;
  name: string;
  label?: string;
  description?: string;
  accept?: string; // e.g., "image/*"
  requiredMessage?: string;
};

export default function FileUploadField({
  id,
  name,
  label = "Upload a file",
  description = "PNG, JPG, GIF up to 10MB",
  accept = "image/*",
  requiredMessage,
}: FileUploadFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="col-span-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        Cover photo
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
          <div className="mt-4 flex text-sm text-gray-600">
            <label
              htmlFor={id}
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
            >
              <span>{label}</span>
              <input
                id={id}
                type="file"
                accept={accept}
                {...register(name, requiredMessage ? { required: requiredMessage } : {})}
                className="sr-only"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">{description}</p>
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">
              {errors[name]?.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
