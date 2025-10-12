import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import LayoutWithoutSidebar from '@/components/main/LayoutWithoutSidebar';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import Button from '@/components/forms/Button';
import Alert from '@/components/forms/Alert';
import t from '@/utils/i18n';
import LanguageSelector from '@/components/common/LanguageSelector';

// Maps for friendly messages
const statusTitle: Record<string, string> = {
  approved: 'Owner Approval',
  declined: 'Owner Approval',
  error: 'Owner Approval',
};

const codeMessage: Record<string, string> = {
  missing_token: 'Invalid link.',
  not_found: 'Request not found.',
  expired: 'This link has expired.',
  business_not_found: 'Business not found.',
  forbidden: "This action isn’t permitted for your account.",
  error: 'Something went wrong. Please try again.',
};

export default function BusinessOwnerApprovalResultPage() {
  const router = useRouter();
  const { status, code } = router.query as { status?: string; code?: string };

  const { title, message, variant } = useMemo(() => {
    const s = (status || '').toLowerCase();
    const c = (code || '').toLowerCase();
    if (s === 'approved') {
      return { title: statusTitle[s] || 'Owner Approval', message: 'Requester has been added as staff.', variant: 'success' } as const;
    }
    if (s === 'declined') {
      return { title: statusTitle[s] || 'Owner Approval', message: 'You declined the staff request.', variant: 'warning' } as const;
    }
    // default to error/info mapping
    const msg = codeMessage[c] || codeMessage.error;
    return { title: statusTitle.error, message: msg, variant: 'error' } as const;
  }, [status, code]);

  const PRIMARY = '#B01C2F';

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      {/* Language switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      {/* Brand header (match login/verify-email) */}
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

      {/* Card wrapper */}
      <div className="mx-auto w-full max-w-md px-4">
        <div className="bg-white p-6">
          <Heading level={2} align="center" bold>
            {title}
          </Heading>
          <Spacing size="lg" />
          <Alert variant={variant as any}>{message}</Alert>
          <Spacing size="md" />
          <div className="flex justify-center">
            <Button onClick={() => router.push('/login')} variant="secondary" className="!border-[#B01C2F] !text-gray-800 hover:!bg-gray-50">
              {t('common.backToLogin', 'Back to login')}
            </Button>
          </div>
        </div>

        {/* small foot note for spacing consistency */}
        <p className="mt-4 text-center text-xs text-gray-500">
          {t('common.securedBy', 'Secured by MBMB Digital Services')}
        </p>
      </div>

      {/* subtle background bubble */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 -z-10 h-56 w-56 rounded-full opacity-10 blur-3xl"
        style={{ background: PRIMARY }}
      />
    </LayoutWithoutSidebar>
  );
}
