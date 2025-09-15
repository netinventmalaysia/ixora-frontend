import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import { FormProvider, useForm } from "react-hook-form";
import ItemList from "../forms/ItemList";
import { useRouter } from 'next/router';
import Tabs, { Tab } from '../forms/Tab'
import { ProjectList, statuses } from '@/components/data/ItemData';
import Heading from "../forms/Heading";
import { MySkbActions } from "todo/components/config/ActionList";
import { useEffect, useMemo, useState } from 'react';
import FilterTabs from "../forms/FilterTabs";
import { listProjectDrafts } from '@/services/api';

const baseTabs: Tab[] = [
  { name: 'All', href: '#' },
  { name: 'Submitted', href: '#', badge: `${ProjectList.filter(p => p.status === 'Submitted').length}`, badgeColor: 'gray' },
  { name: 'Pending', href: '#', badge: `${ProjectList.filter(p => p.status === 'Pending').length}`, badgeColor: 'gray' },
  { name: 'Rejected', href: '#', badge: `${ProjectList.filter(p => p.status === 'Rejected').length}`, badgeColor: 'gray' },
  { name: 'Complete', href: '#', badge: `${ProjectList.filter(p => p.status === 'Complete').length}`, badgeColor: 'gray' },
];

const Application: React.FC = () => {
  const methods = useForm();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('All');
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    listProjectDrafts({ limit: 50, offset: 0 })
      .then(({ data }) => { if (mounted) setDrafts(data || []); })
      .catch(() => { if (mounted) setDrafts([]); });
    return () => { mounted = false; };
  }, []);

  const projectTabs: Tab[] = useMemo(() => {
    const draftCount = drafts.length;
    return [
      ...baseTabs,
      { name: 'Draft', href: '#', badge: String(draftCount), badgeColor: 'yellow' },
    ];
  }, [drafts]);

  const filteredProjects = currentTab === 'Draft'
    ? drafts.map((d) => ({
        id: d.id,
        name: d.name || d.projectTitle || `Draft #${d.id}`,
        status: 'Draft',
        createdAt: d.created_at || d.createdAt,
      }))
    : ProjectList.filter((project) => {
        if (currentTab === 'All') return true;
        return project.status === currentTab;
      });

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
          }}
        />
      </LayoutWithoutSidebar>
    </FormProvider>
  );
};



export default Application;

