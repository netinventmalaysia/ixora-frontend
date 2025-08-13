import { useEffect, useState } from 'react';
import { fetchMyBusinesses } from '@/services/api';

export type BadgeCounts = { [key: string]: number | undefined };

type BadgeCountFilters = {
    applicationStatus?: string;
    teamStatus?: string;
};

export function useBadgeCounts(filters: BadgeCountFilters = {}) {
    const [badgeCounts, setBadgeCounts] = useState<BadgeCounts>({});
    const [loading, setLoading] = useState(false);

    const isAuthenticated = typeof window !== 'undefined' && document.cookie.includes('auth_token');

    const fetchCounts = () => {
        if (!isAuthenticated) {
            console.warn('🔒 Skipping badge fetch — not authenticated');
            return;
        }

        setLoading(true);

        Promise.all([fetchMyBusinesses()])
            .then(([businessData]) => {
                setBadgeCounts({
                    application: filters.applicationStatus
                        ? businessData.filter((b: any) => b.status === filters.applicationStatus).length
                        : businessData.length,
                });
            })
            .catch((err) => {
                console.error('❌ Failed to fetch badge counts:', err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCounts();
    }, [JSON.stringify(filters)]);

    return { badgeCounts, loading, refresh: fetchCounts };
}