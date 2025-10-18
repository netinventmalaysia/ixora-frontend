import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SidebarLayout from 'todo/components/main/SidebarLayout';
import Heading from 'todo/components/forms/Heading';
import ProjectReadOnly from 'todo/components/myskb/ProjectReadOnly';
import { getProjectById, getProjectDraftById } from '@/services/api';

const ProjectDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const viewerUserIdRaw = router.query?.viewerUserId as string | string[] | undefined;
        const viewerUserId = Array.isArray(viewerUserIdRaw)
          ? Number(viewerUserIdRaw[0])
          : (viewerUserIdRaw !== undefined ? Number(viewerUserIdRaw) : undefined);
        const validViewer = Number.isNaN(Number(viewerUserId)) ? undefined : (viewerUserId as number);

        // Prefer submitted/active project
        const proj = await getProjectById(id as string, { viewerUserId: validViewer });
        if (mounted && proj) {
          setData(proj);
          setLoading(false);
          return;
        }
        // Fallback to draft
        const draft = await getProjectDraftById(id as string, { viewerUserId: validViewer });
        if (mounted) setData(draft);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load project');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, router.query]);

  return (
    <SidebarLayout>
      <div className="flex items-center justify-between">
        <Heading level={5} align="left" bold>
          Project Details
        </Heading>
        {!loading && !error && data ? (
          <button
            type="button"
            onClick={async () => {
              try {
                setGenerating(true);
                const project: any = data || {};
                const form: any = (project && typeof project === 'object') ? (project.data || {}) : {};
                const ownerLines = Array.isArray(project?.owners) && project.owners.length
                  ? project.owners.map((o: any) => o?.name || o?.email || (o?.user_id ? `User #${o.user_id}` : '—')).join(', ')
                  : (Array.isArray(project?.owners_user_ids) ? project.owners_user_ids.join(', ') : '—');
                const address = [form.address, form.city, form.state, form.postalcode].filter(Boolean).join(', ');
                const businessLabel = project?.business?.name || (project?.business_id ? `#${project.business_id}` : '—');
                const status = (project?.status || '').toString();
                const submitted = project?.created_at ? new Date(project.created_at).toLocaleString() : null;

                const { default: jsPDF } = await import('jspdf');
                const autoTable = (await import('jspdf-autotable')).default as any;
                const doc = new jsPDF({ unit: 'pt' });
                const line = (label: string, value?: string | null) => `${label}: ${value ?? '—'}`;
                let y = 40;
                doc.setFontSize(16);
                doc.text('Project Application', 40, y);
                y += 24;
                doc.setFontSize(11);
                if (status) { doc.text(line('Status', status), 40, y); y += 16; }
                if (submitted) { doc.text(line('Submitted On', submitted), 40, y); y += 16; }
                doc.text(line('Project Title', form.projectTitle), 40, y); y += 16;
                doc.text(line('Business', businessLabel), 40, y); y += 16;
                doc.text(line('Owners', ownerLines), 40, y); y += 16;
                doc.text(line('Address', address || '—'), 40, y); y += 16;
                doc.text(line('Country', form.country || '—'), 40, y); y += 16;
                doc.text(line('Processing Fees', (form.processingFees != null) ? `RM ${Number(form.processingFees).toFixed(2)}` : '—'), 40, y); y += 24;

                // Land section
                doc.setFontSize(13); doc.text('Land Information', 40, y); y += 18; doc.setFontSize(11);
                doc.text(line('Subdistrict/Town/City', form.landAddress || '—'), 40, y); y += 16;
                doc.text(line('Lot/Plot Number', form.lotNumber || '—'), 40, y); y += 16;
                doc.text(line('Land Status', form.landStatus || '—'), 40, y); y += 16;
                doc.text(line('Type of Grant', form.typeGrant || '—'), 40, y); y += 16;
                doc.text(line('Specific Conditions', form.spesificCondition || '—'), 40, y); y += 16;
                doc.text(line('Land Area (m2)', form.landArea != null ? String(form.landArea) : '—'), 40, y); y += 24;

                // Buildings table
                const rows = Array.isArray(form.buildings) ? form.buildings.map((b: any) => [
                  (b?.buildingUse || b?.name || '—'),
                  Number(b?.openArea ?? 0).toString(),
                  Number(b?.closeArea ?? 0).toString(),
                  `RM ${Number(b?.processingFee ?? 0).toFixed(2)}`,
                ]) : [];
                if (rows.length > 0) {
                  autoTable(doc, {
                    startY: y,
                    head: [['Name/Type', 'Open Area (m2)', 'Close Area (m2)', 'Processing Fee']],
                    body: rows,
                    styles: { fontSize: 10 },
                    theme: 'grid',
                    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
                    margin: { left: 40, right: 40 },
                  });
                }

                const fname = (form.projectTitle ? form.projectTitle.replace(/[^a-z0-9\-]+/gi, '_').toLowerCase() : `project_${id}`) + '.pdf';
                doc.save(fname);
              } catch (e) {
                console.error('PDF generation failed', e);
              } finally {
                setGenerating(false);
              }
            }}
            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm ${generating ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-500'}`}
            disabled={generating}
          >
            {generating ? 'Generating…' : 'Download PDF'}
          </button>
        ) : null}
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="text-sm text-gray-500">Loading…</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <ProjectReadOnly data={data} />
        )}
      </div>
    </SidebarLayout>
  );
};

export default ProjectDetailPage;

