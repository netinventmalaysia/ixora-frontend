import React, { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import LineSeparator from '@/components/forms/LineSeparator';
import Spacing from '@/components/forms/Spacing';
import { listAdminMySkbProjects, reviewMySkbProject, AdminProjectItem } from '@/services/api';
import { useRouter } from 'next/router';
import { useReviewWorkflowAccess } from '@/hooks/useReviewWorkflowAccess';

export default function MySkbReviewsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'submitted' | 'approved' | 'rejected'>('submitted');
  const [rows, setRows] = useState<AdminProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { canActOnStage, getStageLabel, loading: workflowLoading, error: workflowError } = useReviewWorkflowAccess('myskb');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listAdminMySkbProjects({ status, limit: 50, offset: 0 });
      setRows(res?.data || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [status]);

  const onApprove = async (p: AdminProjectItem) => {
    if (!canActOnStage(p.reviewStage)) {
      window.alert('You are not assigned to the current review stage.');
      return;
    }
    if (!window.confirm('Approve this project?')) return;
    await reviewMySkbProject(p.id, { status: 'Approved' });
    fetchData();
  };

  const onReject = async (p: AdminProjectItem) => {
    if (!canActOnStage(p.reviewStage)) {
      window.alert('You are not assigned to the current review stage.');
      return;
    }
    const reason = window.prompt('Please provide a rejection reason:', '') || undefined;
    if (reason === undefined && !window.confirm('Proceed with rejection without a reason?')) return;
    await reviewMySkbProject(p.id, { status: 'Rejected', reason });
    fetchData();
  };

  return (
    <SidebarLayout>
      <Heading level={3} align="left" bold>
        MySKB Reviews
      </Heading>
      <Spacing size="sm" />
      <LineSeparator />
      <Spacing size="sm" />

      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm text-gray-700">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {workflowLoading ? (
        <div className="mb-3 text-xs text-gray-500">Checking reviewer access…</div>
      ) : workflowError ? (
        <div className="mb-3 text-xs text-red-600">{workflowError}</div>
      ) : null}

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">ID</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Title</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Business</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Created</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Stage</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-sm text-gray-500">No projects</td>
                </tr>
              ) : rows.map((p) => {
                const title = (p as any).projectTitle || (p as any)?.data?.projectTitle || `#${p.id}`;
                const created = p.created_at ? new Date(p.created_at).toLocaleString() : '-';
                const business = (p as any)?.business?.name || (p as any)?.businessName || (p as any)?.businessId || '-';
                return (
                  <tr key={p.id}>
                    <td className="px-3 py-2 text-sm text-gray-900">{p.id}</td>
                    <td
                      className="px-3 py-2 text-sm text-blue-600 hover:underline cursor-pointer"
                      onClick={() => router.push(`/admin/myskb-reviews/${p.id}`)}
                      title="View details"
                    >
                      {title}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">{String(business)}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{created}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      {getStageLabel(p.reviewStage) || '—'}
                      {status === 'submitted' && p.reviewStage && !canActOnStage(p.reviewStage) ? (
                        <p className="text-xs text-amber-600">Not assigned to this stage</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900 capitalize">{p.status}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      <div className="flex gap-2">
                        <button onClick={() => router.push(`/admin/myskb-reviews/${p.id}`)} className="px-3 py-1.5 rounded-md bg-white ring-1 ring-gray-300 text-gray-900 text-sm">View</button>
                        {status === 'submitted' ? (
                          <>
                            <button
                              onClick={() => onApprove(p)}
                              className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!canActOnStage(p.reviewStage)}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onReject(p)}
                              className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!canActOnStage(p.reviewStage)}
                            >
                              Reject
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SidebarLayout>
  );
}
