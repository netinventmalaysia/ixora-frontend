import { useCallback, useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import SelectField from '@/components/forms/SelectField';
import InputText from '@/components/forms/InputText';
import Button from '@/components/forms/Button';
import Toggle from '@/components/forms/Toggle';
import Card from '@/components/forms/Card';
import toast from 'react-hot-toast';
import {
  getReviewWorkflow,
  updateReviewWorkflow,
  ReviewWorkflowStageView,
  ReviewWorkflowStageMemberView,
} from '@/services/api';
import { REVIEW_STAGE_LABELS } from '@/utils/reviewStages';

const MODULE_OPTIONS = [{ value: 'myskb', label: 'MySKB' }];

const STAGE_DESCRIPTIONS: Record<string, string> = {
  level1: 'First reviewers that pick up every submission before it can move forward.',
  level2: 'Optional second-line reviewers for submissions requiring additional scrutiny.',
  final: 'Final approvers. This stage is always required and cannot be disabled.',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type StageMember = Pick<ReviewWorkflowStageMemberView, 'email' | 'name' | 'userId'>;

type StageState = {
  stage: string;
  enabled: boolean;
  members: StageMember[];
};

const cloneStages = (list: StageState[]): StageState[] =>
  list.map((stage) => ({
    ...stage,
    members: stage.members.map((member) => ({ ...member })),
  }));

const buildFingerprint = (list: StageState[]) =>
  list.map((stage) => ({
    stage: stage.stage,
    enabled: stage.stage === 'final' ? true : Boolean(stage.enabled),
    members: [...stage.members.map((m) => m.email.toLowerCase())].sort(),
  }));

export default function ReviewWorkflowAdminPage() {
  const [moduleKey, setModuleKey] = useState('myskb');
  const [stages, setStages] = useState<StageState[]>([]);
  const [initialStages, setInitialStages] = useState<StageState[]>([]);
  const [emailDrafts, setEmailDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchWorkflow = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const data = await getReviewWorkflow(key);
      const ordered = (data?.stages || [])
        .slice()
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      const normalized: StageState[] = ordered.map((stage: ReviewWorkflowStageView) => ({
        stage: stage.stage,
        enabled: stage.stage === 'final' ? true : stage.enabled !== false,
        members: (stage.members || []).map((member) => ({
          email: member.email,
          name: member.name,
          userId: member.userId,
        })),
      }));
      const cloned = cloneStages(normalized);
      setStages(cloned);
      setInitialStages(cloneStages(normalized));
      setEmailDrafts({});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load workflow');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflow(moduleKey);
  }, [moduleKey, fetchWorkflow]);

  const dirty = useMemo(() => {
    if (!stages.length && !initialStages.length) return false;
    return JSON.stringify(buildFingerprint(stages)) !== JSON.stringify(buildFingerprint(initialStages));
  }, [stages, initialStages]);

  const handleToggleStage = (stageKey: string, value: boolean) => {
    if (stageKey === 'final') return;
    setStages((prev) =>
      prev.map((stage) => (stage.stage === stageKey ? { ...stage, enabled: value } : stage)),
    );
  };

  const handleAddMember = (stageKey: string) => {
    const email = (emailDrafts[stageKey] || '').trim();
    if (!email) {
      toast.error('Enter an email to add');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      toast.error('Please provide a valid email address');
      return;
    }
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.stage !== stageKey) return stage;
        const exists = stage.members.some((member) => member.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          toast.error('User already assigned to this stage');
          return stage;
        }
        return {
          ...stage,
          members: [...stage.members, { email }],
        };
      }),
    );
    setEmailDrafts((prev) => ({ ...prev, [stageKey]: '' }));
  };

  const handleRemoveMember = (stageKey: string, email: string) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.stage === stageKey
          ? { ...stage, members: stage.members.filter((member) => member.email !== email) }
          : stage,
      ),
    );
  };

  const handleReset = () => {
    setStages(cloneStages(initialStages));
    setEmailDrafts({});
  };

  const handleSave = async () => {
    const payload = {
      stages: stages.map((stage) => ({
        stage: stage.stage,
        enabled: stage.stage === 'final' ? true : stage.enabled,
        user_emails: stage.members.map((member) => member.email),
      })),
    };
    try {
      setSaving(true);
      await updateReviewWorkflow(moduleKey, payload);
      toast.success('Workflow saved');
      await fetchWorkflow(moduleKey);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SidebarLayout>
      <Heading level={3} align="left" bold>
        Review Workflow Configuration
      </Heading>
      <Spacing size="sm" />
      <p className="text-sm text-gray-600">
        Assign reviewers per stage for each module. Only users listed under a stage can act on submissions when that stage is active.
      </p>
      <Spacing size="md" />

      <div className="max-w-sm">
        <SelectField
          id="module"
          name="module"
          label="Module"
          options={MODULE_OPTIONS}
          value={moduleKey}
          onChange={(event) => setModuleKey(event.target.value)}
        />
      </div>

      <Spacing size="md" />

      {loading ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
          Loading workflow…
        </div>
      ) : (
        <div className="space-y-4">
          {stages.map((stage) => {
            const label = REVIEW_STAGE_LABELS[stage.stage] || stage.stage;
            const description = STAGE_DESCRIPTIONS[stage.stage] || 'Review stage';
            const canToggle = stage.stage !== 'final';
            return (
              <Card key={stage.stage} className="bg-white shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-gray-900">{label}</p>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                  <div className="max-w-xs">
                    <Toggle
                      label="Stage enabled"
                      description={canToggle ? 'Disable if this stage is not needed for the module.' : 'Always enabled'}
                      checked={stage.stage === 'final' ? true : stage.enabled}
                      onChange={(next) => handleToggleStage(stage.stage, next)}
                    />
                  </div>
                </div>

                <Spacing size="sm" />

                <div>
                  <p className="text-sm font-medium text-gray-700">Assigned Users</p>
                  <Spacing size="xs" />
                  {stage.members.length ? (
                    <div className="flex flex-wrap gap-2">
                      {stage.members.map((member) => (
                        <span
                          key={`${stage.stage}-${member.email}`}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-800"
                        >
                          <span>{member.name || member.email}</span>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => handleRemoveMember(stage.stage, member.email)}
                            aria-label={`Remove ${member.email}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No reviewers assigned yet.</p>
                  )}
                </div>

                <Spacing size="sm" />

                <div className="grid gap-3 sm:grid-cols-3">
                  <InputText
                    id={`email-${stage.stage}`}
                    name={`email-${stage.stage}`}
                    label="Add reviewer"
                    placeholder="name@example.com"
                    type="email"
                    colSpan="sm:col-span-2"
                    value={emailDrafts[stage.stage] || ''}
                    onChange={(event) =>
                      setEmailDrafts((prev) => ({ ...prev, [stage.stage]: event.target.value }))
                    }
                  />
                  <div className="flex items-end">
                    <Button type="button" className="w-full" onClick={() => handleAddMember(stage.stage)}>
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Spacing size="lg" />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          disabled={!dirty || saving || loading}
        >
          Reset
        </Button>
        <Button type="button" onClick={handleSave} disabled={!dirty || saving || loading} loading={saving}>
          Save Changes
        </Button>
      </div>
    </SidebarLayout>
  );
}
