import { useCallback, useEffect, useMemo, useState } from 'react';
import { getReviewWorkflow, ReviewWorkflowResponse } from '@/services/api';
import { REVIEW_STAGE_LABELS } from '@/utils/reviewStages';

interface WorkflowUserInfo {
  userId?: number;
  email?: string;
  role?: string;
}

export function useReviewWorkflowAccess(moduleKey: string) {
  const [user, setUser] = useState<WorkflowUserInfo>({});
  const [workflow, setWorkflow] = useState<ReviewWorkflowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const idRaw = window.localStorage.getItem('userId');
    const parsedId = idRaw ? Number(idRaw) : undefined;
    const numericId = typeof parsedId === 'number' && Number.isFinite(parsedId) ? parsedId : undefined;
    setUser({
      userId: numericId,
      email: window.localStorage.getItem('email') || undefined,
      role: window.localStorage.getItem('userRole') || undefined,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getReviewWorkflow(moduleKey)
      .then((res) => {
        if (cancelled) return;
        setWorkflow(res);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err?.response?.data?.message || err?.message || 'Failed to load workflow configuration';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [moduleKey]);

  const allowedStages = useMemo(() => {
    if (user.role === 'superadmin') return ['level1', 'level2', 'final'];
    if (!workflow) return [];
    const emailLower = user.email?.toLowerCase();
    return workflow.stages
      .filter((stage) => stage.enabled !== false && stage.members?.some((member) => {
        if (typeof user.userId === 'number' && member.userId === user.userId) return true;
        if (emailLower && member.email?.toLowerCase() === emailLower) return true;
        return false;
      }))
      .map((stage) => stage.stage);
  }, [workflow, user]);

  const canActOnStage = useCallback((stage?: string | null) => {
    if (!stage) return false;
    if (user.role === 'superadmin') return true;
    if (!workflow) return false;
    const config = workflow.stages.find((item) => item.stage === stage);
    if (!config || config.enabled === false) return false;
    return allowedStages.includes(stage);
  }, [allowedStages, user, workflow]);

  const getStageLabel = useCallback((stage?: string | null) => {
    if (!stage) return '';
    const labelFromConfig = workflow?.stages?.find((item) => item.stage === stage)?.label;
    return labelFromConfig || REVIEW_STAGE_LABELS[stage] || stage;
  }, [workflow]);

  return {
    user,
    workflow,
    allowedStages,
    canActOnStage,
    getStageLabel,
    loading,
    error,
  };
}
