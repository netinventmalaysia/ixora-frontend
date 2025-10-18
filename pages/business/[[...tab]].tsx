import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SidebarContent from 'todo/components/main/Sidebar';
import Tabs, { Tab } from 'todo/components/forms/Tab';
import { businessTabs } from 'todo/components/data/TabList';
import Home from 'todo/components/business/home';
import Registration from 'todo/components/business/registration';
import Application from 'todo/components/business/application';
import TeamMembers from 'todo/components/business/team';
import { teams, logoUrl } from 'todo/components/main/SidebarConfig';
import Billing from 'todo/components/business/billing';
import { fetchBusinessById, fetchMyBusinesses, fetchBillingsWithBusinessId } from 'todo/services/api';
import { useBadgeCounts } from 'todo/components/config/BadgeCounts';
import SidebarLayout from 'todo/components/main/SidebarLayout';
import BusinessEditDialog from 'todo/components/forms/BusinessEditDialog';

const BusinessPage: React.FC = () => {
  const router = useRouter();
  const { tab } = router.query;
  const currentSlug = Array.isArray(tab) ? tab[0] : tab || 'home';
  const isIdRoute = !!currentSlug && /^\d+$/.test(currentSlug);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);

 const { badgeCounts, loading } = useBadgeCounts({
  applicationStatus: 'Submitted',
  //teamStatus: 'Active',
});

  // Dynamic Billing badge: count of current billings (no business filter here; page-level/global)
  const [billingCount, setBillingCount] = useState<number | undefined>(undefined);
  // Whether the current user has at least one registered business (controls visibility of some tabs)
  const [hasBusinesses, setHasBusinesses] = useState<boolean | null>(null);

  // Load user's businesses once to decide whether to show Team/Billing tabs
  useEffect(() => {
    let cancelled = false;
    fetchMyBusinesses()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray((data as any)?.data)
          ? (data as any).data
          : (Array.isArray(data) ? (data as any) : []);
        setHasBusinesses(list.length > 0);
      })
      .catch(() => setHasBusinesses(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    fetchBillingsWithBusinessId(undefined)
      .then((data) => {
        const count = Array.isArray(data) ? data.length : (data ? 1 : 0);
        setBillingCount(count);
      })
      .catch(() => setBillingCount(undefined));
  }, []);

  // Hide Team & Billing tabs if the user has no registered businesses
  const visibleTabs = businessTabs.filter((t) => {
    const key = t.name.toLowerCase();
    if (hasBusinesses === false && (key === 'team' || key === 'billing')) return false;
    return true;
  });

  const tabs: Tab[] = visibleTabs.map((t) => {
  const key = t.name.toLowerCase();

  if (['application'].includes(key)) {
    return {
      ...t,
      badge: badgeCounts[key]?.toString() || undefined,
      badgeColor: 'blue',
    };
  }
  if (key === 'billing') {
    return {
      ...t,
      badge: billingCount !== undefined ? String(billingCount) : undefined,
      badgeColor: 'red',
    };
  }
  return t;
});
  const currentTab =
    tabs.find((t) => t.name.toLowerCase() === currentSlug.toLowerCase()) || tabs[0];

  const handleTabChange = (t: Tab) => {
    const slug = t.name.toLowerCase();
    router.push(`/business/${encodeURIComponent(slug)}`, undefined, { shallow: true });
  };

  // If user has no businesses and is on a hidden tab (team/billing), redirect to the first visible tab
  useEffect(() => {
    if (hasBusinesses === false) {
      const forbidden = new Set(['team', 'billing']);
      if (forbidden.has(String(currentSlug).toLowerCase())) {
        const fallback = tabs[0]?.name?.toLowerCase() || 'home';
        if (fallback && fallback !== String(currentSlug).toLowerCase()) {
          router.replace(`/business/${encodeURIComponent(fallback)}`, undefined, { shallow: true });
        }
      }
    }
  }, [hasBusinesses, currentSlug, router, tabs]);

  // If route is numeric like /business/123, open the edit dialog with that ID
  useEffect(() => {
    if (isIdRoute) {
      const id = Number(currentSlug);
      setEditOpen(true);
      setEditLoading(true);
      fetchBusinessById(id)
        .then((data) => setEditData(data))
        .finally(() => setEditLoading(false));
    } else {
      setEditOpen(false);
      setEditData(null);
    }
  }, [isIdRoute, currentSlug]);


  const renderContent = () => {
  // If route is /business/{id}, keep the usual page content (e.g., Home) and overlay edit dialog
  switch (currentTab.name) {
      case 'Home':
        return <Home />;
      case 'Registration':
        return <Registration />;
      case 'Application':
        return <Application />;
      case 'Team':
        return <TeamMembers />;
      case 'Billing':
        return <Billing />;
      default:
        return null;
    }
  };

  return (
    <SidebarLayout>
      <Tabs tabs={tabs} currentTab={currentTab.name} onTabChange={handleTabChange} />
      <div className="mt-4">
        {loading ? <p>Loading...</p> : renderContent()}
      </div>

      {/* Pre-filled edit dialog for /business/{id} */}
      <BusinessEditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={editData}
        onSaved={(updated) => {
          setEditData(updated);
        }}
      />
    </SidebarLayout>
  );
};

export default BusinessPage;
