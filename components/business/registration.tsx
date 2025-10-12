import { useState, useEffect, ChangeEvent } from "react";
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
import PhotoUploadField from "todo/components/forms/PhotoUploadField";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import { createBusiness, uploadCertificate } from "todo/services/api";
import toast from "react-hot-toast";
import router from "next/router";
import Toggle from "todo/components/forms/Toggle";
import SidebarContent from "todo/components/main/Sidebar";
import { logoUrl } from "todo/components/main/SidebarConfig";
import FileUploadField from "../forms/FileUpload";

export default function BusinessRegistrationPage() {
    const [accountType, setAccountType] = useState<"personal" | "business">("business");
    const [isOrganisation, setIsOrganisation] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [certificateFilePath, setCertificateFilePath] = useState<string>("");

    useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "");
    setEmail(localStorage.getItem("email") || "");
    }, []);

    const handleSubmit = async (data: any) => {
        try {
            setLoading(true);
            //await getCsrfToken();

            const payload = {
                ...data,
                expiryDate: data.expiryDate.toISOString().split('T')[0],
                certificateFilePath,
                accountType: accountType === "business"
                    ? (isOrganisation ? "organisation" : "business")
                    : undefined,
            };

            await createBusiness(payload);
            toast.success("Business registered successfully!");
            router.push("/business/application");

        } catch (err: any) {
            console.error('❌ Business creation error:', err);

            if (err.response?.status === 403) {
                toast.error("Forbidden: Invalid CSRF token");
            } else if (err.response?.status === 401) {
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
                    Business Registration
                </Heading>
                <Spacing size="lg" />

                <FormSectionHeader
                    title="Business Details"
                    description="Please provide the required information to register your business account."
                />
                <Spacing size="lg" />

                <Toggle
                    label=""
                    description={isOrganisation ? "Organisation" : "Company"}
                    checked={isOrganisation}
                    onChange={setIsOrganisation}
                />

                <Spacing size="sm" />
                <InputText
                    id="companyName"
                    name="companyName"
                    label={isOrganisation ? "Organisation Name" : "Company Name"}
                    requiredMessage="Company Name is required"
                />

                <Spacing size="sm" />
                <InputText
                    id="registrationNumber"
                    name="registrationNumber"
                    label={isOrganisation ? "ROS Number" : "SSM Number"}
                    requiredMessage={`${isOrganisation ? "ROS" : "SSM"} Number is required`}
                />

                <Spacing size="sm" />
                <DatePickerField
                    name="expiryDate"
                    label={isOrganisation ? "ROS Expiry Date" : "SSM Expiry Date"}
                    dateFormat="dd/MM/yyyy"
                    placeholder="DD/MM/YYYY"
                    requiredMessage="Please select your expiry certificate date"
                    minDate={new Date()}
                />

                <Spacing size="sm" />
                {/* <PhotoUploadField
                    label="Upload Certificate"
                    buttonText="Upload File"
                    onUpload={(fileUrl: string) => setCertificateFilePath(fileUrl)} // ✅ Pass this on upload success
                /> */}

                <FileUploadField
                    name="certificate"
                    label="Upload Certificate"
                    accept="image/*,application/pdf"
                    buttonText="Select File"
                    description="PNG, JPG, PDF up to 10MB"
                    requiredMessage="Please upload your certificate"
                    onUploadSuccess={(fileUrl: string) => setCertificateFilePath(fileUrl)}
                />
                <Spacing size="lg" />

                <LineSeparator />

                <FormSectionHeader title="Contact Information" description="Provide your contact and address details." />
                <Spacing size="sm" />

                <InputText id="phone" name="phone" label="Company Phone Number" prefix="+60" requiredMessage="Phone number is required" />
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
