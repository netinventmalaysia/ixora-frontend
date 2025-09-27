import { useState } from 'react';
import LayoutWithoutSidebar from '@/components/main/LayoutWithoutSidebar';
import FormWrapper from '@/components/forms/FormWrapper';
import Heading from '@/components/forms/Heading';
import InputText from '@/components/forms/InputText';
import Button from '@/components/forms/Button';
import FormActions from '@/components/forms/FormActions';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import toast from 'react-hot-toast';
import { forgotPassword } from '@/services/api';
import { useTranslation } from '@/utils/i18n';
import Image from 'next/image';
import LanguageSelector from '@/components/common/LanguageSelector';


type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (submitted || loading) return;
    try {
      setLoading(true);
      await forgotPassword(data);
      setSubmitted(true);
      toast.success(t('forgotPassword.toastSent'));
    } catch (error) {
      toast.error(t('forgotPassword.toastFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWithoutSidebar>
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

      <FormWrapper onSubmit={onSubmit}>
        <Heading level={1} align="center" bold>
          {t('forgotPassword.title')}
        </Heading>
        <Spacing size="md" />
        <LineSeparator />
        <Spacing size="md" />

        <InputText
          id="email"
          name="email"
          label={t('forgotPassword.emailLabel')}
          type="email"
          requiredMessage={t('forgotPassword.emailRequired')}
          placeholder={t('forgotPassword.emailPlaceholder')}
        />

        <Spacing size="md" />

        <FormActions>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={submitted || loading}
            loading={loading}
          >
            {submitted ? t('forgotPassword.sent') : t('forgotPassword.send')}
          </Button>
        </FormActions>

        {submitted && (
          <>
            <Spacing size="md" />
            <div className="text-green-700 font-medium text-center">
              {t('forgotPassword.checkEmail')}
            </div>
          </>
        )}
      </FormWrapper>
    </LayoutWithoutSidebar>
  );
}
