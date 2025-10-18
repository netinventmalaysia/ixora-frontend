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
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
        const proj = await getProjectById(id as string);
        console.log('Fetched project:', proj);
        if (mounted && proj) {
          setData(proj);
          setLoading(false);
          return;
        }
    
    })();
    return () => { mounted = false; }
  }, [id]);

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
                const printable = data;
                const ownerLines = owners.length
                  ? owners.map((o) => o.name || o.email || (o.user_id ? `User #${o.user_id}` : '—')).join(', ')
                  : (Array.isArray((data as any)?.owners_user_ids) ? (data as any).owners_user_ids.join(', ') : '—');
                const address = [printable.address, printable.city, printable.state, printable.postalcode].filter(Boolean).join(', ');
                const { default: jsPDF } = await import('jspdf');
                const autoTable = (await import('jspdf-autotable')).default as any;
                const doc = new jsPDF({ unit: 'pt' });
                const line = (label: string, value?: string) => `${label}: ${value ?? '—'}`;
                let y = 40;
                doc.setFontSize(16);
                doc.text('Project Application', 40, y);
                y += 24;
                doc.setFontSize(11);
                doc.text(line('Project Title', printable.projectTitle), 40, y); y += 16;
                doc.text(line('Business', businessName || (printable.business_id ? `#${printable.business_id}` : '—')), 40, y); y += 16;
                doc.text(line('Owners', ownerLines), 40, y); y += 16;
                doc.text(line('Address', address || '—'), 40, y); y += 16;
                doc.text(line('Country', printable.country || '—'), 40, y); y += 16;
                doc.text(line('Processing Fees', printable.processingFees ? `RM ${Number(printable.processingFees).toFixed(2)}` : '—'), 40, y); y += 24;

                // Land section
                doc.setFontSize(13); doc.text('Land Information', 40, y); y += 18; doc.setFontSize(11);
                doc.text(line('Subdistrict/Town/City', printable.landAddress || '—'), 40, y); y += 16;
                doc.text(line('Lot/Plot Number', printable.lotNumber || '—'), 40, y); y += 16;
                doc.text(line('Land Status', printable.landStatus || '—'), 40, y); y += 16;
                doc.text(line('Type of Grant', printable.typeGrant || '—'), 40, y); y += 16;
                doc.text(line('Specific Conditions', printable.spesificCondition || '—'), 40, y); y += 16;
                doc.text(line('Land Area (m2)', printable.landArea != null ? String(printable.landArea) : '—'), 40, y); y += 24;

                // Buildings table
                const rows = Array.isArray(printable.buildings) ? printable.buildings.map((b: any) => [
                  b?.name || '—',
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

                const fname = (printable.projectTitle ? printable.projectTitle.replace(/[^a-z0-9\-]+/gi, '_').toLowerCase() : `project_${id}`) + '.pdf';
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
          <ProjectReadOnly data={data}  />
        )}
      </div>
    </SidebarLayout>
  );
};

export default ProjectDetailPage;

