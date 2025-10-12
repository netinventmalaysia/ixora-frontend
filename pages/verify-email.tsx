import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import LayoutWithoutSidebar from '@/components/main/LayoutWithoutSidebar';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import Button from '@/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import HyperText from '@/components/forms/HyperText';
import FormWrapper from '@/components/forms/FormWrapper';
import Card from '@/components/forms/Card';
import Alert from '@/components/forms/Alert';
import Spinner from '@/components/forms/Spinner';
import Stack from '@/components/forms/Stack';
import Inline from '@/components/forms/Inline';
import toast from 'react-hot-toast';
import { confirmEmailVerification } from '@/services/api';
import getErrorMessage from '@/utils/getErrorMessage';
import t from '@/utils/i18n';

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

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      <Heading level={4} align="left" bold>
        {t('verifyEmail.title')}
      </Heading>
      <Spacing size="md" />

      {loading ? (
        <Spinner label={t('verifyEmail.validating')} />
      ) : !token ? (
        <Alert>{t('verifyEmail.missingToken')}</Alert>
      ) : (
        <Stack>
          <Card>
            <FormSectionHeader
              title={t('verifyEmail.verifyYourEmail')}
              description={t('verifyEmail.verifyDesc', 'Verify your email to complete account setup.')}
            />
          </Card>

          <LineSeparator />

          <FormWrapper onSubmit={() => handleConfirm()}>
            <Inline>
              <Button type="submit" disabled={confirming}>{confirming ? t('verifyEmail.verifying') : t('verifyEmail.submit')}</Button>
              <Button type="button" variant="secondary" onClick={() => router.push('/login')}>{t('common.cancel')}</Button>
            </Inline>
          </FormWrapper>
        </Stack>
      )}
    </LayoutWithoutSidebar>
  );
}
