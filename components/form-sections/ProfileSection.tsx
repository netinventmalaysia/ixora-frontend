import { useFormContext } from 'react-hook-form';
import { UserCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';

export default function ProfileSection() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold text-gray-900">Profile</h2>
      <p className="mt-1 text-sm text-gray-600">
        This information will be displayed publicly so be careful what you share.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
              <span className="shrink-0 text-sm text-gray-500">workcation.com/</span>
              <input
                id="username"
                {...register('username', { required: 'Username is required' })}
                placeholder="janesmith"
                className="block w-full grow py-1.5 pl-1 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message as string}</p>}
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="about" className="block text-sm font-medium text-gray-900">About</label>
          <div className="mt-2">
            <textarea
              id="about"
              {...register("about")}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
              placeholder="Tell us something about yourself"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-900">Photo</label>
          <div className="mt-2 flex items-center gap-x-3">
            <UserCircleIcon className="h-12 w-12 text-gray-300" />
            <button
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Change
            </button>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="cover" className="block text-sm font-medium text-gray-900">Cover photo</label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
              <div className="mt-4 flex text-sm text-gray-600">
                <label htmlFor="cover" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input id="cover" type="file" {...register("cover")} className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}