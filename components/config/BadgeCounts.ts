import { useEffect, useState } from 'react';
import { fetchMyBusinesses } from '@/services/api';

export type BadgeCounts = { [key: string]: number | undefined };

type BadgeCountFilters = {
    applicationStatus?: string;
    teamStatus?: string;
};

export function useBadgeCounts(filters: BadgeCountFilters = {}) {
    const [badgeCounts, setBadgeCounts] = useState<BadgeCounts>({});
    const [loading, setLoading] = useState(true);

    const fetchCounts = () => {
        setLoading(true);

        Promise.all([fetchMyBusinesses()])
            .then(([businessData]) => {
                setBadgeCounts({
                    application: filters.applicationStatus
                        ? businessData.filter((b: any) => b.status === filters.applicationStatus).length
                        : businessData.length,
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCounts();
    }, [JSON.stringify(filters)]);

    return { badgeCounts, loading, refresh: fetchCounts };
}
