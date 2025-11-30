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
import { getMySkbAccess, fetchMyBusinesses } from '@/services/api'
import toast from 'react-hot-toast'
import { useTranslation } from '@/utils/i18n'

const MyskbPage: React.FC = () => {
  const router = useRouter()
  const { tab } = router.query
  const [allowedTabs, setAllowedTabs] = useState<string[] | null>(null)
  const [lamApproved, setLamApproved] = useState<boolean>(false)
  const { t } = useTranslation()
  const translatedTabs = useMemo(() => {
    const base = (!allowedTabs || allowedTabs.length === 0)
      ? myskbTabs
      : myskbTabs.filter((tabCandidate) => new Set(allowedTabs.map((x) => x.toLowerCase())).has(tabCandidate.name.toLowerCase()))
    return base.map((tabItem) => ({
      ...tabItem,
      label: t(`myskb.tabs.${tabItem.name.toLowerCase()}`, tabItem.name),
    }))
  }, [allowedTabs, t])
  // Use lowercase slug for routing
  const currentSlug = Array.isArray(tab) ? tab[0] : tab || 'home'
  // Filter tabs based on access once loaded; default to full tabs until known
  const allTabs: Tab[] = useMemo(() => {
    if (!lamApproved) return translatedTabs
    return translatedTabs.map((tabItem) => tabItem.name.toLowerCase() === 'registration'
      ? { ...tabItem, badge: t('myskb.tabs.registrationApproved', 'Approved'), badgeColor: 'green' }
      : tabItem)
  }, [lamApproved, t, translatedTabs])
  // Match by lowercase name
  const currentTab: Tab =
    allTabs.find((t) => t.name.toLowerCase() === currentSlug.toLowerCase()) ||
    allTabs[0]

  // Show banner if access is restricted to Application only
  const isApplicationOnly = useMemo(() => {
    if (!allowedTabs) return false
    const list = allowedTabs.map((t) => String(t).toLowerCase())
    return list.length === 1 && list[0] === 'application'
  }, [allowedTabs])

  const handleTabChange = (nextTab: Tab) => {
    if (lamApproved && nextTab.name.toLowerCase() === 'registration') {
      toast.success(t('myskb.tabs.registrationLocked', 'LAM approved. Registration is locked.'))
      return
    }
    const slug = nextTab.name.toLowerCase()
    router.push(`/myskb/${encodeURIComponent(slug)}`, undefined, {
      shallow: true,
    })
  }

  // Load access once on mount; backend should return allowedTabs like ['Application'] for registered users
  useEffect(() => {
    let mounted = true
    // Optionally pass business_id if available from last selection
    let bizId: number | undefined = undefined
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('myskb_last_business_id')
      const n = saved ? Number(saved) : NaN
      if (!Number.isNaN(n)) bizId = n
    }
    getMySkbAccess(bizId ? { business_id: bizId } : undefined)
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

    // Load LAM status to freeze Registration when approved
    fetchMyBusinesses()
      .then((list: any[]) => {
        if (!mounted) return
        const saved = (typeof window !== 'undefined') ? localStorage.getItem('myskb_last_business_id') : undefined
        const n = saved ? Number(saved) : NaN
        const pick = (!Number.isNaN(n) && n > 0) ? (list || []).find((b) => Number(b.id) === n) : (Array.isArray(list) ? list[0] : null)
        const status = String(pick?.lamStatus || pick?.lam_status || '')
        setLamApproved(status.toLowerCase() === 'approved')
      })
      .catch(() => { if (mounted) setLamApproved(false) })
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

  // If approved and currently on registration, redirect to home
  useEffect(() => {
    if (lamApproved && String(currentSlug).toLowerCase() === 'registration') {
      router.replace('/myskb/home', undefined, { shallow: true })
    }
  }, [lamApproved, currentSlug, router])

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
        return <Application isApplicationOnly={isApplicationOnly} />
      default:
        return null
    }
  }

  return (
    <SidebarLayout>
        <Tabs tabs={allTabs} currentTab={currentTab.name} onTabChange={handleTabChange} />
        {isApplicationOnly && (
          <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900 text-sm">
            {t('myskb.banner.applicationOnly.line1', 'You currently have Application-only access. Other MySKB features are hidden.')}
            {' '}
            {t('myskb.banner.applicationOnly.line2', 'To get full access (Home, Registration, Ownership, Project), your organisation must have an approved LAM registration.')}
            {' '}
            {t('myskb.banner.applicationOnly.line3', 'If you are a business owner, submit your LAM details under your account. If not, please ask a consultant with an approved LAM to manage your application.')}
          </div>
        )}
        <div className="mt-4">
          {renderContent()}
        </div>
    </SidebarLayout>
  )
}

export default MyskbPage
