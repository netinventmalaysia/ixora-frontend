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
import t from '@/utils/i18n';
import toast from 'react-hot-toast';
import { acceptBusinessInvite, validateBusinessInvite } from '@/services/api';
import getErrorMessage from '@/utils/getErrorMessage';

type InviteInfo = {
  businessId?: number;
  businessName?: string;
  inviterEmail?: string;
  inviterId?: number | string;
  invitedEmail?: string;
  status?: string; // e.g., Pending/Accepted/Expired
};

export default function BusinessInvitePage() {
  const router = useRouter();
  const token = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const url = new URL(window.location.href);
    return url.searchParams.get('token') || undefined;
  }, []);

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [accepting, setAccepting] = useState(false);

  const isAuthenticated = typeof document !== 'undefined' && document.cookie.includes('auth_token');

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!token) {
        setLoading(false);
        setValid(false);
        return;
      }
      try {
        const res = await validateBusinessInvite(token);
        if (!mounted) return;
        setValid(true);
        // backend returns { valid: boolean, info: { ... } }
        const payload = res?.info ?? res;
        console.log('Invite info:', payload);
        setInfo({
          businessId: payload?.businessId ?? payload?.business_id,
          businessName: payload?.businessName ?? payload?.business_name ?? payload?.name,
          inviterEmail: payload?.inviterEmail ?? payload?.inviter_email,
          inviterId: payload?.inviterId ?? payload?.inviter_id,
          invitedEmail: payload?.invitedEmail ?? payload?.invited_email,
          status: payload?.status,
        });
      } catch (e: any) {
        if (!mounted) return;
        setValid(false);
        toast.error(getErrorMessage(e) || 'Invalid or expired invitation link');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(`/business-invite?token=${encodeURIComponent(token)}`);
      router.push(`/login?redirect=${redirect}`);
      return;
    }
    try {
      setAccepting(true);
      await acceptBusinessInvite(token);
      toast.success('Invitation accepted');
      router.push('/business/team');
    } catch (e: any) {
  toast.error(getErrorMessage(e) || 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      <Heading level={4} align="left" bold>
  {t('businessInvite.title')}
      </Heading>
      <Spacing size="md" />

      {loading ? (
  <Spinner label={t('businessInvite.validating')} />
      ) : !token ? (
  <Alert>{t('businessInvite.missingToken')}</Alert>
      ) : !valid ? (
  <Alert>{t('businessInvite.invalid')}</Alert>
      ) : (
        <Stack>
          <Card>
            <FormSectionHeader
              title={t('businessInvite.welcome')}
              description={t('businessInvite.description', `You have been invited${info?.inviterEmail ? ` by ${info.inviterEmail}` : info?.inviterId ? ` by user #${info.inviterId}` : ''} to join${info?.businessName ? ` "${info.businessName}"` : ' this business'}.`)}
            />
            {info?.invitedEmail && (
              <HyperText size="xs" color="text-gray-500">Invitation for: {info.invitedEmail}</HyperText>
            )}
            {info?.status && (
              <HyperText size="xs" color="text-gray-500">Status: {info.status}</HyperText>
            )}
          </Card>

          <LineSeparator />

          <FormWrapper onSubmit={() => handleAccept()}>
            <Inline>
              <Button type="submit" disabled={accepting}>
                {isAuthenticated ? (accepting ? t('businessInvite.accepting') : t('businessInvite.accept')) : t('businessInvite.loginToAccept')}
              </Button>
              <Button type="button" variant="secondary" onClick={() => router.push('/login')}>{t('common.cancel')}</Button>
            </Inline>
          </FormWrapper>
        </Stack>
      )}
    </LayoutWithoutSidebar>
  );
}
