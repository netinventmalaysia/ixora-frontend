import { useState } from "react";
import FormWrapper from "todo/components/forms/FormWrapper";
import Button from 'todo/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
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
import { createUser } from "todo/services/api";
import toast from 'react-hot-toast';
import router from "next/router";
// Headless UI imports for toggle component
import { Field, Label, Description, Switch } from '@headlessui/react';
import Toggle from "todo/components/forms/Toggle";
import SidebarContent from "todo/components/main/Sidebar";
import { teams, logoUrl } from "todo/components/main/SidebarConfig";
import FileUploadField from "todo/components/forms/FileUpload";
import { FormProvider, useForm } from "react-hook-form";

// Reusable generic toggle component
export interface ToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}


const Registration: React.FC = () => {
    const methods = useForm()
    const [accountType, setAccountType] = useState<'personal' | 'business'>('business');
    const [isOrganisation, setIsOrganisation] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        try {
            setLoading(true);
            const payload = {
                ...data,
                dateOfBirth: data.dateOfBirth.toISOString(),
                role: accountType,
                organisation: accountType === 'business' ? (isOrganisation ? 'organisation' : 'business') : undefined,
            };

            await createUser(payload);
            toast.success('Submitted successfully!');
            router.push('/form');
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <LayoutWithoutSidebar shiftY="-translate-y-0">
                <FormWrapper onSubmit={handleSubmit}>
                    <FormSectionHeader
                        title="Create your business account"
                        description="Please provide the required information to register your business account. The initial registrant will be designated as the account administrator. Once the business account has been verified, you can invite team members by email and assign roles accordingly."
                    />

                    <Spacing size="sm" />


                    {/* Business-specific fields */}
                    {accountType === 'business' && (
                        <>
                            <LineSeparator />
                            <FormSectionHeader
                                title="Business Information"
                                description="Please provide your business details."
                            />
                            <Spacing size="lg" />

                            {/* If business, ask if organisation */}
                            {accountType === 'business' && (
                                <>
                                    <Toggle
                                        label=""
                                        description={isOrganisation ? 'Organisation' : 'Company'}
                                        checked={isOrganisation}
                                        onChange={setIsOrganisation}
                                    />

                                    <Spacing size="sm" />
                                    <InputText id="companyName" name="companyName" label={isOrganisation ? 'Organisation Name' : 'Company Name'} requiredMessage="Company Name is required" />
                                </>
                            )
                            }


                            <Spacing size="sm" />
                            <InputText
                                id="registrationNumber"
                                name="registrationNumber"
                                label={isOrganisation ? 'ROS Number' : 'SSM Number'}
                                requiredMessage={`${isOrganisation ? 'ROS' : 'SSM'} Number is required`}
                            />

                            <Spacing size="sm" />
                            <DatePickerField name="expiryDate" label={isOrganisation ? 'ROS Expiry Date' : 'SSM Expiry Date'} dateFormat="dd/MM/yyyy" placeholder="DD/MM/YYYY" requiredMessage="Please select your expiry certificate date" minDate={new Date()} />
                            <Spacing size="sm" />

                            <FileUploadField
                                title={isOrganisation ? "Upload your ROS certificate" : "Upload your SSM certificate"}
                                id="cover"
                                name="cover"
                                label="Upload a file"
                                description="PDF up to 10MB"
                                accept="pdf/*"
                                requiredMessage={`Please upload your ${isOrganisation ? 'ROS' : 'SSM'} certificate`}
                            />

                            <Spacing size="lg" />


                        </>
                    )}
                    <LineSeparator />
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
                    <Spacing size="sm" />

                    <TextLine size="sm" align="center" color="text-gray-600">
                        By continuing, you agree to the{' '}
                        <Hyperlink href="/terms" inline>Terms of Service</Hyperlink>{' '}and{' '}
                        <Hyperlink href="/privacy" inline>Privacy Policy</Hyperlink>
                    </TextLine>

                    <FormActions>
                        <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={loading}>
                            Sign Up
                        </Button>
                    </FormActions>
                </FormWrapper>

            </LayoutWithoutSidebar>


            <ConfirmDialog
                open={showCancelDialog}
                title="Discard changes?"
                description="Your unsaved changes will be lost. Are you sure you want to leave this form?"
                confirmText="Yes, discard"
                cancelText="Stay"
                onCancel={() => setShowCancelDialog(false)}
                onConfirm={() => {
                    setShowCancelDialog(false);
                    router.push('/');
                }}
            />
        </FormProvider>
    );
}


export default Registration;

