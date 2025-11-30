import LayoutWithoutSidebar from 'todo/components/main/LayoutWithoutSidebar';
import { FormProvider, useForm } from 'react-hook-form';
import ItemList from '../forms/ItemList';
import { useRouter } from 'next/router';
import { Tab } from '../forms/Tab';
import { statuses } from '@/components/data/ItemData';
import Heading from '../forms/Heading';
import { buildMySkbActions } from 'todo/components/config/ActionList';
import { useEffect, useMemo, useState } from 'react';
import FilterTabs from '../forms/FilterTabs';
import { listProjects, fetchMyBusinesses } from '@/services/api';
import SelectField from '../forms/SelectField';
import Spacing from '../forms/Spacing';
import { useTranslation } from '@/utils/i18n';

const BASE_TABS: Tab[] = [
  { name: 'All', href: '#' },
  { name: 'Submitted', href: '#', badgeColor: 'gray' },
  { name: 'Pending', href: '#', badgeColor: 'gray' },
  { name: 'Rejected', href: '#', badgeColor: 'gray' },
  { name: 'Complete', href: '#', badgeColor: 'gray' },
];

type ApplicationProps = { isApplicationOnly?: boolean };

const Application: React.FC<ApplicationProps> = ({
  isApplicationOnly = false,
}) => {
  const methods = useForm();
  const router = useRouter();
  const { t } = useTranslation();
  const formatBusinessFallback = (id: number | string | undefined) =>
    t('myskb.common.businessFallback', 'Business #{{id}}').replace(
      '{{id}}',
      String(id ?? '')
    );
  const formatProjectFallback = (id: number | string | undefined) =>
    t('myskb.application.projectFallback', 'Project #{{id}}').replace(
      '{{id}}',
      String(id ?? '')
    );
  const formatDraftFallback = (id: number | string | undefined) =>
    t('myskb.application.draftFallback', 'Draft #{{id}}').replace(
      '{{id}}',
      String(id ?? '')
    );
  const [currentTab, setCurrentTab] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [businessOptions, setBusinessOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [businessId, setBusinessId] = useState<number | undefined>(undefined);
  const mySkbActions = useMemo(() => buildMySkbActions(t), [t]);
  const localizedBaseTabs = useMemo(
    () =>
      BASE_TABS.map((tab) => ({
        ...tab,
        label: t(`myskb.application.tabs.${tab.name.toLowerCase()}`, tab.name),
      })),
    [t]
  );

  useEffect(() => {
    let mounted = true;
    const viewerUserId =
      typeof window !== 'undefined'
        ? Number(localStorage.getItem('userId') || '')
        : NaN;
    listProjects({
      limit: 100,
      offset: 0,
      viewerUserId: !Number.isNaN(viewerUserId) ? viewerUserId : undefined,
      businessId: businessId as any,
    })
      .then((projRes) => {
        if (mounted) setProjects(projRes?.data || []);
      })
      .catch(() => {
        if (mounted) setProjects([]);
      });
    return () => {
      mounted = false;
    };
  }, [businessId]);

  // Load businesses and initialize selection (like Ownership page)
  useEffect(() => {
    let mounted = true;
    fetchMyBusinesses()
      .then((data: any[]) => {
        if (!mounted) return;
        const isWithdrawn = (item: any) => {
          const s =
            item?.status ||
            item?.state ||
            item?.applicationStatus ||
            item?.statusName ||
            item?.status_name ||
            item?.currentStatus ||
            item?.current_status;
          if (typeof s === 'string') return s.toLowerCase() === 'withdrawn';
          for (const v of Object.values(item || {}))
            if (typeof v === 'string' && /withdrawn/i.test(v)) return true;
          return false;
        };
        const opts = (data || [])
          .filter((biz) => !isWithdrawn(biz))
          .map((biz: any) => ({
            value: biz.id,
            label:
              biz.name || biz.companyName || formatBusinessFallback(biz.id),
          }));
        setBusinessOptions(opts);
        // Initialize selection: URL query > localStorage > first option
        let initial: number | undefined = undefined;
        if (typeof window !== 'undefined') {
          const search = new URLSearchParams(window.location.search);
          const qs = search.get('business_id') || search.get('businessId');
          if (qs) initial = Number(qs);
          if (initial === undefined || Number.isNaN(initial)) {
            //set initial from businessId state if available
            initial = businessId;
            //set localstorage
            localStorage.setItem('myskb_last_business_id', String(initial));
          }
        }
        if (initial === undefined || Number.isNaN(initial))
          initial = opts[0]?.value;
        if (initial && !Number.isNaN(initial)) setBusinessId(initial);
      })
      .catch(() => {
        /* non-blocking */
      });
    return () => {
      mounted = false;
    };
  }, [businessId]);

  const projectTabs: Tab[] = useMemo(() => {
    const norm = (p: any) => {
      const raw = (
        p.status ||
        p.applicationStatus ||
        p.statusName ||
        ''
      ).toLowerCase();
      if (raw === 'pending_payment' || raw === 'approved') return 'pending';
      return raw;
    };
    const draftCount = projects.filter((p) => norm(p) === 'draft').length;
    const submittedCount = projects.filter(
      (p) => norm(p) === 'submitted'
    ).length;
    const pendingCount = projects.filter((p) => norm(p) === 'pending').length;
    const rejectedCount = projects.filter((p) => norm(p) === 'rejected').length;
    const completeCount = projects.filter((p) => norm(p) === 'complete').length;
    const [allTab, submittedTab, pendingTab, rejectedTab, completeTab] =
      localizedBaseTabs;
    return [
      { ...allTab },
      { ...submittedTab, badge: String(submittedCount || 0) },
      { ...pendingTab, badge: String(pendingCount || 0) },
      { ...rejectedTab, badge: String(rejectedCount || 0) },
      { ...completeTab, badge: String(completeCount || 0) },
      {
        name: 'Draft',
        href: '#',
        badge: String(draftCount),
        badgeColor: 'yellow',
        label: t('myskb.application.tabs.draft', 'Draft'),
      },
    ];
  }, [localizedBaseTabs, projects, t]);

  const filteredProjects = useMemo(() => {
    const currentUserIdStr =
      (typeof window !== 'undefined'
        ? localStorage.getItem('userId')
        : undefined) || '';
    const currentUserId = Number(currentUserIdStr);
    // Build items from backend projects
    const items = (projects || []).map((p) => {
      const ownerUserId = Number(
        p.userId ?? p.ownerUserId ?? p.createdBy ?? p.created_by
      );
      const submittedByConsultant =
        !Number.isNaN(currentUserId) &&
        !Number.isNaN(ownerUserId) &&
        ownerUserId > 0 &&
        currentUserId !== ownerUserId;
      const coOwnersRaw =
        p.owners_user_ids ?? p.ownersUserIds ?? p.coOwners ?? p.co_owners;
      const coOwners: number[] | undefined = Array.isArray(coOwnersRaw)
        ? coOwnersRaw
            .map((x: any) => Number(x))
            .filter((n: any) => !Number.isNaN(n))
        : typeof coOwnersRaw === 'string'
        ? coOwnersRaw
            .split(',')
            .map((t: string) => Number(t.trim()))
            .filter((n: any) => !Number.isNaN(n))
        : undefined;
      const rawStatus = String(
        p.status ||
          p.applicationStatus ||
          p.statusName ||
          p.currentStatus ||
          'Submitted'
      );
      const rawLower = rawStatus.toLowerCase();
      const normalized =
        rawLower === 'pending_payment' || rawLower === 'approved'
          ? 'Pending'
          : rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
      return {
        ...p, // include backend fields first
        id: p.id,
        name:
          p.name ||
          p.projectTitle ||
          p.title ||
          (rawLower === 'draft'
            ? formatDraftFallback(p.id)
            : formatProjectFallback(p.id)),
        status: normalized, // ensure normalized status overrides raw
        createdAt: p.created_at || p.createdAt,
        submittedByConsultant,
        coOwners,
      };
    });
    // Do not apply extra client-side visibility filtering here.
    // Backend already respects viewerUserId; include all returned for this viewer.
    if (currentTab === 'All') return items;
    const wanted = currentTab.toLowerCase();
    return items.filter((it) => {
      const st = String(it.status || '').toLowerCase();
      if (wanted === 'pending') return st === 'pending';
      if (wanted === 'draft') return st === 'draft';
      return st === wanted;
    });
  }, [currentTab, projects]);

  return (
    <FormProvider {...methods}>
      <LayoutWithoutSidebar shiftY="-translate-y-0">
        <Heading level={5} align="left" bold>
          {t('myskb.application.heading', 'Project Application')}
        </Heading>

        {/* Tabs for filtering */}
        <Spacing size="md" />
        {!isApplicationOnly && (
          <SelectField
            id="myskb_business"
            name="myskb_business"
            label={t('myskb.application.businessLabel', 'Business')}
            options={businessOptions}
            value={businessId}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!Number.isNaN(val)) {
                setBusinessId(val);
                if (typeof window !== 'undefined')
                  localStorage.setItem('myskb_last_business_id', String(val));
              }
            }}
          />
        )}
        <FilterTabs
          tabs={projectTabs}
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab.name)}
        />

        {/* Filtered list */}
        <ItemList
          items={filteredProjects.map((p) => ({
            ...p,
            // Override creator fields so ItemList displays business name
            createdByName:
              p?.business?.name ||
              p?.businessName ||
              p?.business_name ||
              p?.data?.businessName,
          }))}
          statusClasses={statuses}
          actions={mySkbActions}
          byLabel={t('myskb.application.byLabel', 'Business')}
          showViewOnMobile
          onView={(item) => {
            const isDraft = String(item.status || '').toLowerCase() === 'draft';
            if (isDraft) {
              const id =
                typeof item.id === 'string' ? item.id : String(item.id);
              //as well pass the businessId
              router.push(
                `/myskb/project?draft_id=${encodeURIComponent(
                  id
                )}&business_id=${encodeURIComponent(item.businessId)}`
              );
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
