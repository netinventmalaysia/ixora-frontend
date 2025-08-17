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
import { validateEmailVerification, confirmEmailVerification } from '@/services/api';

type VerifyInfo = {
  email?: string;
  sentAt?: string;
  expiresAt?: string;
};

export default function VerifyEmailPage() {
  const router = useRouter();
  const token = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const url = new URL(window.location.href);
    return url.searchParams.get('token') || undefined;
  }, []);

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [info, setInfo] = useState<VerifyInfo | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!token) {
        setLoading(false);
        setValid(false);
        return;
      }
      try {
        const res = await validateEmailVerification(token);
        if (!mounted) return;
        const payload = res?.info ?? res;
        setInfo({
          email: payload?.email,
          sentAt: payload?.sentAt ?? payload?.sent_at,
          expiresAt: payload?.expiresAt ?? payload?.expires_at,
        });
        setValid(true);
      } catch (e: any) {
        if (!mounted) return;
        setValid(false);
        toast.error(e?.response?.data?.message || 'Invalid or expired verification link');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    try {
      setConfirming(true);
      await confirmEmailVerification(token);
      toast.success('Email verified successfully');
      router.push('/');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to verify email');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      <Heading level={4} align="left" bold>
        Verify Email
      </Heading>
      <Spacing size="md" />

      {loading ? (
        <Spinner label="Validating token…" />
      ) : !token ? (
        <Alert>Missing token.</Alert>
      ) : !valid ? (
        <Alert>Invalid or expired token.</Alert>
      ) : (
        <Stack>
          <Card>
            <FormSectionHeader
              title="Verify your email"
              description={`Verify ${info?.email ?? 'your email'} to complete account setup.`}
            />
            {info?.sentAt && (
              <HyperText size="xs" color="text-gray-500">Sent: {info.sentAt}</HyperText>
            )}
            {info?.expiresAt && (
              <HyperText size="xs" color="text-gray-500">Expires: {info.expiresAt}</HyperText>
            )}
          </Card>

          <LineSeparator />

          <FormWrapper onSubmit={() => handleConfirm()}>
            <Inline>
              <Button type="submit" disabled={confirming}>{confirming ? 'Verifying…' : 'Verify Email'}</Button>
              <Button type="button" variant="secondary" onClick={() => router.push('/')}>Cancel</Button>
            </Inline>
          </FormWrapper>
        </Stack>
      )}
    </LayoutWithoutSidebar>
  );
}
