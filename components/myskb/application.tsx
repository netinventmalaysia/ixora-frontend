import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import { FormProvider, useForm } from "react-hook-form";
import ItemList from "../forms/ItemList";
import Tabs, { Tab } from '../forms/Tab'
import { ProjectList, statuses } from '@/components/data/ItemData';
import Heading from "../forms/Heading";
import { MySkbActions } from "todo/components/config/ActionList";
import { useState } from 'react';
import FilterTabs from "../forms/FilterTabs";

const projectTabs: Tab[] = [
  { name: 'All', href: '#' },
  { name: 'Submitted', href: '#', badge: `${ProjectList.filter(p => p.status === 'Submitted').length}`, badgeColor: 'gray' },
  { name: 'Pending', href: '#', badge: `${ProjectList.filter(p => p.status === 'Pending').length}`, badgeColor: 'gray' },
  { name: 'Rejected', href: '#', badge: `${ProjectList.filter(p => p.status === 'Rejected').length}`, badgeColor: 'gray' },
  { name: 'Complete', href: '#', badge: `${ProjectList.filter(p => p.status === 'Complete').length}`, badgeColor: 'gray' },
];

const Application: React.FC = () => {
  const methods = useForm();
  const [currentTab, setCurrentTab] = useState('All');

  const filteredProjects = ProjectList.filter((project) => {
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
        />
      </LayoutWithoutSidebar>
    </FormProvider>
  );
};



export default Application;

