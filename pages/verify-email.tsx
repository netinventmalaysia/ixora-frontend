import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import LayoutWithoutSidebar from '@/components/main/LayoutWithoutSidebar';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import Button from '@/components/forms/Button';
import FormWrapper from '@/components/forms/FormWrapper';
import Alert from '@/components/forms/Alert';
import Spinner from '@/components/forms/Spinner';
import toast from 'react-hot-toast';
import { confirmEmailVerification } from '@/services/api';
import getErrorMessage from '@/utils/getErrorMessage';
import t from '@/utils/i18n';
import LanguageSelector from '@/components/common/LanguageSelector';

export default function VerifyEmailPage() {
  const router = useRouter();
  const token = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const url = new URL(window.location.href);
    return url.searchParams.get('token') || undefined;
  }, []);

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    // No pre-validation call; just finish loading so user can submit confirmation
    setLoading(false);
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    try {
      setConfirming(true);
      await confirmEmailVerification(token);
      toast.success('Email verified successfully');
  router.push('/login');
    } catch (e: any) {
      toast.error(getErrorMessage(e) || 'Failed to verify email');
    } finally {
      setConfirming(false);
    }
  };

  const PRIMARY = '#B01C2F';

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      {/* Language switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      {/* Brand header (match login) */}
      <div className="relative mx-auto flex w-full max-w-md items-center justify-center px-6 pt-10 pb-4">
        <a href="/login" className="group flex flex-col items-center focus:outline-none" aria-label="Go to homepage">
          <div className="mb-3 flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image src="/images/logo.png" alt="IXORA" fill sizes="48px" className="object-contain" priority />
            </div>
            <span className="h-6 w-px bg-gray-300" />
            <div className="relative h-10 w-10">
              <Image src="/images/logo-mbmb.png" alt="MBMB" fill sizes="40px" className="object-contain" priority />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#B01C2F]">IXORA</span>{' '}
            <span className="text-[#005C76]">MBMB</span>
          </h1>
          <p className="mt-1 text-xs text-gray-500">MAJLIS BANDARAYA MELAKA BERSEJARAHd</p>
        </a>
      </div>

      {/* Card wrapper (match login theme) */}
      <div className="mx-auto w-full max-w-md px-4">
        <div className="bg-white p-6">
          <Heading level={2} align="center" bold>
            {t('verifyEmail.title')}
          </Heading>
          <Spacing size="lg" />

          {loading ? (
            <div className="flex justify-center">
              <Spinner label={t('verifyEmail.validating')} />
            </div>
          ) : !token ? (
            <Alert>{t('verifyEmail.missingToken')}</Alert>
          ) : (
            <>
              <p className="text-center text-sm text-gray-700">
                {t('verifyEmail.verifyDesc', 'Verify your email to complete account setup.')}
              </p>
              <Spacing size="md" />
              <FormWrapper onSubmit={() => handleConfirm()}>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="md"
                  disabled={confirming}
                  className="!bg-[#B01C2F] hover:!bg-[#951325] focus-visible:!ring-2 focus-visible:!ring-[#B01C2F] focus-visible:!ring-offset-2"
                >
                  {confirming ? t('verifyEmail.verifying') : t('verifyEmail.submit')}
                </Button>
                <Spacing size="sm" />
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  size="md"
                  onClick={() => router.push('/login')}
                  disabled={confirming}
                  className="!border-[#B01C2F] !text-gray-800 hover:!bg-gray-50"
                >
                  {t('common.cancel')}
                </Button>
              </FormWrapper>
            </>
          )}
        </div>

        {/* small foot note for consistency spacing */}
        <p className="mt-4 text-center text-xs text-gray-500">
          {t('common.securedBy', 'Secured by MBMB Digital Services')}
        </p>
      </div>

      {/* subtle background bubble (like hero) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 -z-10 h-56 w-56 rounded-full opacity-10 blur-3xl"
        style={{ background: PRIMARY }}
      />
    </LayoutWithoutSidebar>
  );
}
