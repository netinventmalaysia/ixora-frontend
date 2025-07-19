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
import { fetchMyBusinesses } from 'todo/services/api';
import { useBadgeCounts } from 'todo/components/config/BadgeCounts';
import SidebarLayout from 'todo/components/main/SidebarLayout';

const BusinessPage: React.FC = () => {
  const router = useRouter();
  const { tab } = router.query;
  const currentSlug = Array.isArray(tab) ? tab[0] : tab || 'home';

 const { badgeCounts, loading } = useBadgeCounts({
  applicationStatus: 'Submitted',
  //teamStatus: 'Active',
});

  const tabs: Tab[] = businessTabs.map((t) => {
  const key = t.name.toLowerCase();

  if (['application'].includes(key)) {
    return {
      ...t,
      badge: badgeCounts[key]?.toString() || undefined,
      badgeColor: 'blue',
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


  const renderContent = () => {
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
    </SidebarLayout>
  );
};

export default BusinessPage;
