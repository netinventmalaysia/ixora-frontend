import FormWrapper from "todo/components/forms/FormWrapper";
import SidebarContent from "@/components/main/Sidebar";
import Button from '@/components/common/Button';
import { navigation, teams, logoUrl } from '@/components/main/SidebarConfig';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormActions from "todo/components/common/FormActions";
import InputWithPrefix from "todo/components/forms/InputText";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import { useState } from "react";
import toast from 'react-hot-toast';
import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import Heading from "todo/components/forms/Heading";
export default function FormPage() {

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (data: any) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Login successfully!');
            console.log('Submitted data:', data);
        }, 2000);

        // toast.error('Something went wrong');
        // toast.loading('Submitting...');
    };

    return (
        <LayoutWithoutSidebar>
            <FormWrapper onSubmit={handleSubmit}>
                <Heading level={2} align="center" bold>
                    Sign in to your account
                </Heading>
                <Spacing size="lg" />
                <InputWithPrefix id="email" name="email" label="Email Address" requiredMessage="Email Address is required" />
                <Spacing size="lg" />
                <InputWithPrefix id="password" name="password" label="Password" requiredMessage="Password Address is required" />


                <FormActions>
                    <Button type="submit" variant="primary" fullWidth size="md">
                        Sign in
                    </Button>
                </FormActions>


            </FormWrapper>

        </LayoutWithoutSidebar>
    );
}

