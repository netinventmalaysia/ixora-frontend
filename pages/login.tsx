import FormWrapper from "todo/components/forms/FormWrapper";
import Button from "todo/components/forms/Button";
import FormActions from "todo/components/forms/FormActions";
import InputWithPrefix from "todo/components/forms/InputText";
import Spacing from "todo/components/forms/Spacing";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import Heading from "todo/components/forms/Heading";
import Hyperlink from "todo/components/forms/Hyperlink";
import HyperText from "todo/components/forms/HyperText";
import InputText from "todo/components/forms/InputText";
import router from "next/router";
import { loginUser, guestLogin } from "todo/services/api";
import { AxiosError } from "axios";
import { triggerUserRefresh } from "todo/components/actions/actionHandler";
import { useTranslation } from "@/utils/i18n";
import LanguageSelector from "@/components/common/LanguageSelector";
import Image from "next/image";
import LogoSpinner from "@/components/common/LogoSpinner";

const PRIMARY = "#B01C2F";

export default function LoginPage() {
  const { t } = useTranslation();
  const { lang } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [playSuccessAnim, setPlaySuccessAnim] = useState(false);
  const [shake, setShake] = useState(false);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const routedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) {
        clearTimeout(navTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      if (!res?.user) throw new Error("Login failed");

      localStorage.setItem("userRole", res.user.role);
      localStorage.setItem("userId", res.user.id);
      localStorage.setItem("email", res.user.email);
      try {
        const first = res.user.firstName || res.user.first_name || '';
        const last = res.user.lastName || res.user.last_name || '';
        const cached = JSON.stringify({ firstName: first, lastName: last, fullName: `${first} ${last}`.trim() });
        localStorage.setItem('userProfile', cached);
      } catch {}
      triggerUserRefresh();

      toast.success(t("login.loggedIn", "Logged in!"));
      setPlaySuccessAnim(true);

      navTimeoutRef.current = setTimeout(() => {
        if (!routedRef.current) {
          routedRef.current = true;
          router.push("/dashboard");
        }
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<{ message: string; error: string }>;
      const isAuth = error.response?.status === 401;
      toast.error(
        isAuth
          ? (error.response?.data as any)?.message?.message ?? t("login.invalid", "Invalid credentials")
          : t("common.somethingWrong", "Something went wrong")
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const res = await guestLogin();
      if (!res?.user) throw new Error("Guest login failed");
      localStorage.setItem("userRole", res.user.role);
      localStorage.setItem("userId", res.user.id);
      toast.success(t("login.guestOk", "Logged in as Guest"));
      router.push("/dashboard");
    } catch {
      toast.error(t("login.guestFail", "Failed to login as guest"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      {/* subtle background wash matching landing */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
      />

      {/* overlay loaders */}
      {loading && !playSuccessAnim && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60" aria-hidden="true">
          <LogoSpinner size={56} className="drop-shadow-md" title={t("common.loading")} />
        </div>
      )}
      {playSuccessAnim && (
        <div className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center bg-white/70" aria-hidden="true">
          <img
            src="/images/logo.png"
            alt="IXORA Logo"
            className="h-24 w-24 object-contain opacity-100 animate-logo-expand-fade"
            onAnimationEnd={() => {
              if (!routedRef.current) {
                routedRef.current = true;
                router.push("/dashboard");
              }
            }}
          />
        </div>
      )}

      {/* Language switcher */}
<div className="absolute top-4 right-4">
  <LanguageSelector />
</div>

      {/* Brand header */}
      <div
        className={`relative mx-auto flex w-full max-w-md items-center justify-center px-6 pt-10 pb-4 ${
          shake ? "animate-logo-shake" : ""
        }`}
      >
  <a href="/login" className="group flex flex-col items-center focus:outline-none" aria-label="Go to homepage">
          {/* logos row with pipe (same as landing tone) */}
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
            <span className="text-[#B01C2F]">IXORA</span>{" "}
            <span className="text-[#005C76]">MBMB</span>
          </h1>
          <p className="mt-1 text-xs text-gray-500">MAJLIS BANDARAYA MELAKA BERSEJARAHd</p>
        </a>
      </div>

      {/* Card wrapper (theme: border + ring color) */}
      <div className="mx-auto w-full max-w-md px-4">
        <div
          className="bg-white p-6">
          <FormWrapper onSubmit={handleSubmit}>
            <Heading level={2} align="center" bold>
              {t("login.title")}
            </Heading>

            <Spacing size="lg" />
            <InputWithPrefix
              id="email"
              name="email"
              label={t("forgotPassword.emailLabel")}
              requiredMessage={t("forgotPassword.emailRequired")}
            />
            <Spacing size="sm" />
            <InputText
              id="password"
              name="password"
              label={t("form.password")}
              type="password"
              requiredMessage={t("form.passwordRequired")}
            />

            <div className="mt-1">
              <Hyperlink
                href="/forgot-password"
                position="right"
                bold
                fontSize="text-sm"
                underline={false}
                color="text-[#005C76]"
              >
                {t("login.forgot")}
              </Hyperlink>
            </div>

            <Spacing size="md" />
            <HyperText size="sm" align="center" color="text-gray-600">
              {t("login.notMember")}{" "}
              <Hyperlink href="/signup" inline bold color="text-[#B01C2F]">
                {t("login.signUpNow")}
              </Hyperlink>
            </HyperText>

            <Spacing size="sm" />
            <FormActions>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                disabled={loading}
                className="!bg-[#B01C2F] hover:!bg-[#951325] focus-visible:!ring-2 focus-visible:!ring-[#B01C2F] focus-visible:!ring-offset-2"
              >
                {t("login.signIn")}
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
                className="!border-[#B01C2F] !text-gray-800 hover:!bg-gray-50"
              >
                {t("login.continueGuest")}
              </Button>
            </FormActions>
          </FormWrapper>
        </div>

        {/* small foot note for consistency spacing */}
        <p className="mt-4 text-center text-xs text-gray-500">
          {t("common.securedBy", "Secured by MBMB Digital Services")}
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