import FormWrapper from "@/components/FormWrapper";
import ProfileSection from "@/components/form-sections/ProfileSection";
import PersonalInfoSection from "@/components/form-sections/PersonalInfoSection";
import NotificationsSection from "@/components/form-sections/NotificationsSection";
import TextInput from "todo/components/forms/TextInput";
import SidebarContent from "@/components/main/Sidebar";
import { navigation, teams, logoUrl } from '@/components/main/SidebarConfig';

export default function FormPage() {
    const onSubmit = (data: any) => {
        console.log("✅ Submitted data:", data);
    };

    return (
        <SidebarContent navigation={navigation} teams={teams} logoUrl={logoUrl}>
            <FormWrapper onSubmit={onSubmit}>
                <ProfileSection />
                <PersonalInfoSection />
                <NotificationsSection />
                <TextInput
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    required={true}
                />
                <TextInput
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    required={true}
                />

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold text-gray-900">Cancel</button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </FormWrapper>
        </SidebarContent>


    );
}
