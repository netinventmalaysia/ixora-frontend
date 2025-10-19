import React, { useEffect, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import LineSeparator from '@/components/forms/LineSeparator';
import Spacing from '@/components/forms/Spacing';
import { useRouter } from 'next/router';
import { adminGetMySkbProjectById, reviewMySkbProject } from '@/services/api';
import ProjectReadOnly from '@/components/myskb/ProjectReadOnly';

export default function AdminMySkbReviewDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const p = await adminGetMySkbProjectById(id as string);
        setProject(p);
      } catch (e: any) {
        setError(e?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onApprove = async () => {
    if (!id) return;
    try {
      await reviewMySkbProject(id as string, { status: 'Approved' });
      router.replace('/admin/myskb-reviews');
    } catch (e) {
      alert('Failed to approve');
    }
  };
  const onReject = async () => {
    if (!id) return;
    const reason = window.prompt('Please provide a rejection reason:', '') || undefined;
    try {
      await reviewMySkbProject(id as string, { status: 'Rejected', reason });
      router.replace('/admin/myskb-reviews');
    } catch (e) {
      alert('Failed to reject');
    }
  };

  return (
    <SidebarLayout>
      <Heading level={3} align="left" bold>
        Review Application #{id}
      </Heading>
      <Spacing size="sm" />
      <LineSeparator />
      <Spacing size="sm" />

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : !project ? (
        <div className="text-sm text-gray-500">No project</div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={onApprove} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm">Approve</button>
            <button onClick={onReject} className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm">Reject</button>
          </div>
          <div>
            <ProjectReadOnly data={project} />
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
