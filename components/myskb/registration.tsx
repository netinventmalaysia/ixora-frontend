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
import FileUploadField from "../forms/FileUpload";
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
                <FormSectionHeader title="Consultant Onboard" description="This registration enables businesses to be officially recognized as consultants authorized to manage temporary building permits through the MYSKB system. It enhances their capability to oversee and coordinate building-related submissions on behalf of project owners." />
                <Spacing size="lg" />
             
                                        <InputWithPrefix
                                            id="aim"
                                            name="aim"
                                            label="AIM registration number"
                                            placeholder="Enter your AIM registration number"
                                        />
                                        <Spacing size="sm" />
                                        <FileUploadField
                                            name="aimDocument"
                                            label="AIM Document (PDF)"
                                            description="PDF up to 10MB"
                                            accept="application/pdf"
                                            folder="myskb/aim"
                                            requiredMessage="Please upload your AIM document (PDF)"
                                        />
                   
         
                <FormActions>
                    <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>Cancel</Button>
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

