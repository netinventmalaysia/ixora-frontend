import React, { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import LineSeparator from '@/components/forms/LineSeparator';
import Spacing from '@/components/forms/Spacing';
import { useRouter } from 'next/router';
import { adminGetMySkbProjectById, reviewMySkbProject } from '@/services/api';
import ProjectReadOnly from '@/components/myskb/ProjectReadOnly';
import { useReviewWorkflowAccess } from '@/hooks/useReviewWorkflowAccess';

export default function AdminMySkbReviewDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    canActOnStage,
    getStageLabel,
    loading: workflowLoading,
    error: workflowError,
  } = useReviewWorkflowAccess('myskb');

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

  const canReview = useMemo(() => {
    if (!project) return false;
    const stage = project?.review_stage;
    const status = (project?.status || '').toString().toLowerCase();
    return status === 'submitted' && canActOnStage(stage);
  }, [project, canActOnStage]);

  const onApprove = async () => {
    if (!id) return;
    if (!canActOnStage(project?.review_stage)) {
      window.alert('You are not assigned to the current review stage.');
      return;
    }
    try {
      await reviewMySkbProject(id as string, { status: 'Approved' });
      router.replace('/admin/myskb-reviews');
    } catch (e) {
      alert('Failed to approve');
    }
  };
  const onReject = async () => {
    if (!id) return;
    if (!canActOnStage(project?.review_stage)) {
      window.alert('You are not assigned to the current review stage.');
      return;
    }
    const reason =
      window.prompt('Please provide a rejection reason:', '') || undefined;
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
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onApprove}
                className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canReview}
              >
                Approve
              </button>
              <button
                onClick={onReject}
                className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canReview}
              >
                Reject
              </button>
            </div>
            <div className="rounded-md border border-gray-200 p-3 bg-white">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Current Stage
              </p>
              <p className="text-sm font-medium text-gray-900">
                {getStageLabel(project?.review_stage) || '—'}
              </p>
              {workflowLoading ? (
                <p className="text-xs text-gray-500">
                  Checking reviewer access…
                </p>
              ) : workflowError ? (
                <p className="text-xs text-red-600">{workflowError}</p>
              ) : !canReview &&
                (project?.status || '').toString().toLowerCase() ===
                  'submitted' ? (
                <p className="text-xs text-amber-600">
                  You are not assigned to this stage.
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <ProjectReadOnly data={project} />
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
