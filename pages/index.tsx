import FormWrapper from "todo/components/forms/FormWrapper";
import Button from 'todo/components/forms/Button';
import FormActions from "todo/components/forms/FormActions";
import InputWithPrefix from "todo/components/forms/InputText";
import Spacing from "todo/components/forms/Spacing";
import { useState } from "react";
import toast from 'react-hot-toast';
import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import Heading from "todo/components/forms/Heading";
import ImageDisplay from "todo/components/forms/ImageDisplay";
import Hyperlink from "todo/components/forms/Hyperlink";
import HyperText from "todo/components/forms/HyperText";
import InputText from "todo/components/forms/InputText";
import router from "next/router";
import { loginUser, guestLogin } from "todo/services/api";
import { AxiosError } from 'axios'
import { triggerUserRefresh } from "todo/components/actions/actionHandler";

export default function FormPage() {

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    


    const handleSubmit = async (data: any) => {

        try {
            setLoading(true)
            const res = await loginUser(data)
            localStorage.setItem('userRole', res.user.role);
            localStorage.setItem('userId', res.user.id);
            localStorage.setItem('username', res.user.username);
            localStorage.setItem('email', res.user.email);
            triggerUserRefresh();
            console.log('Login response:', res);
     

            if (!res || !res.user) {
                throw new Error('Login failed');
            }
            toast.success('Logged in!')
            router.push('/dashboard') 
        } catch (err) {
            const error = err as AxiosError<{ message: string; error: string }>
            if (error.response?.status === 401) {
                const msg =
                    (error.response.data?.message as any)?.message ||
                    'Invalid credentials'
                toast.error(msg)
            } else {
                console.error('Login error:', error);
                toast.error('Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGuestLogin = async () => {
        try {
            setLoading(true)
            const res = await guestLogin();
            console.log('Guest login response:', res);
            if (!res || !res.user) {
                throw new Error('Guest login failed');
            }
            localStorage.setItem('userRole', res.user.role);
            localStorage.setItem('userId', res.user.id);
            toast.success('Logged in as Guest')
            router.push('/dashboard');
        } catch (err) {
            toast.error('Failed to login as guest')
        } finally {
            setLoading(false)
        }
    }

    return (
        <LayoutWithoutSidebar shiftY="-translate-y-0">
            <FormWrapper onSubmit={handleSubmit}>
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
                <Spacing size="lg" />
                <Heading level={2} align="center" bold>
                    Sign in to your accounts
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

                <Spacing size="sm" />

                <FormActions>
                    <Button type="submit" variant="primary" fullWidth size="md">
                        Sign in
                    </Button>

                </FormActions>

                <FormActions>
                    <Button
                        type="button"
                        variant="secondary"
                        fullWidth
                        size="md"
                        onClick={handleGuestLogin}
                    >
                        Continue as Guest
                    </Button>
                </FormActions>

            </FormWrapper>

        </LayoutWithoutSidebar>
    );
}

