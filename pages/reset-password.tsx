import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
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
import { useTranslation } from '@/utils/i18n';
import Image from 'next/image';
import LanguageSelector from '@/components/common/LanguageSelector';
import LogoSpinner from '@/components/common/LogoSpinner';

type ResetPasswordFormValues = {
    newPassword: string;
};

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token } = router.query;
    const { t } = useTranslation();

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
            toast.success(t('resetPassword.success'));
            router.push('/');
        } catch (error: any) {
            const apiMessage = error?.response?.data?.message;
            const message = Array.isArray(apiMessage)
                ? apiMessage.join(', ')
                : (typeof apiMessage === 'string' ? apiMessage : '');
            toast.error(message || t('resetPassword.failed'));
        }
    };

    return (
        <LayoutWithoutSidebar>
            {isSubmitting && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60" aria-hidden="true">
                    <LogoSpinner size={56} className="drop-shadow-md" title={t('common.loading')} />
                </div>
            )}
            {/* Fixed language selector (consistent with landing/login) */}
            <div className="fixed right-3 top-20 sm:top-24 z-50">
                <LanguageSelector className="!static" />
            </div>
            {/* Branding header (same style as login) */}
            <div className="relative mx-auto flex w-full max-w-md items-center justify-center px-6 pt-10 pb-4">
                <a href="/" className="group flex flex-col items-center focus:outline-none" aria-label="Go to homepage">
                    <div className="relative mb-3 h-20 w-20 transition-transform group-hover:scale-105">
                        <Image src="/images/logo.png" alt="IXORA Logo" fill sizes="80px" className="object-contain" priority />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#B01C2F] group-hover:text-[#8c1423]">IXORA</h1>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('landing.hero.subtitle')}</p>
                </a>
            </div>
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
