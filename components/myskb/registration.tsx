import FormWrapper from "todo/components/forms/FormWrapper";
import Button from 'todo/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormActions from "todo/components/forms/FormActions";
import InputWithPrefix from "todo/components/forms/InputText";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import FormRow from "todo/components/forms/FormRow";
import { countryOptions } from "todo/components/data/SelectionList";
import SelectField from "todo/components/forms/SelectField";
import CheckboxGroupField from "todo/components/forms/CheckboxGroupField";
import { emailNotificationOptions2 } from "todo/components/data/CheckList";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import router from "next/router";
import { useState } from "react";
import RadioGroupField from "todo/components/forms/RadioGroupField";
import { radioButtonList } from "todo/components/data/RadioList";
import toast from 'react-hot-toast';
import DatePickerField from "todo/components/forms/DatePickerField";
import LayoutWithoutSidebar from "../main/LayoutWithoutSidebar";
export default function LoginPage() {

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (data: any) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Form submitted successfully!');
            console.log('Submitted data:', data);
        }, 2000);
    };

    return (
      <LayoutWithoutSidebar shiftY="-translate-y-0">
            <FormWrapper onSubmit={handleSubmit}>
                <FormSectionHeader title="Profile" description="This information will be displayed publicly so be careful what you share." />
                <Spacing size="lg" />
                <InputWithPrefix id="phoneNum" name="phoneNum" label="No Tel" prefix="60" requiredMessage="Phone Number is required" />
                <LineSeparator />
                <FormRow columns={2}>
                    <InputWithPrefix id="firstname" name="firstname" label="First Name" requiredMessage="First name is required" />
                    <InputWithPrefix id="lastname" name="lastname" label="Last name" requiredMessage="Last name is required" />
                </FormRow>
                <Spacing size="lg" />
                <FormRow columns={1}>
                    <SelectField id="country" name="country" label="Country" options={countryOptions} requiredMessage="Country is required" />
                </FormRow>

                <Spacing size="lg" />
                <CheckboxGroupField name="notifications" legend="By email" options={emailNotificationOptions2} />

                <Spacing size="lg" />
                <RadioGroupField
                    name="gender"
                    label="Gender"
                    options={radioButtonList}
                    inline={true}
                    requiredMessage="Please select a gender"
                />

                <Spacing size="lg" />
                <DatePickerField
                    name="dob"
                    label="Date of Birth"
                    dateFormat="dd/MM/yyyy"
                    placeholder="DD/MM/YYYY"
                    requiredMessage="Please select your birthdate"
                />

                <Spacing size="lg" />
                <DatePickerField
                    name="appointmentTime"
                    label="Appointment"
                    showTimeSelect
                    dateFormat="Pp"
                    placeholder="Select date & time"
                />

                <Spacing size="lg" />
                <DatePickerField
                    name="bookingDate"
                    label="Booking Date"
                    minDate={new Date()} // today
                    maxDate={new Date(2025, 11, 31)} // Dec 31, 2025
                    dateFormat="yyyy-MM-dd"
                    placeholder="Select booking date"
                />
         
                <FormActions>
                    <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>Cancel</Button>
                    <Button type="submit" variant="primary" loading={loading}>Save</Button>
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

