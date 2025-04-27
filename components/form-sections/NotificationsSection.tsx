import { useFormContext } from 'react-hook-form';

export default function NotificationsSection() {
  const { register } = useFormContext();

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
      <p className="mt-1 text-sm text-gray-600">Choose what you want to be notified about.</p>

      <div className="mt-10 space-y-6">
        <fieldset>
          <legend className="text-sm font-semibold text-gray-900">By email</legend>
          <div className="mt-4 space-y-4">
            {["comments", "candidates", "offers"].map((item) => (
              <div key={item} className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    id={item}
                    {...register(`notifications.${item}`)}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="text-sm leading-6">
                  <label htmlFor={item} className="font-medium text-gray-900 capitalize">{item}</label>
                  <p className="text-gray-500">
                    {item === "comments" && "Get notified when someone comments."}
                    {item === "candidates" && "Get notified when someone applies for a job."}
                    {item === "offers" && "Get notified when a candidate accepts or rejects an offer."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
