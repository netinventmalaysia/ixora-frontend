// components/PhotoUploadField.tsx
import { UserCircleIcon } from '@heroicons/react/24/solid';

type PhotoUploadFieldProps = {
  label?: string;
  buttonText?: string;
  onClick?: () => void; // You can wire this later for real upload/change functionality
};

export default function PhotoUploadField({
  label = "Photo",
  buttonText = "Change",
  onClick,
}: PhotoUploadFieldProps) {
  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      <div className="mt-2 flex items-center gap-x-3">
        <UserCircleIcon className="h-12 w-12 text-gray-300" />
        <button
          type="button"
          onClick={onClick}
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
