// ==========================
// 📆 FormPage.tsx (Cleaned & Structured)
// ==========================

import { useState } from "react";
import router from "next/router";
import toast from "react-hot-toast";

import SidebarContent from "@/components/main/Sidebar";
import { superAdminNavigation,
  accountNavigation,
  adminNavigation,
  userNavigation,
  developerNavigation, teams, logoUrl } from "@/components/main/SidebarConfig";

import FormWrapper from "todo/components/forms/FormWrapper";
import FormSectionHeader from "todo/components/forms/FormSectionHeader";
import Heading from "todo/components/forms/Heading";
import FormRow from "todo/components/forms/FormRow";
import InputText from "todo/components/forms/InputText";
import TextArea from "todo/components/forms/Textarea";
import PhotoUploadField from "todo/components/forms/PhotoUploadField";
import FileUploadField from "todo/components/forms/FileUpload";
import SelectField from "todo/components/forms/SelectField";
import CheckboxGroupField from "todo/components/forms/CheckboxGroupField";
import RadioGroupField from "todo/components/forms/RadioGroupField";
import DatePickerField from "todo/components/forms/DatePickerField";
import FormActions from "todo/components/forms/FormActions";
import Button from "todo/components/forms/Button";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import CodeExample from "todo/components/common/CodeExample";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";

import { countryOptions } from "todo/components/data/SelectionList";
import { emailNotificationOptions } from "todo/components/data/CheckList";
import { radioButtonList } from "todo/components/data/RadioList";
import ImageDisplay from "todo/components/forms/ImageDisplay";
import Hyperlink from "todo/components/forms/Hyperlink";
import TextLine from "todo/components/forms/HyperText";
import Tab from "todo/components/forms/Tab";
import Toggle from "todo/components/forms/Toggle";

