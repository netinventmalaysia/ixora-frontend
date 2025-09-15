import { Profile } from '@/components/types/Profile';

type ProfileRowProps = {
    profile: Profile[];
    actions?: (profile: Profile) => React.ReactNode;
    // Optional label to use instead of the default "Online" fallback
    onlineLabel?: string;
};

export default function ProfileRow({ profile, actions, onlineLabel }: ProfileRowProps) {
    return (
        <ul role="list" className="divide-y divide-gray-100">
            {profile.map((data) => (

                <li className="flex justify-between gap-x-6 py-5">
                    <div className="flex min-w-0 gap-x-4">
                        <img alt="" src={data.imageUrl} className="size-12 flex-none rounded-full bg-gray-50" />
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold text-gray-900">
                                <a href={data.href || '#'} className="hover:underline">
                                    {data.name}
                                </a>
                            </p>
                            <p className="mt-1 text-xs text-gray-500 truncate">
                                <a href={`mailto:${data.email}`} className="hover:underline">
                                    {data.email}
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-6">
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                            {(data.role || data.project) && (
                                <p className="text-sm text-gray-900">{data.role ?? data.project}</p>
                            )}
                            {data.status ? (
                                <div className="mt-1 flex items-center gap-x-1.5">
                                    {/* Status pill colors: Pending=yellow, Approved=green, Rejected=red */}
                                    {data.status === 'Pending' && (
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">Pending</span>
                                    )}
                                    {data.status === 'Approved' && (
                                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Approved</span>
                                    )}
                                    {data.status === 'Rejected' && (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Rejected</span>
                                    )}
                                </div>
                            ) : data.lastSeen ? (
                                <p className="mt-1 text-xs text-gray-500">
                                    Last seen <time dateTime={data.lastSeenDateTime}>{data.lastSeen}</time>
                                </p>
                            ) : (
                                <div className="mt-1 flex items-center gap-x-1.5">
                                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                        <div className="size-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-xs text-gray-500">{onlineLabel ?? 'Online'}</p>
                                </div>
                            )}
                        </div>
                        {actions?.(data)}
                    </div>
                </li>
            ))}
        </ul>
    );
}
