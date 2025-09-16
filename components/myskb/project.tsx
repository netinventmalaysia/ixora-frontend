import FormWrapper from "todo/components/forms/FormWrapper";
import Button from 'todo/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormActions from "todo/components/forms/FormActions";
import InputWithPrefix from "todo/components/forms/InputText";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import FormRow from "todo/components/forms/FormRow";
import { buildingUseOptions, countryOptions, landStatusOptions, OwnershipCategory, typeGrantOptions } from "todo/components/data/SelectionList";
import SelectField from "todo/components/forms/SelectField";
import CheckboxGroupField from "todo/components/forms/CheckboxGroupField";
import { emailNotificationOptions2 } from "todo/components/data/CheckList";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormContext, useWatch, useFieldArray } from "react-hook-form";
import RadioGroupField from "todo/components/forms/RadioGroupField";
import { landOrBuildingOwnerList } from "todo/components/data/RadioList";
import toast from 'react-hot-toast';
import DatePickerField from "todo/components/forms/DatePickerField";
import LayoutWithoutSidebar from "../main/LayoutWithoutSidebar";
import InputText from "todo/components/forms/InputText";
import { Label } from "@headlessui/react";
import Heading from "../forms/Heading";
import BuildingsTable from "todo/components/forms/BuildingsTable";
import FileUploadField from "../forms/FileUpload";
import { fetchMyBusinesses, saveProjectDraft, submitProject, listOwnerships, getProjectDraftById } from '@/services/api';
export default function ProjectPage() {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [businessOptions, setBusinessOptions] = useState<{ value: number; label: string }[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [ownerOptions, setOwnerOptions] = useState<{ value: number; label: string }[]>([]);
  const [formDefaults, setFormDefaults] = useState<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    fetchMyBusinesses()
      .then((data: any[]) => {
        const isWithdrawn = (item: any) => {
          const s = item?.status || item?.state || item?.applicationStatus || item?.statusName || item?.status_name || item?.currentStatus || item?.current_status;
          if (typeof s === 'string') return s.toLowerCase() === 'withdrawn';
          for (const v of Object.values(item || {})) if (typeof v === 'string' && /withdrawn/i.test(v)) return true;
          return false;
        };
        const opts = (data || [])
          .filter((biz) => !isWithdrawn(biz))
          .map((biz: any) => ({ value: biz.id, label: biz.name || biz.companyName || `#${biz.id}` }));
        setBusinessOptions(opts);
      })
      .catch(() => {/* ignore non-fatal */});
  }, []);

  // Load approved ownerships when business changes
  useEffect(() => {
    if (!selectedBusinessId) { setOwnerOptions([]); return; }
    listOwnerships({ business_id: selectedBusinessId, status: 'Approved', limit: 100, offset: 0 })
      .then(({ data }) => {
        const opts = (data || []).map((o: any) => ({
          value: o.id, // use ownership id as selection value
          label: o.name || o.email,
        }));
        setOwnerOptions(opts);
      })
      .catch(() => setOwnerOptions([]));
  }, [selectedBusinessId]);

  // If arriving with a draft_id in the URL, fetch the draft and prefill the form
  useEffect(() => {
    const draftId = router.query?.draft_id as string | undefined;
    if (!draftId) return;
    let mounted = true;
    (async () => {
      try {
        const draft = await getProjectDraftById(draftId);
        const defaults = { ...(draft?.data || {}) } as Record<string, any>;
        // Transform legacy flat keys like 'buildings.0.openArea' into array form expected by useFieldArray
        if (!Array.isArray(defaults.buildings)) {
          const map: Record<number, any> = {};
          Object.keys(defaults).forEach((k) => {
            const m = k.match(/^buildings\.(\d+)\.(\w+)$/);
            if (m) {
              const idx = Number(m[1]);
              const prop = m[2];
              if (!map[idx]) map[idx] = {};
              map[idx][prop] = (defaults as any)[k];
              // Optionally remove flat keys to avoid confusion
              delete (defaults as any)[k];
            }
          });
          const idxs = Object.keys(map)
            .map((s) => Number(s))
            .filter((n) => !Number.isNaN(n))
            .sort((a, b) => a - b);
          if (idxs.length > 0) {
            defaults.buildings = idxs.map((i) => map[i]);
          }
        }
        if (draft?.business_id) defaults.business_id = draft.business_id;
        if (!mounted) return;
        setFormDefaults(defaults);
        if (defaults?.business_id) {
          const bid = Number(defaults.business_id);
          if (!Number.isNaN(bid)) setSelectedBusinessId(bid);
        }
      } catch {
        // ignore load failures for now
      }
    })();
    return () => { mounted = false; };
  }, [router.query?.draft_id]);

  // Helper: compute per-building fee and total fee (min RM 140 per row)
  function BuildingsFeesAutoCalc() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { control, setValue } = useFormContext();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const buildings = useWatch({ control, name: 'buildings' }) as Array<any> | undefined;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!Array.isArray(buildings) || buildings.length === 0) {
        setValue('processingFees', '0.00', { shouldValidate: true, shouldDirty: true });
        return;
      }
      let total = 0;
      buildings.forEach((b, idx) => {
        const open = Number(b?.openArea) || 0;
        const close = Number(b?.closeArea) || 0;
        const feeRaw = Math.max(140, open * 0.75 + close * 1.5);
        const rounded = Math.round((feeRaw + Number.EPSILON) * 100) / 100;
        total += rounded;
        const fixed = rounded.toFixed(2);
        // Write back per-row fee only if changed to avoid loops
        const current = b?.processingFee;
        if (`${current}` !== fixed) {
          setValue(`buildings.${idx}.processingFee`, fixed, { shouldValidate: true, shouldDirty: true });
        }
      });
      const totalRounded = Math.round((total + Number.EPSILON) * 100) / 100;
      const totalFixed = totalRounded.toFixed(2);
      setValue('processingFees', totalFixed, { shouldValidate: true, shouldDirty: true });
    }, [JSON.stringify(buildings), setValue]);
    return null;
  }

  // BuildingsTable extracted as reusable component

  // Button that saves a draft using react-hook-form values (keeps nested arrays like buildings)
  function DraftSaveButton({ onSave, loading }: { onSave: (data: any) => void | Promise<void>; loading: boolean }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getValues } = useFormContext();
    return (
      <Button
        type="button"
        variant="secondary"
        loading={loading}
        onClick={() => {
          const data = getValues();
          onSave(data);
        }}
      >
        Save draft
      </Button>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (!data.business_id) {
        toast.error('Please select a Business');
        return;
      }
      // Normalize numeric fields for backend
      const payload: any = { ...data };
      if (Array.isArray(payload.buildings)) {
        payload.buildings = payload.buildings.map((b: any) => ({
          ...b,
          openArea: Number(b?.openArea || 0),
          closeArea: Number(b?.closeArea || 0),
          processingFee: Number(b?.processingFee || 0),
        }));
      }
      payload.processingFees = Number(payload.processingFees || 0);
      const res = await submitProject(payload, { draftId: (router.query?.draft_id as string) || undefined });
      toast.success('Project submitted');
      console.log('Submit result:', res);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed to submit project');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async (data: any) => {
    try {
      setSavingDraft(true);
      if (!data.business_id) {
        toast.error('Please select a Business');
        return;
      }
      // Normalize numeric fields for backend while saving draft
      const payload: any = { ...data };
      if (Array.isArray(payload.buildings)) {
        payload.buildings = payload.buildings.map((b: any) => ({
          ...b,
          openArea: Number(b?.openArea || 0),
          closeArea: Number(b?.closeArea || 0),
          processingFee: Number(b?.processingFee || 0),
        }));
      }
      payload.processingFees = Number(payload.processingFees || 0);
      const res = await saveProjectDraft({ ...payload, draft: true }, { draftId: (router.query?.draft_id as string) || undefined });
      toast.success('Draft saved');
      console.log('Draft result:', res);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed to save draft');
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      <FormWrapper onSubmit={handleSubmit} defaultValues={formDefaults}>
        {/* This section introduce about the project spesification for the consultant to register a new project and tie with all active ownership, after the registration is successful it will send to mbmb for review, once the review is completed and the consultant have to pay the amount of the project */}
  <FormSectionHeader title="Ownership Information" description="Please fill in the details of your project. This information will be used to register your project with MBMB." />
  <Spacing size="lg" />
  <SelectField id="business_id" name="business_id" label="Business" options={businessOptions} requiredMessage="Business is required" onChange={(e) => setSelectedBusinessId(Number(e.target.value))} />
  <Spacing size="lg" />
  <SelectField id="owner_id" name="owner_id" label="Project Owner" options={ownerOptions} requiredMessage="Project Owner is required" placeholder={selectedBusinessId ? 'Select approved owner' : 'Select business first'} />
        <Spacing size="sm" />
        <SelectField id="ownerCategory" name="ownerCategory" label="Ownership Category" options={OwnershipCategory} requiredMessage="Country is required" />
        <Spacing size="lg" />

        <RadioGroupField name="landOrBuildingOwnerList" label="*Is the owner is not land or building owner?" options={landOrBuildingOwnerList} inline={true} requiredMessage="Please select a land or building owner" />
        <Spacing size="sm" />
  <FileUploadField name="statutoryDeclarationFile" label="Statutory Declaration File" description="PDF up to 10MB" accept="application/pdf" requiredMessage="Please upload a cover photo statutory declaration" />
        <Spacing size="sm" />
  <FileUploadField name="landHeirDeclarationFile" label="Land Heir Declaration" description="PDF up to 10MB" accept="application/pdf" requiredMessage="Please upload a cover photo land heir declaration" />
        <Spacing size="sm" />
  <FileUploadField name="rentalAgreementFile" label="Rental Agreement" description="PDF up to 10MB" accept="application/pdf" requiredMessage="Please upload a cover photo rental agreement" />
        <LineSeparator />

        <FormSectionHeader title="Project Information" description="Please fill in the details of your project. This information will be used to register your project with MBMB." />
        <Spacing size="lg" />
        <InputText id="projectTitle" name="projectTitle" label="Project Title" requiredMessage="Project Title is required" />
        <Spacing size="lg" />

        <InputText id="address" name="address" label="Project Address" requiredMessage="Address is required" />

        <Spacing size="sm" />
        <FormRow columns={3}>
          <InputText id="city" name="city" label="City" requiredMessage="City is required" />
          <InputText id="state" name="state" label="State / Province" requiredMessage="State / Province is required" />
          <InputText id="postalcode" name="postalcode" label="ZIP / Postal code" requiredMessage="ZIP / Postal code is required" />
        </FormRow>
        <Spacing size="sm" />
        <SelectField id="country" name="country" label="Country" options={countryOptions} requiredMessage="Country is required" />
        <Spacing size="sm" />

        <LineSeparator />
        <FormSectionHeader title="Land Infromation" description="Provide additional details about your land." />
        <Spacing size="lg" />

        <InputText id="landAddress" name="landAddress" label="Subdistrict / Town / City Area" requiredMessage="Subdistrict / Town / City Area is required" />
        <Spacing size="sm" />

        <InputText id="lotNumber" name="lotNumber" label="Lot / Plot Number" requiredMessage="Lot / Plot Number" />
        <Spacing size="sm" />

        <SelectField id="landStatus" name="landStatus" label="Land Status" options={landStatusOptions} requiredMessage="Land status is required" />
        <Spacing size="sm" />

        <SelectField id="typeGrant" name="typeGrant" label="Type of Grant" options={typeGrantOptions} requiredMessage="Type of Grant is required" />
        <Spacing size="sm" />


        <InputText id="spesificCondition" name="spesificCondition" label="Specific Conditions" />
        <Spacing size="sm" />

        <InputText id="landArea" name="landArea" label="Land Area (m2)" type="number" requiredMessage="Land Area is required" />
        <Spacing size="sm" />

        <InputText id="existingCrops" name="existingCrops" label="Existing Crops" />
        <Spacing size="sm" />

        <InputText id="existingBuilding" name="existingBuilding" label="Existing Building" type="number" />
        <Spacing size="sm" />

        <InputText id="residentialBuilding" name="residentialBuilding" label="Number of permanent residential building units
" type="number" />
        <Spacing size="sm" />

        <InputText id="semiResidentialBuilding" name="semiResidentialBuilding" label="Number of semi-permanent residential building units
" type="number" />
        <Spacing size="sm" />

        <InputText id="otherBuilding" name="otherBuilding" label="Other buildings" type="number" />
        <Spacing size="sm" />

        <LineSeparator />

        <FormSectionHeader title="Propose Usage Information" description="Add one or more buildings and their areas. Each building's processing fee is auto-calculated with a minimum of RM 140." />
        <Spacing size="lg" />

        <BuildingsTable />

        <Spacing size="md" />
        <InputText
          id="processingFees"
          name="processingFees"
          label="Total Processing Fees"
          type="text"
          prefix="RM"
          requiredMessage="Processing Fees is required"
          readOnly
          rightElement={<span className="text-xs text-gray-500">Auto</span>}
        />

        {/* Auto-calc syncer (invisible) */}
        <BuildingsFeesAutoCalc />

        <FormActions>
          <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>Cancel</Button>
          <DraftSaveButton onSave={handleSaveDraft} loading={savingDraft} />
          <Button type="submit" variant="primary" loading={loading}>Submit</Button>
        </FormActions>


  </FormWrapper>


      <ConfirmDialog
        open={showCancelDialog}
        title="Discard changes?"
        description="Your unsaved changes will be lost. Are you sure you want to leave this form?"
        confirmText="Yes, discard"
        cancelText="Stay"
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          router.push('/form'); // or reset form
        }}
      />

    </LayoutWithoutSidebar>


  );
}

