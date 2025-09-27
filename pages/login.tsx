import FormWrapper from "todo/components/forms/FormWrapper";
import Button from 'todo/components/forms/Button';
import FormActions from "todo/components/forms/FormActions";
import InputWithPrefix from "todo/components/forms/InputText";
import Spacing from "todo/components/forms/Spacing";
import { useState, useRef, useEffect } from "react";
import toast from 'react-hot-toast';
import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import Heading from "todo/components/forms/Heading";
import Hyperlink from "todo/components/forms/Hyperlink";
import HyperText from "todo/components/forms/HyperText";
import InputText from "todo/components/forms/InputText";
import router from "next/router";
import { loginUser, guestLogin } from "todo/services/api";
import { AxiosError } from 'axios'
import { triggerUserRefresh } from "todo/components/actions/actionHandler";
import { useTranslation } from '@/utils/i18n';
import LanguageSelector from '@/components/common/LanguageSelector';
import Image from 'next/image';
import LogoSpinner from '@/components/common/LogoSpinner';

export default function LoginPage() {
  const { t } = useTranslation();

  const { lang } = useTranslation();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playSuccessAnim, setPlaySuccessAnim] = useState(false);
  const [shake, setShake] = useState(false);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const routedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true)
      const res = await loginUser(data)
      localStorage.setItem('userRole', res.user.role);
      localStorage.setItem('userId', res.user.id);
      localStorage.setItem('username', res.user.username);
      localStorage.setItem('email', res.user.email);
      triggerUserRefresh();
      if (!res || !res.user) {
        throw new Error('Login failed');
      }
      toast.success('Logged in!')
      // Trigger animation instead of immediate navigation
      setPlaySuccessAnim(true);
      // Fallback timeout in case animationend not fired
      navTimeoutRef.current = setTimeout(() => {
        if (!routedRef.current) {
          routedRef.current = true;
          router.push('/dashboard');
        }
  }, 1500); // animation 950ms + buffer
    } catch (err) {
      const error = err as AxiosError<{ message: string; error: string }>
      if (error.response?.status === 401) {
        const msg = (error.response.data?.message as any)?.message || 'Invalid credentials'
        toast.error(msg)
        // Trigger shake
        setShake(true);
        // Reset after animation duration so a second failure can retrigger
        setTimeout(() => setShake(false), 500);
      } else {
        toast.error('Something went wrong')
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    try {
      setLoading(true)
      const res = await guestLogin();
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
      {loading && !playSuccessAnim && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60" aria-hidden="true">
          <LogoSpinner size={56} className="drop-shadow-md" title={t('common.loading')} />
        </div>
      )}
      {playSuccessAnim && (
        <div
          className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center bg-white/70 dark:bg-black/70"
          aria-hidden="true"
        >
          <img
            src="/images/logo.png"
            alt="IXORA Logo"
            className="h-24 w-24 object-contain opacity-100 animate-logo-expand-fade"
            onAnimationEnd={() => {
              if (!routedRef.current) {
                routedRef.current = true;
                router.push('/dashboard');
              }
            }}
          />
        </div>
      )}
      {/* Fixed language selector (consistent with landing/signup) */}
      <div className="fixed right-3 top-20 sm:top-24 z-50">
        <LanguageSelector className="!static" />
      </div>

      {/* Branding header clickable to home */}
      <div className={`relative mx-auto flex w-full max-w-md items-center justify-center px-6 pt-10 pb-4 ${shake ? 'animate-logo-shake' : ''}`}>
        <a href="/" className="group flex flex-col items-center focus:outline-none" aria-label="Go to homepage">
          <div className="relative mb-3 h-20 w-20 transition-transform group-hover:scale-105">
            <Image src="/images/logo.png" alt="IXORA Logo" fill sizes="80px" className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#B01C2F] group-hover:text-[#8c1423]">IXORA</h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('landing.hero.subtitle')}</p>
        </a>
      </div>

      <FormWrapper onSubmit={handleSubmit}>
        <Heading level={2} align="center" bold>
          {t('login.title')}
        </Heading>
        <Spacing size="lg" />
        <InputWithPrefix id="email" name="email" label={t('forgotPassword.emailLabel')} requiredMessage={t('forgotPassword.emailRequired')} />
        <Spacing size="sm" />
        <InputText
          id="password"
          name="password"
          label={t('form.password')}
          type="password"
          requiredMessage={t('form.passwordRequired')}
        />
        <Hyperlink href="/forgot-password" position="right" bold fontSize="text-sm" underline={false} color="text-blue-600">
          {t('login.forgot')}
        </Hyperlink>
        <Spacing size="md" />
        <HyperText size="sm" align="center" color="text-gray-600">
          {t('login.notMember')} {" "}
          <Hyperlink href="/signup" inline bold>
            {t('login.signUpNow')}
          </Hyperlink>
        </HyperText>
        <Spacing size="sm" />
        <FormActions>
          <Button type="submit" variant="primary" fullWidth size="md" disabled={loading}>
            {t('login.signIn')}
          </Button>
        </FormActions>
        <FormActions>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            size="md"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            {t('login.continueGuest')}
          </Button>
        </FormActions>
      </FormWrapper>
    </LayoutWithoutSidebar>
  );
}