export default function FormPage() {
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (data: any) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Form submitted successfully!");
            console.log("Submitted data:", data);
        }, 2000);
    };

    return (
        <SidebarContent teams={teams} logoUrl={logoUrl} userRole="superadmin">
            <FormWrapper onSubmit={handleSubmit}>
                <FormSectionHeader
                    title="Headings"
                    description="Use different heading levels to create a hierarchy of information."
                />
                {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level}>
                        <Spacing size="lg" />
                        <Heading level={level as 1 | 2 | 3 | 4 | 5} align="left" bold>
                            {`H${level} Heading`}
                        </Heading>
                        <CodeExample code={`<Heading level={${level}} align="left" bold>H${level} Heading</Heading>`} />
                    </div>
                ))}
                <LineSeparator />

                <Spacing size="lg" />
                <ImageDisplay
                    src="/images/logo.png"
                    alt="Logo Left"
                    align="left"
                />
                <CodeExample
                    code={`<ImageDisplay src="/images/logo.png" alt="Logo Left" align="left" />`}
                />

                <ImageDisplay
                    src="/images/logo.png"
                    alt="Centered Image"
                    align="center"
                    width={90}
                    height={90}
                />
                <CodeExample
                    code={`<ImageDisplay src="/images/logo.png" alt="Centered Image" align="center" width={600} height={300} />`}
                />

                <ImageDisplay
                    src="/images/logo.png"
                    alt="Aligned Right"
                    align="right"
                    bordered
                    shadow={false}
                />
                <CodeExample
                    code={`<ImageDisplay src="/images/logo.png" alt="Aligned Right" align="right" bordered shadow={false} />`}
                />

                <ImageDisplay
                    src="/images/logo.png"
                    alt="Centered Image"
                    align="center"
                    width={90}
                    height={90}
                    rounded={false}
                    shadow={false}
                    bordered={false}
                />
                <CodeExample
                    code={`<ImageDisplay src="/images/logo.png" alt="Centered Image" align="center" width={90} height={90} rounded={false} shadow={false} bordered={false} />`}
                />
                <LineSeparator />

                <Spacing size="lg" />
                <FormSectionHeader
                    title="Button Styles"
                    description="Use different button styles"
                />

                <Button type="submit" variant="primary" fullWidth size="md">
                    Sign in
                </Button>
                <CodeExample code={`<Button type="submit" variant="primary" fullWidth size="md">Sign in</Button>`} />

                <Spacing size="lg" />
                <Button type="button" variant="secondary" fullWidth size="md">
                    Sign in
                </Button>
                <CodeExample code={`<Button type="button" variant="secondary" fullWidth size="md">Sign in</Button>`} />

                <Spacing size="lg" />
                <Button type="button" variant="danger" fullWidth size="md">
                    Sign in
                </Button>
                <CodeExample code={`<Button type="button" variant="danger" fullWidth size="md">Sign in</Button>`} />

                <Spacing size="lg" />
                <FormSectionHeader
                    title="Button Styles"
                    description="Use different button size"
                />
                <Spacing size="lg" />
                <Button type="button" variant="primary" fullWidth size="sm">
                    Sign in
                </Button>
                <CodeExample code={`<Button type="button" variant="primary" fullWidth size="sm">Sign in</Button>`} />

                <Spacing size="lg" />
                <Button type="button" variant="primary" fullWidth size="md">
                    Sign in
                </Button>
                <CodeExample code={`<Button type="button" variant="primary" fullWidth size="md">Sign in</Button>`} />

                <Spacing size="lg" />
                <Button type="button" variant="primary" fullWidth size="lg">
                    Sign in
                </Button>

                <CodeExample code={`<Button type="button" variant="primary" fullWidth size="lg">Sign in</Button>`} />

                <Spacing size="lg" />
                <LineSeparator />

                <FormSectionHeader
                    title="Personal Information"
                    description="Use a permanent address where you can receive mail."
                />
                <CodeExample code={`<FormSectionHeader title="Personal Information" description="Use a permanent address where you can receive mail." />`} />

                <Spacing size="lg" />
                <InputText
                    id="username"
                    name="username"
                    label="Username (With Prefix)"
                    placeholder="janesmith"
                    prefix="workcation.com/"
                    requiredMessage="Username is required"
                />
                <CodeExample code={`<InputText id="username" name="username" label="Username" prefix="workcation.com/" requiredMessage="Username is required" />`} />


                <Spacing size="lg" />
                <InputText
                    id="usernameAlt"
                    name="usernameAlt"
                    label="Username (Without Prefix)"
                    placeholder="Username"
                    requiredMessage="Username is required"
                />
                <CodeExample code={`<InputText id="username" name="username" label="Username" prefix="workcation.com/" requiredMessage="Username is required" />`} />

                <Spacing size="lg" />
                <InputText
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    type="password"
                    requiredMessage="Password is required"
                />
                <CodeExample code={`<InputText id="password" name="password" label="Password" placeholder="••••••••" type="password" requiredMessage="Password is required" />`} />

                <Spacing size="lg" />
                <InputText
                    id="age"
                    name="age"
                    label="Age"
                    type="number"
                    requiredMessage="Age is required"
                />
                <CodeExample code={`<InputText id="age" name="age" label="Age" type="number" requiredMessage="Age is required" />`} />

                <Spacing size="lg" />
                <FormRow columns={2}>
                    <InputText
                        id="firstname"
                        name="firstname"
                        label="First Name"
                        requiredMessage="First name is required"
                    />
                    <InputText
                        id="lastname"
                        name="lastname"
                        label="Last name"
                        requiredMessage="Last name is required"
                    />
                </FormRow>
                <CodeExample code={`<FormRow columns={2}>
                    <InputText id="firstname" name="firstname" label="First Name" requiredMessage="First name is required" />
                    <InputText id="lastname" name="lastname" label="Last name" requiredMessage="Last name is required" />
                </FormRow>`} />


                <Spacing size="lg" />
                <InputText
                    id="address"
                    name="address"
                    label="Street Address"
                    requiredMessage="Street Address is required"
                />
                <CodeExample code={`<InputText id="address" name="address" label="Street Address" requiredMessage="Street Address is required" />`} />

                <Spacing size="lg" />
                <FormRow columns={3}>
                    <InputText
                        id="city"
                        name="city"
                        label="City"
                        requiredMessage="City is required"
                    />
                    <InputText
                        id="state"
                        name="state"
                        label="State / Province"
                    />
                    <InputText
                        id="postalcode"
                        name="postalcode"
                        label="ZIP / Postal code"
                        requiredMessage="ZIP / Postal code is required"
                    />
                </FormRow>
                <CodeExample code={`<FormRow columns={3}>
                    <InputText id="city" name="city" label="City" requiredMessage="City is required" />
                    <InputText id="state" name="state" label="State / Province" />
                    <InputText id="postalcode" name="postalcode" label="ZIP / Postal code" requiredMessage="ZIP / Postal code is required" />
                </FormRow>`} />

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
                    name ="profilePicture"
                    label="Profile Picture"
                    buttonText="Upload Photo"
                    folder="profile_pictures"
                    requiredMessage="Profile picture is required"
                    onUpload={(path) => console.log("Uploaded profile picture:", path)}
                />
                <CodeExample code={`<PhotoUploadField label="Profile Picture" buttonText="Upload Photo" onClick={() => {}} />`} />

                <Spacing size="lg" />
                <FileUploadField
                    name="cover"
                    label="Upload a file"
                    description="PNG, JPG, GIF up to 10MB"
                    accept="image/*"
                    requiredMessage="Please upload a cover photo"
                />

                <CodeExample code={`<FileUploadField id="cover" name="cover" label="Upload a file" description="PNG, JPG, GIF up to 10MB" accept="image/*" requiredMessage="Please upload a cover photo" />`} />


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

                <LineSeparator />

                <CheckboxGroupField
                    name="notifications"
                    legend="By email"
                    options={emailNotificationOptions}
                />
                <CodeExample code={`<CheckboxGroupField name="notifications" legend="By email" options={emailNotificationOptions} />`} />

                <Spacing size="lg" />
                <LineSeparator />

                <RadioGroupField
                    name="gender"
                    label="Gender"
                    options={radioButtonList}
                    inline={true}
                    requiredMessage="Please select a gender"
                />
                <CodeExample code={`<RadioGroupField name="gender" label="Gender" options={radioButtonList} inline={true} requiredMessage="Please select a gender" />`} />


                <Spacing size="lg" />
                <DatePickerField
                    name="dob"
                    label="Date of Birth"
                    dateFormat="dd/MM/yyyy"
                    placeholder="DD/MM/YYYY"
                    requiredMessage="Please select your birthdate"
                />
                <CodeExample code={`<DatePickerField name="dob" label="Date of Birth" dateFormat="dd/MM/yyyy" placeholder="DD/MM/YYYY" requiredMessage="Please select your birthdate" />`} />

                <DatePickerField
                    name="appointmentTime"
                    label="Appointment"
                    showTimeSelect
                    dateFormat="Pp"
                    placeholder="Select date & time"
                />
                <CodeExample code={`<DatePickerField name="appointmentTime" label="Appointment" showTimeSelect dateFormat="Pp" placeholder="Select date & time" />`} />

                <DatePickerField
                    name="bookingDate"
                    label="Booking Date"
                    minDate={new Date()}
                    maxDate={new Date(2025, 11, 31)}
                    dateFormat="yyyy-MM-dd"
                    placeholder="Select booking date"
                />
                <CodeExample code={`<DatePickerField name="bookingDate" label="Booking Date" minDate={new Date()} maxDate={new Date(2025, 11, 31)} dateFormat="yyyy-MM-dd" placeholder="Select booking date" />`} />

                <LineSeparator />
                <Spacing size="lg" />
                <FormSectionHeader
                    title="Confirmation Dialog"
                    description="Use confirmation dialogs to prevent users from accidentally losing their changes."
                />
                <ConfirmDialog
                    open={showCancelDialog}
                    title="Discard changes?"
                    description="Your unsaved changes will be lost. Are you sure you want to leave this form?"
                    confirmText="Yes, discard"
                    cancelText="Stay"
                    onCancel={() => setShowCancelDialog(false)}
                    onConfirm={() => {
                        setShowCancelDialog(false);
                        router.push("/form");
                    }}
                />
                <CodeExample
                    code={`<ConfirmDialog open={showCancelDialog} title="Discard changes?" description="Your unsaved changes will be lost. Are you sure you want to leave this form?" confirmText="Yes, discard" cancelText="Stay" onCancel={() => setShowCancelDialog(false)} onConfirm={() => { setShowCancelDialog(false); router.push('/form'); }} />`}
                />

                <Spacing size="lg" />
                <FormSectionHeader
                    title="Toast Notifications"
                    description="Use toast notifications to inform users about the status of their actions."
                />
                <CodeExample
                    code={`toast.success('Form submitted successfully!');\ntoast.error('Something went wrong');\ntoast.loading('Submitting...');`}
                />

                <Spacing size="lg" />
                <FormSectionHeader
                    title="Hyperlinks"
                    description="Use hyperlinks to navigate to different pages or external sites."  
                />
                <Spacing size="lg" />
                <Hyperlink href="/about">About Us</Hyperlink>
                <CodeExample code={`<Hyperlink href="/about">About Us</Hyperlink>`} />

                <Spacing size="lg" />
                <Hyperlink href="https://google.com" external>
                    Visit Google
                </Hyperlink>
                <CodeExample code={`<Hyperlink href="https://google.com" external>Visit Google</Hyperlink>`} />

                <Spacing size="lg" />
                <Hyperlink href="/terms" bold underline={false} color="text-red-500">
                    Terms & Conditions
                </Hyperlink>
                <CodeExample code={`<Hyperlink href="/terms" bold underline={false} color="text-red-500">Terms & Conditions</Hyperlink>`} />

                       <TextLine size="sm" align="center" color="text-gray-600">
                                    By continuing, you agree to the{" "}
                                    <Hyperlink href="/terms" inline>
                                        Terms of Service
                                    </Hyperlink>{" "}
                                    and{" "}
                                    <Hyperlink href="/privacy" inline>
                                        Privacy Policy
                                    </Hyperlink>.
                                </TextLine>
                <CodeExample code={`<TextLine size="sm" align="center" color="text-gray-600"> By continuing, you agree to the{" "}
    <Hyperlink href="/terms" inline> Terms of Service </Hyperlink>{" "}  and{" "}    
    <Hyperlink href="/privacy" inline> Privacy Policy </Hyperlink>.
</TextLine>`} />

                <Spacing size="lg" />
                <FormSectionHeader
                    title="Tabs"
                    description="Use tabs to organize content into sections."   
                />

                <Tab
                    tabs={[
                        { name: "Tab 1", href: "#tab1", badge: "New", badgeColor: "green" },
                        { name: "Tab 2", href: "#tab2", badge: "3", badgeColor: "blue" },
                        { name: "Tab 3", href: "#tab3" },
                    ]}
                    currentTab="Tab 1"
                    onTabChange={(tab) => console.log("Selected tab:", tab.name)}
                />
                <CodeExample code={`<Tab tabs={[{ name: "Tab 1", href: "#tab1", badge: "New", badgeColor: "green" }, { name: "Tab 2", href: "#tab2", badge: "3", badgeColor: "blue"  }, { name: "Tab 3", href: "#tab3" }]} currentTab="Tab 1" onTabChange={(tab) => console.log("Selected tab:", tab.name)} />`} />
                <Spacing size="lg" />
                <Toggle
                    label="Enable Notifications"
                    description="Receive notifications about important updates."
                    checked={true}
                    onChange={(checked) => console.log("Toggle changed:", checked)}
                />
                <CodeExample code={`<Toggle label="Enable Notifications" description="Receive notifications about important updates." checked={true} onChange={(checked) => console.log("Toggle changed:", checked)} />`} />
                <Spacing size="lg" />

                <LineSeparator />
                <CodeExample code={`<LineSeparator />`} />



                <FormActions>
                    <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>Cancel</Button>
                    <Button type="submit" variant="primary" loading={loading}>Save</Button>
                </FormActions>

                <CodeExample code={
                    `<FormActions>
    <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>Cancel</Button>
    <Button type="submit" variant="primary" loading={loading}>Save</Button>
</FormActions>`
                } />

            </FormWrapper>
        </SidebarContent>
    );
}
