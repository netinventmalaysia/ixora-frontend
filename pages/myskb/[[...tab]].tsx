import React, { useEffect, useMemo, useState } from 'react'
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
import { getMySkbAccess } from '@/services/api'

const MyskbPage: React.FC = () => {
  const router = useRouter()
  const { tab } = router.query
  const [allowedTabs, setAllowedTabs] = useState<string[] | null>(null)
  // Use lowercase slug for routing
  const currentSlug = Array.isArray(tab) ? tab[0] : tab || 'home'
  // Filter tabs based on access once loaded; default to full tabs until known
  const allTabs: Tab[] = useMemo(() => {
    if (!allowedTabs || allowedTabs.length === 0) return myskbTabs
    const allowedSet = new Set(allowedTabs.map((t) => t.toLowerCase()))
    return myskbTabs.filter((t) => allowedSet.has(t.name.toLowerCase()))
  }, [allowedTabs])
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

  // Load access once on mount; backend should return allowedTabs like ['Application'] for registered users
  useEffect(() => {
    let mounted = true
    getMySkbAccess()
      .then((a) => {
        if (!mounted) return
        if (Array.isArray(a?.allowedTabs) && a.allowedTabs.length > 0) {
          setAllowedTabs(a.allowedTabs)
        } else if (a?.projectOnly) {
          // Back-compat: if backend still sends projectOnly, map to Application-only per latest rule
          setAllowedTabs(['Application'])
        } else {
          setAllowedTabs([]) // no restriction
        }
      })
      .catch(() => setAllowedTabs([]))
    return () => {
      mounted = false
    }
  }, [])

  // If the current tab is not allowed, redirect to the first allowed tab
  useEffect(() => {
    if (!allowedTabs) return
    const allowedSet = new Set(allowedTabs.map((t) => t.toLowerCase()))
    const isAllowed = allowedSet.size === 0 || allowedSet.has(currentSlug.toLowerCase())
    if (!isAllowed) {
      const target = (allowedTabs[0] || 'application').toLowerCase()
      router.replace(`/myskb/${encodeURIComponent(target)}`, undefined, { shallow: true })
    }
  }, [allowedTabs, currentSlug, router])

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
