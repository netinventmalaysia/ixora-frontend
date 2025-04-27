import { useFormContext } from 'react-hook-form';

export default function PersonalInfoSection() {
  const { register } = useFormContext();

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
      <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">First name</label>
          <div className="mt-2">
            <input
              id="firstName"
              {...register("firstName")}
              type="text"
              autoComplete="given-name"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">Last name</label>
          <div className="mt-2">
            <input
              id="lastName"
              {...register("lastName")}
              type="text"
              autoComplete="family-name"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
          <div className="mt-2">
            <input
              id="email"
              {...register("email")}
              type="email"
              autoComplete="email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="country" className="block text-sm font-medium text-gray-900">Country</label>
          <div className="mt-2">
            <select
              id="country"
              {...register("country")}
              className="w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border outline-gray-300 focus:outline-indigo-600"
            >
              <option>Malaysia</option>
              <option>Singapore</option>
              <option>Indonesia</option>
            </select>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="street" className="block text-sm font-medium text-gray-900">Street address</label>
          <div className="mt-2">
            <input
              id="street"
              {...register("street")}
              type="text"
              autoComplete="street-address"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div className="sm:col-span-2 sm:col-start-1">
          <label htmlFor="city" className="block text-sm font-medium text-gray-900">City</label>
          <div className="mt-2">
            <input
              id="city"
              {...register("city")}
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="state" className="block text-sm font-medium text-gray-900">State</label>
          <div className="mt-2">
            <input
              id="state"
              {...register("state")}
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="zip" className="block text-sm font-medium text-gray-900">ZIP / Postal code</label>
          <div className="mt-2">
            <input
              id="zip"
              {...register("zip")}
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
