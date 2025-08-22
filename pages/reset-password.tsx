import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, useState } from 'react';
import LayoutWithoutSidebar from '@/components/main/LayoutWithoutSidebar';
import FormWrapper from '@/components/forms/FormWrapper';
import Heading from '@/components/forms/Heading';
import InputText from '@/components/forms/InputText';
import Button from '@/components/forms/Button';
import FormActions from '@/components/forms/FormActions';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import toast from 'react-hot-toast';
import { resetPassword } from '@/services/api';
import t from '@/utils/i18n';

type ResetPasswordFormValues = {
    newPassword: string;
};

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token } = router.query;

    const methods = useForm<ResetPasswordFormValues>();
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            if (!token || Array.isArray(token)) {
                throw new Error('Invalid or missing token');
            }

            await resetPassword({ token, newPassword: data.newPassword });
            toast.success('Password has been reset. You may now log in.');
            router.push('/');
        } catch (error: any) {

            const apiMessage = error?.response?.data?.message;
            console.log('API error message:', apiMessage);
            const message =
                Array.isArray(apiMessage)
                    ? apiMessage.join(', ')
                    : typeof apiMessage === 'string'
                        ? apiMessage
                        : error.message || 'Reset failed';

            toast.error(message + ', ' + apiMessage.message || 'Reset failed');
        }
    };

    return (
        <LayoutWithoutSidebar>
            <FormProvider {...methods}>
                <FormWrapper onSubmit={onSubmit}>
                    <Heading level={1} align="center" bold>
                        {t('resetPassword.title')}
                    </Heading>

                    <Spacing size="md" />
                    <LineSeparator />
                    <Spacing size="md" />

                    <InputText
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        type="password"
                        requiredMessage="New password is required"
                        showHint
                    />

                    <Spacing size="md" />

                    <FormActions>
                        <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                            {isSubmitting ? t('resetPassword.resetting') : t('resetPassword.submit')}
                        </Button>
                    </FormActions>
                </FormWrapper>
            </FormProvider>
        </LayoutWithoutSidebar>
    );
}
