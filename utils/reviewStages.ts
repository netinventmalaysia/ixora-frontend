export const REVIEW_STAGE_LABELS: Record<string, string> = {
  level1: 'First Reviewer',
  level2: 'Second Reviewer',
  final: 'Final Approval',
};

export const formatReviewStage = (stage?: string | null): string => {
  if (!stage) return '';
  return REVIEW_STAGE_LABELS[stage] || stage;
};
