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
        setValue('processingFees', 0, { shouldValidate: true, shouldDirty: true });
        return;
      }
      let total = 0;
      buildings.forEach((b, idx) => {
        const open = Number(b?.openArea) || 0;
        const close = Number(b?.closeArea) || 0;
        const fee = Math.max(140, open * 0.75 + close * 1.5);
        const rounded = Math.round((fee + Number.EPSILON) * 100) / 100;
        total += rounded;
        // Write back per-row fee without triggering loops unnecessarily
        setValue(`buildings.${idx}.processingFee`, rounded, { shouldValidate: true, shouldDirty: true });
      });
      setValue('processingFees', Math.round((total + Number.EPSILON) * 100) / 100, { shouldValidate: true, shouldDirty: true });
    }, [JSON.stringify(buildings), setValue]);
    return null;
  }

  // Table-like component for multiple buildings
  function BuildingsTable() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { control } = useFormContext();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { fields, append, remove } = useFieldArray({ control, name: 'buildings' });

    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <div>
            <Heading level={3}>Buildings</Heading>
            <p className="text-xs text-gray-600">Add one or more building entries</p>
          </div>
          <Button type="button" variant="secondary" onClick={() => append({ buildingUse: '', openArea: '', closeArea: '', processingFee: 140 })}>
            + Add Building
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-gray-600">No buildings added yet. Click "+ Add Building" to start.</p>
        ) : (
          <div className="overflow-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left">Use</th>
                  <th className="px-2 py-2 text-left">Open Area (m²)</th>
                  <th className="px-2 py-2 text-left">Close Area (m²)</th>
                  <th className="px-2 py-2 text-left">Processing Fee (RM)</th>
                  <th className="px-2 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, idx) => {
                  const base = `buildings.${idx}`;
                  return (
                    <tr key={f.id} className="border-t align-top">
                      <td className="px-2 py-2 min-w-[220px]">
                        <SelectField id={`${base}.buildingUse`} name={`${base}.buildingUse`} label="" options={buildingUseOptions} placeholder="Select use" requiredMessage="Required" />
                      </td>
                      <td className="px-2 py-2 min-w-[180px]">
                        <InputText id={`${base}.openArea`} name={`${base}.openArea`} label="" type="number" placeholder="0" />
                        <p className="text-[11px] text-gray-500 mt-1">x RM 0.75</p>
                      </td>
                      <td className="px-2 py-2 min-w-[180px]">
                        <InputText id={`${base}.closeArea`} name={`${base}.closeArea`} label="" type="number" placeholder="0" />
                        <p className="text-[11px] text-gray-500 mt-1">x RM 1.50</p>
                      </td>
                      <td className="px-2 py-2 min-w-[180px]">
                        <InputText id={`${base}.processingFee`} name={`${base}.processingFee`} label="" type="number" prefix="RM" readOnly rightElement={<span className="text-xs text-gray-500">Auto</span>} />
                        <p className="text-[11px] text-gray-500 mt-1">Min RM 140</p>
                      </td>
                      <td className="px-2 py-2">
                        <Button type="button" variant="ghost" onClick={() => remove(idx)}>Remove</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (!data.business_id) {
        toast.error('Please select a Business');
        return;
      }
      const res = await submitProject(data);
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
      const res = await saveProjectDraft({ ...data, draft: true });
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
          type="number"
          prefix="RM"
          requiredMessage="Processing Fees is required"
          readOnly
          rightElement={<span className="text-xs text-gray-500">Auto</span>}
        />

        {/* Auto-calc syncer (invisible) */}
        <BuildingsFeesAutoCalc />














        <FormActions>
          <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>Cancel</Button>
          <Button type="button" variant="secondary" loading={savingDraft} onClick={() => {
            const form = document.querySelector('form');
            if (!form) return;
            const formData = new FormData(form as HTMLFormElement);
            const data: any = {};
            formData.forEach((v, k) => { data[k] = v; });
            handleSaveDraft(data);
          }}>Save draft</Button>
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

