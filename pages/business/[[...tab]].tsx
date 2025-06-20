import React from 'react'
import { useRouter } from 'next/router'
import SidebarContent from 'todo/components/main/Sidebar'
import Tabs, { Tab } from 'todo/components/forms/Tab'
import { businessTabs } from 'todo/components/data/TabList'
import FormWrapper from 'todo/components/forms/FormWrapper'
import Home from 'todo/components/business/home'
import Registration from 'todo/components/business/registration'
import Application from 'todo/components/business/application'
import TeamMembers from 'todo/components/business/team'
import { teams, logoUrl } from 'todo/components/main/SidebarConfig'
import Billing from 'todo/components/business/billing'

const BusinessPage: React.FC = () => {
  const router = useRouter()
  const { tab } = router.query
  // Use lowercase slug for routing
  const currentSlug = Array.isArray(tab) ? tab[0] : tab || 'home'
  const allTabs: Tab[] = businessTabs
  // Match by lowercase name
  const currentTab: Tab =
    allTabs.find((t) => t.name.toLowerCase() === currentSlug.toLowerCase()) ||
    allTabs[0]

  const handleTabChange = (t: Tab) => {
    const slug = t.name.toLowerCase()
    router.push(`/business/${encodeURIComponent(slug)}`, undefined, {
      shallow: true,
    })
  }

  const renderContent = () => {
    switch (currentTab.name) {
      case 'Home':
        return <Home />
      case 'Registration':
        return <Registration />
      case 'Application':
        return <Application />
      case 'Team':
        return <TeamMembers />
      case 'Billing':
        return <Billing />
      default:
        return null
    }
  }

  return (
    <SidebarContent teams={teams} logoUrl={logoUrl} userRole="user">
      <FormWrapper onSubmit={() => { }}>
        <Tabs tabs={allTabs} currentTab={currentTab.name} onTabChange={handleTabChange} />
        <div className="mt-4">
          {renderContent()}
        </div>
      </FormWrapper>
    </SidebarContent>
  )
}

export default BusinessPage
