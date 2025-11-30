export const REVIEW_STAGE_LABELS: Record<string, string> = {
  level1: 'First Reviewer',
  level2: 'Second Reviewer',
  final: 'Final Approval',
};

export const REVIEW_STAGE_ORDER: string[] = ['level1', 'level2', 'final'];

export const normalizeReviewStage = (stage?: string | null): string | null => {
  if (!stage) return null;
  const value = String(stage).trim();
  if (!value) return null;
  const lower = value.toLowerCase();
  if (REVIEW_STAGE_ORDER.includes(lower)) return lower;
  return value;
};

export const formatReviewStage = (stage?: string | null): string => {
  const normalized = normalizeReviewStage(stage);
  if (!normalized) return '';
  return REVIEW_STAGE_LABELS[normalized] || normalized;
};

export const extractReviewStage = (source: any): string | null => {
  if (!source) return null;
  const raw =
    source?.reviewStage ??
    source?.review_stage ??
    source?.data?.reviewStage ??
    source?.data?.review_stage ??
    null;
  return normalizeReviewStage(raw);
};

export const hasPendingReviewStage = (source: any): boolean =>
  !!extractReviewStage(source);
