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
import { emailNotificationOptions } from "todo/components/data/CheckList";
import CodeExample from "todo/components/common/CodeExample";
export default function FormPage() {
    const onSubmit = (data: any) => {
        console.log("✅ Submitted data:", data);
    };

    return (
        <SidebarContent navigation={navigation} teams={teams} logoUrl={logoUrl}>
            <FormWrapper onSubmit={onSubmit}>

                {/* === FormSectionHeader === */}
                <FormSectionHeader
                    title="Profile"
                    description="This information will be displayed publicly so be careful what you share."
                />
                <CodeExample code={`<FormSectionHeader title="Profile" description="This information will be displayed publicly so be careful what you share." />`} />

                <Spacing size="lg" />
                <InputWithPrefix
                    id="username"
                    name="username"
                    label="Username"
                    placeholder="janesmith"
                    prefix="workcation.com/"
                    requiredMessage="Username is required"
                />
                <CodeExample code={`<InputWithPrefix id="username" name="username" label="Username" prefix="workcation.com/" requiredMessage="Username is required" />`} />

                <Spacing size="lg" />
                <TextArea
                    id="about"
                    name="about"
                    label="About"
                    placeholder="Tell us something about yourself"
                    requiredMessage="Please tell us something about yourself"
                />
                <CodeExample code={`<TextArea id="about" name="about" label="About" requiredMessage="Please tell us something about yourself" />`} />

                <Spacing size="lg" />
                <PhotoUploadField
                    label="Profile Picture"
                    buttonText="Upload Photo"
                    onClick={() => console.log("Upload photo clicked")}
                />
                <CodeExample code={`<PhotoUploadField label="Profile Picture" buttonText="Upload Photo" onClick={() => {}} />`} />

                <Spacing size="lg" />
                <FileUploadField
                    id="cover"
                    name="cover"
                    label="Upload a file"
                    description="PNG, JPG, GIF up to 10MB"
                    accept="image/*"
                    requiredMessage="Please upload a cover photo"
                />
                <CodeExample code={`<FileUploadField id="cover" name="cover" label="Upload a file" description="PNG, JPG, GIF up to 10MB" accept="image/*" requiredMessage="Please upload a cover photo" />`} />

                <Spacing size="lg" />
                <LineSeparator />
                <CodeExample code={`<LineSeparator />`} />

                <FormSectionHeader
                    title="Personal Information"
                    description="Use a permanent address where you can receive mail."
                />
                <CodeExample code={`<FormSectionHeader title="Personal Information" description="Use a permanent address where you can receive mail." />`} />

                <Spacing size="lg" />
                <FormRow columns={2}>
                    <InputWithPrefix
                        id="firstname"
                        name="firstname"
                        label="First Name"
                        requiredMessage="First name is required"
                    />
                    <InputWithPrefix
                        id="lastname"
                        name="lastname"
                        label="Last name"
                        requiredMessage="Last name is required"
                    />
                </FormRow>
                <CodeExample code={`<FormRow columns={2}>
  <InputWithPrefix id="firstname" name="firstname" label="First Name" requiredMessage="First name is required" />
  <InputWithPrefix id="lastname" name="lastname" label="Last name" requiredMessage="Last name is required" />
</FormRow>`} />

                <Spacing size="lg" />
                <InputWithPrefix
                    id="emailaddress"
                    name="emailaddress"
                    label="Email Address"
                    requiredMessage="Email is required"
                />
                <CodeExample code={`<InputWithPrefix id="emailaddress" name="emailaddress" label="Email Address" requiredMessage="Email is required" />`} />

                <Spacing size="lg" />
                <FormRow columns={2}>
                    <SelectField
                        id="country"
                        name="country"
                        label="Country"
                        options={countryOptions}
                        placeholder="Please select..."
                        requiredMessage="Country is required"
                    />
                </FormRow>
                <CodeExample code={`<SelectField id="country" name="country" label="Country" options={countryOptions} requiredMessage="Country is required" />`} />

                <Spacing size="lg" />
                <InputWithPrefix
                    id="address"
                    name="address"
                    label="Street Address"
                    requiredMessage="Street Address is required"
                />
                <CodeExample code={`<InputWithPrefix id="address" name="address" label="Street Address" requiredMessage="Street Address is required" />`} />

                <Spacing size="lg" />
                <FormRow columns={3}>
                    <InputWithPrefix
                        id="city"
                        name="city"
                        label="City"
                        requiredMessage="City is required"
                    />
                    <InputWithPrefix
                        id="state"
                        name="state"
                        label="State / Province"
                    />
                    <InputWithPrefix
                        id="postalcode"
                        name="postalcode"
                        label="ZIP / Postal code"
                        requiredMessage="ZIP / Postal code is required"
                    />
                </FormRow>
                <CodeExample code={`<FormRow columns={3}>
  <InputWithPrefix id="city" name="city" label="City" requiredMessage="City is required" />
  <InputWithPrefix id="state" name="state" label="State / Province" />
  <InputWithPrefix id="postalcode" name="postalcode" label="ZIP / Postal code" requiredMessage="ZIP / Postal code is required" />
</FormRow>`} />

                <LineSeparator />
                <CodeExample code={` <LineSeparator />`} />

                <FormSectionHeader
                    title="Notifications"
                    description="Choose what you want to be notified about."
                />
                <CodeExample code={`<FormSectionHeader title="Notifications" description="Choose what you want to be notified about." />`} />

                <CheckboxGroupField
                    name="notifications"
                    legend="By email"
                    options={emailNotificationOptions}
                />
                <CodeExample code={`<CheckboxGroupField name="notifications" legend="By email" options={emailNotificationOptions} />`} />

                <Spacing size="lg" />
                <LineSeparator />
                <CodeExample code={`<LineSeparator />`} />

                <FormActions>
                    <Button type="button" variant="ghost">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        Save
                    </Button>
                </FormActions>
                <CodeExample code={`<FormActions>
  <Button type="button" variant="ghost">Cancel</Button>
  <Button type="submit" variant="primary">Save</Button>
</FormActions>`} />

            </FormWrapper>
        </SidebarContent>
    );
}

