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
import RadioGroupField from "todo/components/forms/RadioGroupField";
import { identificationTypeList } from "todo/components/data/RadioList";
import { useFormContext, useWatch } from "react-hook-form";


type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  identificationType: string;
  identificationNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  role: "personal";
  profilePicture?: string;
  bio?: string;
  isActive?: boolean;
  isAccountVerified?: boolean;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  city?: string;
  state?: string;
  postalcode?: string;
  country?: string;
};


export default function SignUpPage() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      const payload: UserProfile = {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
        role: 'personal',
      };

      await createUser(payload);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWithoutSidebar>
      <FormWrapper onSubmit={handleSubmit}>
        <Heading level={2} align="left" bold>Sign Up</Heading>
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

        {/* radio button add new or old IC number / passport / my tentera */}
        <RadioGroupField
          name="identificationType"
          label="Identification Type"
          options={identificationTypeList}
          inline={true}
          requiredMessage="Please select a gender"
        />


        <Spacing size="sm" />
        <InputText
          id="identificationNumber"
          name="identificationNumber"
          label="Identification Number" // Generic, will be overridden dynamically
          requiredMessage="Identification number is required"
        />

        <LineSeparator />
        <FormSectionHeader title="User Information" description="Please provide your profile details." />
        <Spacing size="sm" />

        <PhotoUploadField
          name="profilePicture"
          label="Profile Picture"
          buttonText="Upload Photo"
          folder="profile_pictures"
          requiredMessage="Profile picture is required"
          onUpload={(path) => console.log("Uploaded profile picture:", path)}
        />
        <Spacing size="sm" />

        <FormRow columns={2}>
          <InputText id="firstName" name="firstName" label="First Name" requiredMessage="First name is required" />
          <InputText id="lastName" name="lastName" label="Last Name" requiredMessage="Last name is required" />
        </FormRow>
        <Spacing size="sm" />

        <DatePickerField
          name="dateOfBirth"
          label="Date of Birth"
          dateFormat="dd/MM/yyyy"
          placeholder="DD/MM/YYYY"
          requiredMessage="Please select your birthdate"
        />
        <Spacing size="sm" />

        <InputText id="phoneNumber" name="phoneNumber" label="Phone Number" prefix="+601" requiredMessage="Phone number is required" />
        <Spacing size="sm" />

        <InputText id="address" name="address" label="Premise / Lot / Street Address" requiredMessage="Address is required" />
        <Spacing size="sm" />

        <FormRow columns={3}>
          <InputText id="city" name="city" label="City" requiredMessage="City is required" />
          <InputText id="state" name="state" label="State / Province" requiredMessage="State is required" />
          <InputText id="postalcode" name="postalcode" label="ZIP / Postal code" requiredMessage="Postal code is required" />
        </FormRow>
        <Spacing size="sm" />

        <SelectField id="country" name="country" label="Country" options={countryOptions} requiredMessage="Country is required" />
        <Spacing size="sm" />

        <TextLine size="sm" align="center" color="text-gray-600">
          By continuing, you agree to the <Hyperlink href="/terms" inline>Terms of Service</Hyperlink> and <Hyperlink href="/privacy" inline>Privacy Policy</Hyperlink>.
        </TextLine>

        <FormActions>
          <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>Cancel</Button>
          <Button type="submit" variant="primary" loading={loading}>Sign Up</Button>
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

