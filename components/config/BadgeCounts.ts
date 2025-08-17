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
                const target = filters.applicationStatus?.toLowerCase();
                const normalize = (s?: string) => (s ? s.toLowerCase() : s);
                const derive = (b: any): string | undefined => {
                    const direct =
                        b?.status ||
                        b?.applicationStatus ||
                        b?.approvalStatus ||
                        b?.statusName ||
                        b?.currentStatus ||
                        b?.state ||
                        b?.application_status ||
                        b?.approval_status ||
                        b?.status_name ||
                        b?.current_status;
                    if (typeof direct === 'string') return direct.toLowerCase();
                    for (const [k, v] of Object.entries(b || {})) {
                        if (typeof v === 'string' && /status/i.test(k)) return v.toLowerCase();
                    }
                    return undefined;
                };

                const count = target
                    ? businessData.filter((b: any) => {
                          const st = derive(b);
                          if (!st) return false;
                          // Treat complete/completed as equivalent
                          if (target === 'completed') return st === 'completed' || st === 'complete';
                          return st === target;
                      }).length
                    : businessData.length;

                setBadgeCounts({ application: count });
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