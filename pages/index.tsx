import FormWrapper from "todo/components/forms/FormWrapper";
import SidebarContent from "@/components/main/Sidebar";
import Button from 'todo/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormActions from "todo/components/forms/FormActions";
import InputWithPrefix from "todo/components/forms/InputText";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import { useState } from "react";
import toast from 'react-hot-toast';
import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import Heading from "todo/components/forms/Heading";
import { Row } from "jspdf-autotable";
import FormRow from "todo/components/forms/FormRow";
import ImageDisplay from "todo/components/forms/ImageDisplay";
import Hyperlink from "todo/components/forms/Hyperlink";
import HyperText from "todo/components/forms/HyperText";
import InputText from "todo/components/forms/InputText";
import router from "next/router";
import { loginUser } from "todo/services/api";
import { AxiosError } from 'axios'

export default function FormPage() {

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (data: any) => {
        try {
            setLoading(true)
            // assume loginUser returns the full AxiosResponse<{ accessToken: string; user: User }>
            await loginUser(data)
            toast.success('Logged in!')
            router.push('/form')
        } catch (err) {
            const error = err as AxiosError<{ message: string; error: string }>
            if (error.response?.status === 401) {
                const msg =
                    (error.response.data?.message as any)?.message ||
                    'Invalid credentials'
                toast.error(msg)
            } else {
                toast.error('Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <LayoutWithoutSidebar shiftY="-translate-y-0">
            <FormWrapper onSubmit={handleSubmit}>
                <ImageDisplay
                    src="/images/logo.jpg"
                    alt="Centered Image"
                    align="center"
                    width={90}
                    height={90}
                    rounded={false}
                    shadow={false}
                    bordered={false}
                />
                <Spacing size="lg" />
                <Heading level={2} align="center" bold>
                    Sign in to your account
                </Heading>
                <Spacing size="lg" />
                <InputWithPrefix id="email" name="email" label="Email Address" requiredMessage="Email Address is required" />
                <Spacing size="sm" />
                <InputText
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    requiredMessage="Password is required"
                />
                <Hyperlink href="/forgot-password" position="right" bold fontSize="text-sm" underline={false} color="text-blue-600">
                    Forgot Password?
                </Hyperlink>

                <Spacing size="md" />

                <HyperText size="sm" align="center" color="text-gray-600">
                    Not a member?{" "}
                    <Hyperlink href="/signup" inline bold>
                        Sign up now!
                    </Hyperlink>
                </HyperText>

                <FormActions>
                    <Button type="submit" variant="primary" fullWidth size="md">
                        Sign in
                    </Button>
                </FormActions>


            </FormWrapper>

        </LayoutWithoutSidebar>
    );
}

