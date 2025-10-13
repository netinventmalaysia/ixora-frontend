import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import { FormProvider, useForm } from "react-hook-form";
import ItemList from "../forms/ItemList";
import { useRouter } from 'next/router';
import Tabs, { Tab } from '../forms/Tab'
import { statuses } from '@/components/data/ItemData';
import Heading from "../forms/Heading";
import { MySkbActions } from "todo/components/config/ActionList";
import { useEffect, useMemo, useState } from 'react';
import FilterTabs from "../forms/FilterTabs";
import { listProjectDrafts, listProjects } from '@/services/api';

const baseTabs: Tab[] = [
  { name: 'All', href: '#' },
  { name: 'Submitted', href: '#', badgeColor: 'gray' },
  { name: 'Pending', href: '#', badgeColor: 'gray' },
  { name: 'Rejected', href: '#', badgeColor: 'gray' },
  { name: 'Complete', href: '#', badgeColor: 'gray' },
];

const Application: React.FC = () => {
  const methods = useForm();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('All');
  const [drafts, setDrafts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      listProjectDrafts({ limit: 100, offset: 0 }),
      listProjects({ limit: 100, offset: 0 }),
    ])
      .then(([draftRes, projRes]) => {
        if (!mounted) return;
        setDrafts(draftRes?.data || []);
        setProjects(projRes?.data || []);
      })
      .catch(() => {
        if (!mounted) return;
        setDrafts([]);
        setProjects([]);
      });
    return () => { mounted = false; };
  }, []);

  const projectTabs: Tab[] = useMemo(() => {
    const draftCount = drafts.length;
    const submittedCount = projects.filter((p) => (p.status || p.applicationStatus || p.statusName || '').toLowerCase() === 'submitted').length;
    const pendingCount = projects.filter((p) => (p.status || p.applicationStatus || p.statusName || '').toLowerCase() === 'pending').length;
    const rejectedCount = projects.filter((p) => (p.status || p.applicationStatus || p.statusName || '').toLowerCase() === 'rejected').length;
    const completeCount = projects.filter((p) => (p.status || p.applicationStatus || p.statusName || '').toLowerCase() === 'complete').length;
    return [
      { ...baseTabs[0] },
      { ...baseTabs[1], badge: String(submittedCount || 0) },
      { ...baseTabs[2], badge: String(pendingCount || 0) },
      { ...baseTabs[3], badge: String(rejectedCount || 0) },
      { ...baseTabs[4], badge: String(completeCount || 0) },
      { name: 'Draft', href: '#', badge: String(draftCount), badgeColor: 'yellow' },
    ];
  }, [projects, drafts]);

  const filteredProjects = useMemo(() => {
    const currentUserIdStr = (typeof window !== 'undefined' ? localStorage.getItem('userId') : undefined) || '';
    const currentUserId = Number(currentUserIdStr);
    if (currentTab === 'Draft') {
      return drafts.map((d) => ({
        id: d.id,
        name: d.name || d.projectTitle || `Draft #${d.id}`,
        status: 'Draft',
        createdAt: d.created_at || d.createdAt,
      }));
    }
    // Build items from backend projects
    const items = (projects || []).map((p) => {
      const ownerUserId = Number(p.userId ?? p.ownerUserId ?? p.createdBy ?? p.created_by);
      const submittedByConsultant = !Number.isNaN(currentUserId) && !Number.isNaN(ownerUserId) && ownerUserId > 0 && currentUserId !== ownerUserId;
      const coOwnersRaw = p.owners_user_ids ?? p.ownersUserIds ?? p.coOwners ?? p.co_owners;
      const coOwners: number[] | undefined = Array.isArray(coOwnersRaw)
        ? coOwnersRaw.map((x: any) => Number(x)).filter((n: any) => !Number.isNaN(n))
        : (typeof coOwnersRaw === 'string'
            ? coOwnersRaw.split(',').map((t: string) => Number(t.trim())).filter((n: any) => !Number.isNaN(n))
            : undefined);
      return ({
        id: p.id,
        name: p.name || p.projectTitle || p.title || `#${p.id}`,
        status: p.status || p.applicationStatus || p.statusName || p.currentStatus || 'Submitted',
        createdAt: p.created_at || p.createdAt,
        submittedByConsultant,
        coOwners,
        ...p,
      });
    });
    if (currentTab === 'All') return items;
    const wanted = currentTab.toLowerCase();
    return items.filter((it) => String(it.status || '').toLowerCase() === wanted);
  }, [currentTab, drafts, projects]);

  return (
    <FormProvider {...methods}>
      <LayoutWithoutSidebar shiftY="-translate-y-0">
        <Heading level={5} align="left" bold>
          Project Application
        </Heading>

        {/* Tabs for filtering */}
        <FilterTabs
          tabs={projectTabs}
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab.name)}
        />

        {/* Filtered list */}
        <ItemList
          items={filteredProjects}
          statusClasses={statuses}
          actions={MySkbActions}
          onView={(item) => {
            if (currentTab === 'Draft') {
              const id = typeof item.id === 'string' ? item.id : String(item.id);
              router.push(`/myskb/project?draft_id=${encodeURIComponent(id)}`);
              return;
            }
            // Default: do nothing or navigate to a project view if available later
          }}
        />
      </LayoutWithoutSidebar>
    </FormProvider>
  );
};



export default Application;

