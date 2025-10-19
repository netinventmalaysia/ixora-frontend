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
    const viewerUserId = (typeof window !== 'undefined' ? Number(localStorage.getItem('userId') || '') : NaN);
    Promise.all([
      listProjectDrafts({ limit: 100, offset: 0, viewerUserId: !Number.isNaN(viewerUserId) ? viewerUserId : undefined }),
      listProjects({ limit: 100, offset: 0, viewerUserId: !Number.isNaN(viewerUserId) ? viewerUserId : undefined }),
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
    const norm = (p: any) => {
      const raw = (p.status || p.applicationStatus || p.statusName || '').toLowerCase();
      if (raw === 'pending_payment' || raw === 'approved') return 'pending';
      return raw;
    };
    const submittedCount = projects.filter((p) => norm(p) === 'submitted').length;
    const pendingCount = projects.filter((p) => norm(p) === 'pending').length;
    const rejectedCount = projects.filter((p) => norm(p) === 'rejected').length;
    const completeCount = projects.filter((p) => norm(p) === 'complete').length;
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
      const rawStatus = String(p.status || p.applicationStatus || p.statusName || p.currentStatus || 'Submitted');
      const rawLower = rawStatus.toLowerCase();
      const normalized = (rawLower === 'pending_payment' || rawLower === 'approved') ? 'Pending' : (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1));
      return ({
        ...p, // include backend fields first
        id: p.id,
        name: p.name || p.projectTitle || p.title || `#${p.id}`,
        status: normalized, // ensure normalized status overrides raw
        createdAt: p.created_at || p.createdAt,
        submittedByConsultant,
        coOwners,
      });
    });
    // Do not apply extra client-side visibility filtering here.
    // Backend already respects viewerUserId; include all returned for this viewer.
    if (currentTab === 'All') return items;
    const wanted = currentTab.toLowerCase();
    return items.filter((it) => {
      const st = String(it.status || '').toLowerCase();
      if (wanted === 'pending') return st === 'pending';
      return st === wanted;
    });
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
            // Navigate to submitted project detail
            const id = typeof item.id === 'string' ? item.id : String(item.id);
            router.push(`/myskb/project/${encodeURIComponent(id)}`);
          }}
        />
      </LayoutWithoutSidebar>
    </FormProvider>
  );
};



export default Application;

