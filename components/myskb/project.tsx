import FormWrapper from "todo/components/forms/FormWrapper";
import Button from 'todo/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormActions from "todo/components/forms/FormActions";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import FormRow from "todo/components/forms/FormRow";
import { landStatusOptions, OwnershipCategory, typeGrantOptions } from "todo/components/data/SelectionList";
import SelectField from "todo/components/forms/SelectField";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useFormContext, useWatch, useFieldArray } from "react-hook-form";
// import RadioGroupField from "todo/components/forms/RadioGroupField";
// import { landOrBuildingOwnerList } from "todo/components/data/RadioList";
import toast from 'react-hot-toast';
import LayoutWithoutSidebar from "../main/LayoutWithoutSidebar";
import InputText from "todo/components/forms/InputText";
import GeoAddressMap from "todo/components/forms/GeoAddressMap";
import BuildingsTable from "todo/components/forms/BuildingsTable";
import FileUploadField from "../forms/FileUpload";
import { fetchMyBusinesses, saveProjectDraft, submitProject, listOwnerships, getProjectById } from '@/services/api';
type ProjectPageProps = { readOnly?: boolean; initialValues?: Record<string, any> };
export default function ProjectPage({ readOnly = false, initialValues }: ProjectPageProps) {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [businessOptions, setBusinessOptions] = useState<{ value: number; label: string }[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [ownerOptions, setOwnerOptions] = useState<{ value: number; label: string }[]>([]);
  const [ownershipIdToUserId, setOwnershipIdToUserId] = useState<Record<number, number | undefined>>({});
  const [formDefaults, setFormDefaults] = useState<Record<string, any> | undefined>(undefined);

  // --- Helpers -------------------------------------------------------------
  // Map selected owner inputs (which may be ownership ids or already user ids) to unique user ids
  const mapOwnershipsToUserIds = (owners: any[] | undefined | null): number[] => {
    if (!Array.isArray(owners) || owners.length === 0) return [];
    const ids = owners
      .map((o: any) => Number(o?.owner_id))
      .filter((n: number) => !Number.isNaN(n))
      // if the value matches an ownership id, map to its user_id; otherwise treat it as already a user_id
      .map((id: number) => (ownershipIdToUserId[id] !== undefined ? ownershipIdToUserId[id] : id))
      .filter((uid: any) => typeof uid === 'number' && !Number.isNaN(uid)) as number[];
    return Array.from(new Set(ids));
  };

  // Build request payload from form data in a single place
  const buildSubmitPayload = (data: any) => {
    const payload: any = { ...data };
    const ownerUserIds = mapOwnershipsToUserIds(payload.owners);
    if (ownerUserIds.length > 0) {
      payload.owners_user_ids = ownerUserIds;
    }
    // Normalize buildings numeric fields
    if (Array.isArray(payload.buildings)) {
      payload.buildings = payload.buildings.map((b: any) => ({
        ...b,
        openArea: Number(b?.openArea || 0),
        closeArea: Number(b?.closeArea || 0),
        processingFee: Number(b?.processingFee || 0),
      }));
    }
    payload.processingFees = Number(payload.processingFees || 0);
    // Avoid sending the raw "owners" selection (ownership ids) to backend; we send user ids instead
    delete payload.owners;
    return payload;
  };

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
      .catch(() => {/* ignore non-fatal */ });
  }, []);

  // Load approved ownerships when business changes
  useEffect(() => {
    if (!selectedBusinessId) { setOwnerOptions([]); return; }
    listOwnerships({ business_id: selectedBusinessId, status: 'Approved', limit: 100, offset: 0 })
      .then(({ data }) => {
        // Use user_id as the option value so the form directly captures the user id
        const opts = (data || [])
          .filter((o: any) => typeof o?.user_id === 'number')
          .map((o: any) => ({ value: Number(o.user_id), label: o.name || o.email || `User #${o.user_id}` }));
        const map: Record<number, number | undefined> = {};
        (data || []).forEach((o: any) => { if (o && typeof o.id === 'number') map[o.id] = (o.user_id != null ? Number(o.user_id) : undefined); });
        setOwnerOptions(opts);
        setOwnershipIdToUserId(map);
      })
      .catch(() => setOwnerOptions([]));
  }, [selectedBusinessId]);

  // If arriving with a draft_id in the URL, fetch the draft and prefill the form
  useEffect(() => {
    if (initialValues) {
      // If initial values provided (read-only route), use them directly.
      const defaults = { country: 'Malaysia', ...(initialValues as any) };
      if (!defaults.country) (defaults as any).country = 'Malaysia';
      setFormDefaults(defaults);
      console.log('Initial values provided:', defaults);
      const bid = Number((defaults as any).business_id ?? (defaults as any).businessId);
      if (!Number.isNaN(bid)) setSelectedBusinessId(bid);
      return;
    }
    const draftId = router.query?.draft_id as string | undefined;
  const businessId = router.query?.business_id as string | undefined;
    console.log('Draft ID from URL:', draftId);
    console.log('Business ID from URL:', businessId);
    if (!draftId) return;
    let mounted = true;
    (async () => {
      try {
  const draft = await getProjectById(draftId, { businessId: businessId ? Number(businessId) : undefined, status: 'draft' });
        const defaults = { ...((draft as any)?.data || {}) } as Record<string, any>;
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
        // Transform legacy single-owner fields into owners[] array
        if (!Array.isArray(defaults.owners)) {
          const singleOwnerId = (defaults as any).owner_id ?? (defaults as any).ownerId;
          const singleOwnerCategory = (defaults as any).ownerCategory ?? (defaults as any).ownershipCategory;
          if (singleOwnerId || singleOwnerCategory) {
            defaults.owners = [{ owner_id: singleOwnerId ?? '', category: singleOwnerCategory ?? '' }];
          }
          delete (defaults as any).owner_id;
          delete (defaults as any).ownerId;
          delete (defaults as any).ownerCategory;
          delete (defaults as any).ownershipCategory;
        }
        const draftBiz = Number((draft as any)?.business_id ?? (draft as any)?.businessId);
        if (!Number.isNaN(draftBiz)) defaults.business_id = draftBiz;
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
  // Attachments that depend on selected owners' category: if any owner is Building or Land Owner, attachments are optional
  function OwnerCategoryBasedAttachments({ readOnly }: { readOnly?: boolean }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { control } = useFormContext();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const owners = useWatch({ control, name: 'owners' }) as Array<any> | undefined;
    const hasBuildingOrLand = Array.isArray(owners)
      ? owners.some((o) => {
          const cat = String(o?.category || '').toLowerCase();
          return cat === 'building owner' || cat === 'land owner';
        })
      : false;
    const requireAttachments = !hasBuildingOrLand;
    if (!requireAttachments) return null;
    return (
      <>
        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <FileUploadField
            name="statutoryDeclarationFile"
            label="Statutory Declaration File"
            description="PDF up to 10MB"
            accept="application/pdf"
            requiredMessage={'Please upload a cover photo statutory declaration'}
          />
        </div>
        <Spacing size="sm" />
        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <FileUploadField
            name="landHeirDeclarationFile"
            label="Land Heir Declaration"
            description="PDF up to 10MB"
            accept="application/pdf"
            requiredMessage={'Please upload a cover photo land heir declaration'}
          />
        </div>
        <Spacing size="sm" />
        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <FileUploadField
            name="rentalAgreementFile"
            label="Rental Agreement"
            description="PDF up to 10MB"
            accept="application/pdf"
            requiredMessage={'Please upload a cover photo rental agreement'}
          />
        </div>
      </>
    );
  }

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

  // Repeatable owners array (each with owner_id + category)
  function OwnersFieldArray({ ownerOptions, selectedBusinessId, readOnly, presetOwnershipIds }: { ownerOptions: { value: number; label: string }[]; selectedBusinessId: number | null; readOnly?: boolean; presetOwnershipIds?: number[] }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { control, getValues, setValue } = useFormContext();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { fields, append, remove, replace } = useFieldArray({ name: 'owners', control });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const prevBizRef = useRef<number | null>(selectedBusinessId);

    // Initialize at least one row on first mount if none
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const current = getValues('owners') as any[] | undefined;
      if (readOnly && Array.isArray(presetOwnershipIds) && presetOwnershipIds.length > 0) {
        const rows = presetOwnershipIds.map((oid) => ({ owner_id: oid, category: '' }));
        replace(rows);
      } else if (!Array.isArray(current) || current.length === 0) {
        append({ owner_id: '', category: '' });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readOnly, JSON.stringify(presetOwnershipIds)]);

    // When business changes, clear owners (since available owners list depends on business)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (prevBizRef.current !== selectedBusinessId) {
        prevBizRef.current = selectedBusinessId;
        replace([]);
        append({ owner_id: '', category: '' });
      }
    }, [append, replace, selectedBusinessId]);

    return (
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
            <div className="sm:col-span-3">
              <SelectField
                id={`owners.${index}.owner_id`}
                name={`owners.${index}.owner_id`}
                label="Project Owner"
                options={ownerOptions}
                requiredMessage="Owner is required"
                placeholder={selectedBusinessId ? 'Select approved owner' : 'Select business first'}
              />
            </div>
            <div className="sm:col-span-2">
              <SelectField
                id={`owners.${index}.category`}
                name={`owners.${index}.category`}
                label="Ownership Category"
                options={OwnershipCategory as any}
                requiredMessage="Category is required"
              />
            </div>
            {!readOnly && (
              <div className="sm:col-span-1 flex">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}
        {!readOnly && (
          <div>
            <Button type="button" variant="secondary" onClick={() => append({ owner_id: '', category: '' })}>
              Add owner
            </Button>
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
      // Build clear and minimal API payload
      const payload = buildSubmitPayload(data);
      const res = await submitProject(payload, { draftId: (router.query?.draft_id as string) || undefined });
      toast.success('Project submitted');
      console.log('Submit result:', res);
      // Navigate to MySKB Application tab after successful submission
      router.push('/myskb/application');
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
      // Build clear and minimal API payload
      const payload = buildSubmitPayload(data);
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
        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <SelectField id="business_id" name="business_id" label="Business" options={businessOptions} requiredMessage="Business is required" onChange={(e) => { const v = Number(e.target.value); setSelectedBusinessId(v); if (typeof window !== 'undefined') { try { localStorage.setItem('myskb_last_business_id', String(v)); } catch { } } }} />
        </div>
        <Spacing size="lg" />
        
        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <OwnersFieldArray ownerOptions={ownerOptions} selectedBusinessId={selectedBusinessId} readOnly={readOnly} presetOwnershipIds={(() => {
            // Options now use user_id values; preset directly with owners_user_ids
            const uids = (formDefaults as any)?.owners_user_ids as number[] | undefined;
            if (!Array.isArray(uids) || uids.length === 0) return undefined;
            const clean = Array.from(new Set(uids.map(Number).filter((n) => !Number.isNaN(n))));
            return clean.length ? clean : undefined;
          })()} />
        </div>
        <Spacing size="lg" />
        <OwnerCategoryBasedAttachments readOnly={readOnly} />
        <LineSeparator />

        <FormSectionHeader title="Project Information" description="Please fill in the details of your project. This information will be used to register your project with MBMB." />
        <Spacing size="lg" />
        <InputText id="projectTitle" name="projectTitle" label="Project Title" requiredMessage="Project Title is required" readOnly={readOnly} />
        <Spacing size="lg" />

        <InputText id="address" name="address" label="Project Address" requiredMessage="Address is required" readOnly={readOnly} />

        <Spacing size="sm" />
        <FormRow columns={3}>
          <InputText id="city" name="city" label="City" requiredMessage="City is required" readOnly={readOnly} />
          <InputText id="state" name="state" label="State / Province" requiredMessage="State / Province is required" readOnly={readOnly} />
          <InputText id="postalcode" name="postalcode" label="ZIP / Postal code" requiredMessage="ZIP / Postal code is required" readOnly={readOnly} />
        </FormRow>
        <Spacing size="sm" />
        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <InputText id="country" name="country" label="Country" requiredMessage="Country is required" readOnly={readOnly} />
        </div>
        <Spacing size="md" />
        {/* Map: Geocode address -> Lat/Lng; draggable marker to fine-tune */}
        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <GeoAddressMap
            label="Project Location"
            addressFields={{ address: 'address', city: 'city', state: 'state', postalcode: 'postalcode', country: 'country' }}
            latField="latitude"
            lngField="longitude"
            readOnly={readOnly}
          />
        </div>
        <Spacing size="sm" />

        <LineSeparator />
        <FormSectionHeader title="Land Infromation" description="Provide additional details about your land." />
        <Spacing size="lg" />

        <InputText id="landAddress" name="landAddress" label="Subdistrict / Town / City Area" requiredMessage="Subdistrict / Town / City Area is required" readOnly={readOnly} />
        <Spacing size="sm" />

        <InputText id="lotNumber" name="lotNumber" label="Lot / Plot Number" requiredMessage="Lot / Plot Number" readOnly={readOnly} />
        <Spacing size="sm" />

        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <SelectField id="landStatus" name="landStatus" label="Land Status" options={landStatusOptions} requiredMessage="Land status is required" />
        </div>
        <Spacing size="sm" />

        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <SelectField id="typeGrant" name="typeGrant" label="Type of Grant" options={typeGrantOptions} requiredMessage="Type of Grant is required" />
        </div>
        <Spacing size="sm" />


        <InputText id="spesificCondition" name="spesificCondition" label="Specific Conditions" readOnly={readOnly} />
        <Spacing size="sm" />

        <InputText id="landArea" name="landArea" label="Land Area (m2)" type="number" requiredMessage="Land Area is required" readOnly={readOnly} />
        <Spacing size="sm" />

        <InputText id="existingCrops" name="existingCrops" label="Existing Crops" readOnly={readOnly} />
        <Spacing size="sm" />

        <InputText id="existingBuilding" name="existingBuilding" label="Existing Building" type="number" readOnly={readOnly} />
        <Spacing size="sm" />

        <InputText id="residentialBuilding" name="residentialBuilding" label="Number of permanent residential building units
" type="number" readOnly={readOnly} />
        <Spacing size="sm" />

        <InputText id="semiResidentialBuilding" name="semiResidentialBuilding" label="Number of semi-permanent residential building units
" type="number" readOnly={readOnly} />
        <Spacing size="sm" />

        <InputText id="otherBuilding" name="otherBuilding" label="Other buildings" type="number" readOnly={readOnly} />
        <Spacing size="sm" />

        <LineSeparator />

        <FormSectionHeader title="Propose Usage Information" description="Add one or more buildings and their areas. Each building's processing fee is auto-calculated with a minimum of RM 140." />
        <Spacing size="lg" />

        <div className={readOnly ? 'pointer-events-none opacity-90' : ''}>
          <BuildingsTable />
        </div>

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

        {!readOnly && (
          <FormActions>
            <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>Cancel</Button>
            <DraftSaveButton onSave={handleSaveDraft} loading={savingDraft} />
            <Button type="submit" variant="primary" loading={loading}>Submit</Button>
          </FormActions>
        )}


      </FormWrapper>


      {!readOnly && (
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
      )}

    </LayoutWithoutSidebar>


  );
}

