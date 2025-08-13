import React from 'react'
import { useRouter } from 'next/router'
import SidebarContent from 'todo/components/main/Sidebar'
import Tabs, { Tab } from 'todo/components/forms/Tab'
import { myskbTabs } from 'todo/components/data/TabList'
import FormWrapper from 'todo/components/forms/FormWrapper'
import Home from 'todo/components/myskb/home'
import Registration from 'todo/components/myskb/registration'
import Application from 'todo/components/myskb/application'
import TeamMembers from 'todo/components/myskb/team'
import Project from 'todo/components/myskb/project'
import { teams, logoUrl } from 'todo/components/main/SidebarConfig'
import Ownership from 'todo/components/myskb/ownership'
import SidebarLayout from 'todo/components/main/SidebarLayout'

const MyskbPage: React.FC = () => {
  const router = useRouter()
  const { tab } = router.query
  // Use lowercase slug for routing
  const currentSlug = Array.isArray(tab) ? tab[0] : tab || 'home'
  const allTabs: Tab[] = myskbTabs
  // Match by lowercase name
  const currentTab: Tab =
    allTabs.find((t) => t.name.toLowerCase() === currentSlug.toLowerCase()) ||
    allTabs[0]

  const handleTabChange = (t: Tab) => {
    const slug = t.name.toLowerCase()
    router.push(`/myskb/${encodeURIComponent(slug)}`, undefined, {
      shallow: true,
    })
  }

  const renderContent = () => {
    switch (currentTab.name) {
    case'Home':
        return <Home />
      case 'Registration':
        return <Registration />
      case 'Ownership':
        return <Ownership />
      case 'Project':
        return <Project />
      case 'Application':
        return <Application />
      default:
        return null
    }
  }

  return (
    <SidebarLayout>
        <Tabs tabs={allTabs} currentTab={currentTab.name} onTabChange={handleTabChange} />
        <div className="mt-4">
          {renderContent()}
        </div>
    </SidebarLayout>
  )
}

export default MyskbPage
