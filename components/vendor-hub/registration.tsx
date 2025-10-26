import { useState, useEffect } from "react";
import FormWrapper from "todo/components/forms/FormWrapper";
import Button from "todo/components/forms/Button";
import FormSectionHeader from "@/components/forms/FormSectionHeader";
import FormActions from "todo/components/forms/FormActions";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import Heading from "todo/components/forms/Heading";
import FormRow from "todo/components/forms/FormRow";
import Hyperlink from "todo/components/forms/Hyperlink";
import InputText from "todo/components/forms/InputText";
import { countryOptions } from "todo/components/data/SelectionList";
import SelectField from "todo/components/forms/SelectField";
import DatePickerField from "todo/components/forms/DatePickerField";
import TextLine from "todo/components/forms/HyperText";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import { createBusiness } from "todo/services/api";
import toast from "react-hot-toast";
import router from "next/router";
import Toggle from "todo/components/forms/Toggle";
import FileUploadField from "../forms/FileUpload";

export default function VendorRegistrationPage() {
  const [isOrganisation, setIsOrganisation] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // CIDB is optional; SSM is mandatory (always enabled)
  const [enableCIDB, setEnableCIDB] = useState<boolean>(false);

  // Upload URLs (from FileUploadField callbacks)
  const [ssmCertUrl, setSsmCertUrl] = useState<string>("");
  const [cidbCertUrl, setCidbCertUrl] = useState<string>("");

  useEffect(() => {
    // Prefill or side-effects if needed
  }, []);

  const safeDate = (d: any) => {
    try {
      if (!d) return undefined;
      const dt = (d instanceof Date) ? d : new Date(d);
      if (isNaN(dt.getTime())) return undefined;
      return dt.toISOString().split("T")[0];
    } catch {
      return undefined;
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      // ✅ SSM is mandatory for all vendors
      const ssmNumber = data?.ssmNumber?.trim();
      if (!ssmNumber) {
        toast.error("SSM Number is required.");
        setLoading(false);
        return;
      }
      if (!data?.ssmExpiry) {
        toast.error("SSM Expiry Date is required.");
        setLoading(false);
        return;
      }
      if (!ssmCertUrl) {
        toast.error("Please upload SSM Certificate.");
        setLoading(false);
        return;
      }

      // Build authorities
      const authorities: any[] = [
        {
          type: "SSM",
          number: ssmNumber,
          expiryDate: safeDate(data?.ssmExpiry),
          certificateFilePath: ssmCertUrl,
        },
      ];

      // ⚙️ CIDB optional — only validate and include if enabled
      if (enableCIDB) {
        const cidbNumber = data?.cidbNumber?.trim();
        if (!cidbNumber) {
          toast.error("CIDB License Number is required when CIDB is enabled.");
          setLoading(false);
          return;
        }
        if (!data?.cidbExpiry) {
          toast.error("CIDB Expiry Date is required when CIDB is enabled.");
          setLoading(false);
          return;
        }
        if (!cidbCertUrl) {
          toast.error("Please upload CIDB Certificate.");
          setLoading(false);
          return;
        }
        authorities.push({
          type: "CIDB",
          number: cidbNumber,
          grade: data?.cidbGrade || undefined,
          category: data?.cidbCategory || undefined,
          expiryDate: safeDate(data?.cidbExpiry),
          certificateFilePath: cidbCertUrl,
        });
      }

      // Top-level payload
      const payload = {
        accountType: isOrganisation ? "organisation" : "business",
        companyName: data?.companyName,
        phone: data?.phone,
        address: data?.address,
        city: data?.city,
        state: data?.state,
        postalcode: data?.postalcode,
        country: data?.country,
        authorities,
        data: { vendorHub: true, ixoraModule: "VendorHub" },
      };

      await createBusiness(payload);
      toast.success("Vendor registered successfully!");
      router.push("/vendor-hub/application");
    } catch (err: any) {
      console.error("❌ Vendor creation error:", err);
      const status = err?.response?.status;
      const resp = err?.response?.data || {};
      const msg = typeof resp?.message === "string" ? resp.message : (resp?.message?.message ?? "");
      const isDuplicate = status === 409 || /duplicate|already exists|existing/i.test(msg || "");
      if (isDuplicate) {
        toast.success("This vendor already exists. The owner has been notified to approve adding you as a team member.");
      } else if (status === 403) {
        toast.error("Forbidden: Invalid CSRF token");
      } else if (status === 401) {
        toast.error("Unauthorized: Please log in again");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      <FormWrapper onSubmit={handleSubmit}>
        <Heading level={2} align="left" bold>
          Vendor Hub Registration
        </Heading>

        <Spacing size="lg" />

        <FormSectionHeader
          title="Company Details"
          description="Provide your company/organisation details. The first registrant will be the account administrator."
        />

        <Spacing size="md" />
        <Toggle
          label="Organisation Mode"
          description={isOrganisation ? "Organisation" : "Company"}
          checked={isOrganisation}
          onChange={setIsOrganisation}
        />

        <Spacing size="sm" />
        <InputText
          id="companyName"
          name="companyName"
          label={isOrganisation ? "Organisation Name" : "Company Name"}
          requiredMessage="Company/Organisation Name is required"
        />

        <Spacing size="lg" />
        <LineSeparator />

        {/* Authorities selection */}
        <FormSectionHeader
          title="Registration Authorities"
          description="SSM is mandatory for all vendors. CIDB is required only if your business is involved in construction/infrastructure."
        />

        {/* SSM block — always required */}
        <Spacing size="lg" />
        <FormSectionHeader
          title="SSM Information (Required)"
          description="Fill in SSM details and upload the certificate."
        />
        <Spacing size="sm" />
        <InputText
          id="ssmNumber"
          name="ssmNumber"
          label="SSM Number"
          requiredMessage="SSM Number is required"
        />
        <Spacing size="sm" />
        <DatePickerField
          name="ssmExpiry"
          label="SSM Expiry Date"
          dateFormat="dd/MM/yyyy"
          placeholder="DD/MM/YYYY"
          requiredMessage="Please select SSM expiry date"
          minDate={new Date()}
        />
        <Spacing size="sm" />
        <FileUploadField
          name="ssmCertificate"
          label="Upload SSM Certificate"
          accept="image/*,application/pdf"
          buttonText="Select File"
          description="PNG, JPG, PDF up to 10MB"
          requiredMessage="Please upload your SSM certificate"
          onUploadSuccess={(url: string) => setSsmCertUrl(url)}
        />

        <Spacing size="lg" />
        <LineSeparator />

        {/* CIDB toggle + optional fields */}
        <FormSectionHeader
          title="CIDB (Optional)"
          description="Enable if your business performs construction works or requires CIDB licensing."
        />
        <Spacing size="sm" />
        <Toggle
          label="Include CIDB Registration"
          description="Enable if applicable"
          checked={enableCIDB}
          onChange={setEnableCIDB}
        />

        {enableCIDB && (
          <>
            <Spacing size="md" />
            <InputText
              id="cidbNumber"
              name="cidbNumber"
              label="CIDB License Number"
              requiredMessage="CIDB License Number is required"
            />
            <Spacing size="sm" />
            <FormRow columns={2}>
              <InputText id="cidbGrade" name="cidbGrade" label="CIDB Grade (e.g., G1–G7)" />
              <InputText id="cidbCategory" name="cidbCategory" label="CIDB Category (e.g., CE, ME, etc.)" />
            </FormRow>
            <Spacing size="sm" />
            <DatePickerField
              name="cidbExpiry"
              label="CIDB Expiry Date"
              dateFormat="dd/MM/yyyy"
              placeholder="DD/MM/YYYY"
              requiredMessage="Please select CIDB expiry date"
              minDate={new Date()}
            />
            <Spacing size="sm" />
            <FileUploadField
              name="cidbCertificate"
              label="Upload CIDB Certificate"
              accept="image/*,application/pdf"
              buttonText="Select File"
              description="PNG, JPG, PDF up to 10MB"
              requiredMessage="Please upload your CIDB certificate"
              onUploadSuccess={(url: string) => setCidbCertUrl(url)}
            />
          </>
        )}

        <Spacing size="lg" />
        <LineSeparator />

        {/* Contact block */}
        <FormSectionHeader
          title="Contact & Address"
          description="Provide your contact number and registered address."
        />
        <Spacing size="sm" />
        <InputText
          id="phone"
          name="phone"
          label="Company Phone Number"
          prefix="+60"
          requiredMessage="Phone number is required"
        />
        <Spacing size="sm" />
        <InputText id="address" name="address" label="Premise / Lot / Street Address" requiredMessage="Address is required" />
        <Spacing size="sm" />
        <FormRow columns={3}>
          <InputText id="city" name="city" label="City" requiredMessage="City is required" />
          <InputText id="state" name="state" label="State / Province" requiredMessage="State / Province is required" />
          <InputText id="postalcode" name="postalcode" label="ZIP / Postal code" requiredMessage="ZIP / Postal code is required" />
        </FormRow>
        <Spacing size="sm" />
        <SelectField id="country" name="country" label="Country" options={countryOptions} requiredMessage="Country is required" />

        <Spacing size="lg" />
        <TextLine size="sm" align="center" color="text-gray-600">
          By continuing, you agree to the <Hyperlink href="/terms" inline>Terms of Service</Hyperlink> and <Hyperlink href="/privacy" inline>Privacy Policy</Hyperlink>
        </TextLine>

        <FormActions>
          <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Register
          </Button>
        </FormActions>
      </FormWrapper>

      <ConfirmDialog
        open={showCancelDialog}
        title="Discard changes?"
        description="Your unsaved changes will be lost. Are you sure you want to leave this page?"
        confirmText="Yes, discard"
        cancelText="Stay"
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          router.push("/");
        }}
      />
    </LayoutWithoutSidebar>
  );
}