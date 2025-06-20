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

// Reusable generic toggle component
export interface ToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}


export default function FormPage() {
    const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
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
        <LayoutWithoutSidebar>
            <FormWrapper onSubmit={handleSubmit}>

                {/* Generic toggle usage for account type */}

                <Heading level={2} align="left" bold>
                    Sign Up
                </Heading>
                <Spacing size="sm" />
                {/* Business-specific fields */}
                {/* {accountType === 'business' && (
                    <Heading level={4} align="left" bold>
                        Business Account
                    </Heading>
                )}
                {accountType === 'personal' && (
                    <Heading level={4} align="left" bold>
                        Personal Account
                    </Heading>
                )} */}

                <LineSeparator />

                {/* <Spacing size="lg" />
                <Toggle
                    label="Account Type"
                    description={accountType === 'personal' ? 'Personal account' : 'Business account'}
                    checked={accountType === 'business'}
                    onChange={(checked) => setAccountType(checked ? 'business' : 'personal')}
                /> */}

                <Spacing size="lg" />

                <FormSectionHeader
                    title="Create your account"
                    description="Please fill in the details below to create your account."
                />
                <Spacing size="lg" />

                <InputText id="username" name="username" label="Username" requiredMessage="Username is required" />
                <Spacing size="sm" />
                <InputText id="email" name="email" type="email" label="Email Address" requiredMessage="Email Address is required" />
                <Spacing size="sm" />
                <InputText id="password" name="password" label="Password" type="password" requiredMessage="Password is required" showHint={true} />
                <Spacing size="lg" />


                <LineSeparator />

                <FormSectionHeader
                    title="User Information"
                    description="Please provide additional information to complete your profile."
                />
                <Spacing size="sm" />
                <PhotoUploadField label="Profile Picture" buttonText="Upload Photo" onClick={() => { }} />
                <Spacing size="sm" />
                <FormRow columns={2}>
                    <InputText id="firstName" name="firstName" label="First Name" requiredMessage="First name is required" />
                    <InputText id="lastName" name="lastName" label="Last Name" requiredMessage="Last name is required" />
                </FormRow>
                <Spacing size="sm" />
                <DatePickerField name="dateOfBirth" label="Date of Birth" dateFormat="dd/MM/yyyy" placeholder="DD/MM/YYYY" requiredMessage="Please select your birthdate" />

                <Spacing size="sm" />
                <InputText id="phone" name="phone" label="Phone Number" prefix="+601" requiredMessage="Phone number is required" />
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
                        <Spacing size="lg" />
                    </>
                )}


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
        </LayoutWithoutSidebar>
    );
}
