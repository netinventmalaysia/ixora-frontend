import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function AvatarUpload() {
  return (
    <div className="mt-2 flex items-center gap-x-3">
      <UserCircleIcon className="h-12 w-12 text-gray-300" />
      <button
        type="button"
        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Change
      </button>
    </div>
  );
}
