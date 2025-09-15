import FormWrapper from "todo/components/forms/FormWrapper";
import Button from 'todo/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormActions from "todo/components/forms/FormActions";
import InputWithPrefix from "todo/components/forms/InputText";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import FormRow from "todo/components/forms/FormRow";
import { buildingUseOptions, countryOptions, landStatusOptions, OwnershipCategory, ProjectOwner, typeGrantOptions } from "todo/components/data/SelectionList";
import SelectField from "todo/components/forms/SelectField";
import CheckboxGroupField from "todo/components/forms/CheckboxGroupField";
import { emailNotificationOptions2 } from "todo/components/data/CheckList";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import router from "next/router";
import { useEffect, useState } from "react";
import RadioGroupField from "todo/components/forms/RadioGroupField";
import { landOrBuildingOwnerList } from "todo/components/data/RadioList";
import toast from 'react-hot-toast';
import DatePickerField from "todo/components/forms/DatePickerField";
import LayoutWithoutSidebar from "../main/LayoutWithoutSidebar";
import InputText from "todo/components/forms/InputText";
import { Label } from "@headlessui/react";
import Heading from "../forms/Heading";
import FileUploadField from "../forms/FileUpload";
import { fetchMyBusinesses, saveProjectDraft, submitProject } from '@/services/api';
export default function ProjectPage() {

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [businessOptions, setBusinessOptions] = useState<{ value: number; label: string }[]>([]);

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
      <FormWrapper onSubmit={handleSubmit}>
        {/* This section introduce about the project spesification for the consultant to register a new project and tie with all active ownership, after the registration is successful it will send to mbmb for review, once the review is completed and the consultant have to pay the amount of the project */}
  <FormSectionHeader title="Ownership Information" description="Please fill in the details of your project. This information will be used to register your project with MBMB." />
  <Spacing size="lg" />
  <SelectField id="business_id" name="business_id" label="Business" options={businessOptions} requiredMessage="Business is required" />
  <Spacing size="lg" />
        <SelectField id="owner" name="owner" label="Project Owner" options={ProjectOwner} requiredMessage="Country is required" />
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

        <FormSectionHeader title="Propose Usage Information" description="Please fill in the details of your project. This information will be used to register your project with MBMB." />
        <Spacing size="lg" />
        <SelectField id="buildingUse" name="buildingUse" label="Building will be used as" options={buildingUseOptions} requiredMessage="Building will be used as is required" />
        <Spacing size="lg" />

        <LineSeparator />

        <FormSectionHeader title="Processing Fees" description="Please fill in the details of your project. Minumum processing charges is RM 140.00" />
        <Spacing size="lg" />

        <InputText id="openArea" name="openArea" label="Open Area (m2) x RM 0.75" type="number" requiredMessage="Open Area is required" />
        <Spacing size="sm" />

        <InputText id="closeArea" name="closeArea" label="Close Area (m2) x RM 1.50" type="number" requiredMessage="Close Area is required" />
        <Spacing size="sm" />


        <InputText
          id="processingFees"
          name="processingFees"
          label="Processing Fees"
          type="number"
          prefix="RM"
          requiredMessage="Processing Fees is required"
        />














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

