import FormWrapper from "todo/components/forms/FormWrapper";
import SidebarContent from "@/components/main/Sidebar";
import Button from '@/components/common/Button';
import { navigation, teams, logoUrl } from '@/components/main/SidebarConfig';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormActions from "todo/components/common/FormActions";
import InputWithPrefix from "todo/components/forms/InputWithPrefix";
import TextArea from "todo/components/forms/Textarea";
import Spacing from "todo/components/forms/Spacing";
import PhotoUploadField from "todo/components/forms/PhotoUploadField";
import FileUploadField from "todo/components/forms/FileUpload";
import LineSeparator from "todo/components/forms/LineSeparator";
import FormRow from "todo/components/forms/FormRow";
import { countryOptions } from "todo/components/data/SelectionList";
import SelectField from "todo/components/forms/SelectField";
import CheckboxGroupField from "todo/components/forms/CheckboxGroupField";
import { emailNotificationOptions2 } from "todo/components/data/CheckList";
import CodeExample from "todo/components/common/CodeExample";
import TextInput from "todo/components/forms/TextInput";
export default function FormPage() {
    const onSubmit = (data: any) => {
        console.log("✅ Submitted data:", data);
    };

    return (
        <SidebarContent navigation={navigation} teams={teams} logoUrl={logoUrl}>
            <FormWrapper onSubmit={onSubmit}>
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

                <FormActions>
                    <Button type="button" variant="ghost">Cancel</Button>
                    <Button type="submit" variant="primary">Save</Button>
                </FormActions>
            </FormWrapper>


        </SidebarContent>
    );
}

