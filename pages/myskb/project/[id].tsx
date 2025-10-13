import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SidebarLayout from 'todo/components/main/SidebarLayout';
import Heading from 'todo/components/forms/Heading';
import ProjectReadOnly from 'todo/components/myskb/ProjectReadOnly';
import { fetchBusinessById, listOwnerships } from '@/services/api';
import { getProjectById, getProjectDraftById } from '@/services/api';

const ProjectDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<any>(null);
  const [businessName, setBusinessName] = useState<string | undefined>(undefined);
  const [owners, setOwners] = useState<Array<{ name?: string; email?: string; user_id?: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // First try submitted/active project
        const proj = await getProjectById(id as string);
        if (mounted && proj) {
          setData(proj);
          // Enrich labels
          const bid = Number((proj as any)?.business_id ?? (proj as any)?.businessId);
          if (!Number.isNaN(bid)) {
            try { const biz = await fetchBusinessById(bid); if (mounted) setBusinessName(biz?.name || biz?.companyName); } catch {}
            try {
              const { data: ownersList } = await listOwnerships({ business_id: bid, status: 'Approved', limit: 100, offset: 0 } as any);
              const uids: number[] = Array.isArray((proj as any)?.owners_user_ids) ? (proj as any).owners_user_ids.map((x: any) => Number(x)).filter((n: any) => !Number.isNaN(n)) : [];
              const items = (ownersList || [])
                .filter((o: any) => uids.includes(Number(o?.user_id)))
                .map((o: any) => ({ name: o?.name, email: o?.email, user_id: Number(o?.user_id) }));
              if (mounted) setOwners(items);
            } catch {}
          }
          setLoading(false);
          return;
        }
        // Fallback to draft (in case this route is used for drafts as well)
        const draft = await getProjectDraftById(id as string);
        if (mounted) setData(draft);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load project');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; }
  }, [id]);

  return (
    <SidebarLayout>
      <Heading level={5} align="left" bold>
        Project Details
      </Heading>
      <div className="mt-4">
        {loading ? (
          <div className="text-sm text-gray-500">Loading…</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <ProjectReadOnly data={normalizeToForm(data)} businessName={businessName} owners={owners} />
        )}
      </div>
    </SidebarLayout>
  );
};

export default ProjectDetailPage;

// Map backend project shape into the form’s expected fields
function normalizeToForm(raw: any): Record<string, any> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, any> = {};
  // business
  const bid = Number(raw.business_id ?? raw.businessId);
  if (!Number.isNaN(bid)) out.business_id = bid;
  // owners -> keep owners_user_ids for preset mapping (component will try to map to ownership ids)
  const ownersArr = raw.owners_user_ids ?? raw.ownersUserIds ?? raw.owners ?? undefined;
  if (Array.isArray(ownersArr)) out.owners_user_ids = ownersArr.map((x: any) => Number(x)).filter((n: any) => !Number.isNaN(n));
  // buildings or processing info if present
  if (Array.isArray(raw.buildings)) {
    out.buildings = raw.buildings.map((b: any) => ({
      openArea: Number(b?.openArea ?? b?.open_area ?? 0) || 0,
      closeArea: Number(b?.closeArea ?? b?.close_area ?? 0) || 0,
      processingFee: Number(b?.processingFee ?? b?.processing_fee ?? 0) || 0,
      name: b?.name || b?.type || '',
    }));
  }
  const pf = Number(raw.processingFees ?? raw.processing_fee ?? 0);
  if (!Number.isNaN(pf)) out.processingFees = pf.toFixed(2);
  // General fields
  const copyKeys = [
    'projectTitle','address','city','state','postalcode','country','landAddress','lotNumber','landStatus','typeGrant',
    'spesificCondition','landArea','existingCrops','existingBuilding','residentialBuilding','semiResidentialBuilding','otherBuilding',
    'landOrBuildingOwnerList'
  ];
  copyKeys.forEach((k) => {
    const alt = camelSnakeFallback(raw, k);
    if (alt !== undefined && alt !== null) out[k] = alt;
  });
  return out;
}

function camelSnakeFallback(obj: any, key: string): any {
  if (!obj) return undefined;
  if (key in obj) return obj[key];
  const snake = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
  if (snake in obj) return obj[snake];
  const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  if (camel in obj) return obj[camel];
  return undefined;
}
