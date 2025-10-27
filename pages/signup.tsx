"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import router from "next/router";
import toast from "react-hot-toast";

import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import LanguageSelector from "@/components/common/LanguageSelector";
import LogoSpinner from "@/components/common/LogoSpinner";

import FormWrapper from "todo/components/forms/FormWrapper";
import Heading from "todo/components/forms/Heading";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import FormActions from "todo/components/forms/FormActions";
import FormRow from "todo/components/forms/FormRow";
import FormSectionHeader from "@/components/forms/FormSectionHeader";
import Hyperlink from "todo/components/forms/Hyperlink";
import HyperText from "todo/components/forms/HyperText";
import InputText from "todo/components/forms/InputText";
import SelectField from "todo/components/forms/SelectField";
import DatePickerField from "todo/components/forms/DatePickerField";
import PhotoUploadField from "todo/components/forms/PhotoUploadField";
import RadioGroupField from "todo/components/forms/RadioGroupField";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import Button from "todo/components/forms/Button";

import { useTranslation } from "@/utils/i18n";
import { createUser } from "todo/services/api";
import axios from 'axios';
import { countryOptions } from "todo/components/data/SelectionList";
import { identificationTypeList } from "todo/components/data/RadioList";

const PRIMARY = "#B01C2F";

type UserProfile = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  identificationType: string;
  identificationNumber: string;
  role: "personal";
  profilePicture?: string;
  dateOfBirth?: string; // ISO
  phoneNumber?: string;
  address?: string;
  city?: string;
  postalcode?: string;
  country?: string;
};

export default function SignUpPage() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [playSuccessAnim, setPlaySuccessAnim] = useState(false);
  const [shake, setShake] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const routedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Normalize phone to E.164 (without +):
      // UI shows prefix +601; users may enter (1) rest of number, (2) local 0xxxxxxxx, or (3) full 60xxxxxxxx.
      // We coerce to:
      //   - if starts with '60' already: keep as is
      //   - else if starts with '0': '60' + digits.slice(1)
      //   - else: '601' + digits (user typed part after +601)
      let normalizedPhone: string | undefined = undefined;
      if (data.phoneNumber) {
        const digits = String(data.phoneNumber).replace(/[^\d]/g, '').trim();
        if (digits) {
          if (digits.startsWith('60')) normalizedPhone = digits; // E.164 without plus
          else if (digits.startsWith('0')) normalizedPhone = '60' + digits.slice(1);
          else normalizedPhone = '601' + digits;
        }
      }

      const payload: UserProfile = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        identificationType: data.identificationType,
        identificationNumber: data.identificationNumber,
        role: "personal",
      };

      if (data.lastName) payload.lastName = data.lastName;
      if (data.profilePicture) payload.profilePicture = data.profilePicture;
      if (data.dateOfBirth) {
        try {
          payload.dateOfBirth = data.dateOfBirth.toISOString();
        } catch {}
      }
  if (normalizedPhone) payload.phoneNumber = normalizedPhone;
      if (data.address) payload.address = data.address;
      if (data.city) payload.city = data.city;
      if (data.postalcode) payload.postalcode = data.postalcode;
      if (data.country) payload.country = data.country;

      // Require OTP verified before final submit
      if (!otpVerified) {
        throw new Error(t('signup.verifyPhoneFirst', 'Please verify your phone number first'));
      }

      await createUser(payload);
      toast.success(t("signup.createdOk", "Account created successfully!"));

      // success splash like login
      setPlaySuccessAnim(true);
      navTimeoutRef.current = setTimeout(() => {
        if (!routedRef.current) {
          routedRef.current = true;
          router.push("/login");
        }
      }, 1200);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ||
          e?.message ||
          t("common.somethingWrong", "Something went wrong")
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      {/* background */}
      <div aria-hidden="true" className="fixed inset-0 -z-10" />

      {/* overlay loaders */}
      {loading && !playSuccessAnim && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60"
          aria-hidden="true"
        >
          <LogoSpinner
            size={56}
            className="drop-shadow-md"
            title={t("common.loading")}
          />
        </div>
      )}
      {playSuccessAnim && (
        <div
          className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center bg-white/70"
          aria-hidden="true"
        >
          <img
            src="/images/logo.png"
            alt="IXORA Logo"
            className="h-24 w-24 object-contain opacity-100 animate-logo-expand-fade"
            onAnimationEnd={() => {
              if (!routedRef.current) {
                routedRef.current = true;
                router.push("/login");
              }
            }}
          />
        </div>
      )}

      {/* Language switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      {/* Brand header — matches login */}
      <div
        className={`relative mx-auto flex w-full max-w-md items-center justify-center px-6 pt-10 pb-4 ${
          shake ? "animate-logo-shake" : ""
        }`}
      >
        <a
          href="/"
          className="group flex flex-col items-center focus:outline-none"
          aria-label="Go to homepage"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/images/logo.png"
                alt="IXORA"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>
            <span className="h-6 w-px bg-gray-300" />
            <div className="relative h-10 w-10">
              <Image
                src="/images/logo-mbmb.png"
                alt="MBMB"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#B01C2F]">IXORA</span>{" "}
            <span className="text-[#005C76]">MBMB</span>
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            MAJLIS BANDARAYA MELAKA BERSEJARAH
          </p>
        </a>
      </div>

      {/* Card wrapper — matches login */}
      <div className="mx-auto w-full max-w-md px-4">
        <div className="bg-white p-6">
          <FormWrapper onSubmit={handleSubmit}>
            <Heading level={2} align="center" bold>
              {t("signup.title", "Create your account")}
            </Heading>

            <Spacing size="lg" />

            <FormSectionHeader
              title={t("signup.createAccountTitle", "Account Details")}
              description={t(
                "signup.createAccountDesc",
                "Enter your email, password and identification details."
              )}
            />
            <Spacing size="lg" />

            <InputText
              id="email"
              name="email"
              type="email"
              label={t("signup.emailLabel", "Email")}
              requiredMessage={t("signup.emailRequired", "Email is required")}
            />
            <Spacing size="sm" />
            <InputText
              id="password"
              name="password"
              label={t("form.password", "Password")}
              type="password"
              requiredMessage={t(
                "form.passwordRequired",
                "Password is required"
              )}
              showHint
            />

            <Spacing size="lg" />
            <RadioGroupField
              name="identificationType"
              label={t("signup.identificationType", "Identification Type")}
              options={identificationTypeList}
              inline
              requiredMessage={t(
                "signup.identificationTypeRequired",
                "Please choose an identification type"
              )}
            />
            <Spacing size="sm" />
            <InputText
              id="identificationNumber"
              name="identificationNumber"
              label={t(
                "signup.identificationNumber",
                "Identification Number"
              )}
              requiredMessage={t(
                "signup.identificationNumberRequired",
                "Identification number is required"
              )}
            />

            <LineSeparator />
            <FormSectionHeader
              title={t("signup.userInfoTitle", "Personal Information")}
              description={t(
                "signup.userInfoDesc",
                "Optional, but helps us personalize your experience."
              )}
            />
            <Spacing size="sm" />

            <PhotoUploadField
              name="profilePicture"
              label={t("signup.profilePicture", "Profile Photo")}
              buttonText={t("signup.uploadPhoto", "Upload Photo")}
              folder="profile_pictures"
            />
            <Spacing size="sm" />

            <InputText
              id="firstName"
              name="firstName"
              label={t("form.firstName", "First Name")}
              requiredMessage={t(
                "form.firstNameRequired",
                "First name is required"
              )}
            />
            <Spacing size="sm" />
            <InputText
              id="lastName"
              name="lastName"
              label={t("form.lastName", "Last Name")}
            />
            <Spacing size="sm" />

            <DatePickerField
              name="dateOfBirth"
              label={t("signup.dateOfBirth", "Date of Birth")}
              dateFormat="dd/MM/yyyy"
              placeholder={t(
                "signup.dateOfBirthPlaceholder",
                "Select your date of birth"
              )}
            />
            <Spacing size="sm" />

            <InputText
              id="phoneNumber"
              name="phoneNumber"
              label={t("signup.phoneNumber", "Phone Number")}
              requiredMessage={t("signup.phoneRequired", "Phone number is required")}
              placeholder={t('signup.phonePlaceholder', 'e.g., 0178899841 or 60178899841')}
            />
            <div className="mt-2 flex items-center gap-2">
              {!otpVerified && (
                <Button
                  type="button"
                  variant="secondary"
                  loading={otpSending}
                  onClick={async () => {
                    try {
                      setOtpSending(true);
                      const input: HTMLInputElement | null = document.getElementById('phoneNumber') as any;
                      const raw = (input?.value || '').toString();
                      const digits = raw.replace(/[^\d]/g, '').trim();
                      let e164 = '';
                      if (digits.startsWith('60')) e164 = digits;
                      else if (digits.startsWith('0')) e164 = '60' + digits.slice(1);
                      else e164 = '601' + digits;
                      const base = process.env.NEXT_PUBLIC_API_URL || '';
                      await axios.post(`${base}/whatsapp/otp/request`, { phone: e164, purpose: 'registration' }, { withCredentials: true });
                      setOtpRequested(true);
                      toast.success(t('signup.otpSent', 'OTP sent via WhatsApp'));
                    } catch (e: any) {
                      toast.error(e?.response?.data?.message || e?.message || t('signup.otpSendFailed', 'Failed to send OTP'));
                    } finally {
                      setOtpSending(false);
                    }
                  }}
                >
                  {otpRequested ? t('signup.resendOtp', 'Resend OTP') : t('signup.sendOtp', 'Send OTP')}
                </Button>
              )}
              {otpVerified && <span className="text-green-600 text-sm">{t('signup.phoneVerified', 'Verified')}</span>}
            </div>
            {otpRequested && !otpVerified && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="otpCode"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder={t('signup.enterOtp', 'Enter 6-digit code')}
                  className="w-40 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                  inputMode="numeric"
                  maxLength={6}
                />
                <Button
                  type="button"
                  variant="primary"
                  loading={otpVerifying}
                  onClick={async () => {
                    try {
                      setOtpVerifying(true);
                      const input: HTMLInputElement | null = document.getElementById('phoneNumber') as any;
                      const raw = (input?.value || '').toString();
                      const digits = raw.replace(/[^\d]/g, '').trim();
                      let e164 = '';
                      if (digits.startsWith('60')) e164 = digits;
                      else if (digits.startsWith('0')) e164 = '60' + digits.slice(1);
                      else e164 = '601' + digits;
                      const base = process.env.NEXT_PUBLIC_API_URL || '';
                      await axios.post(`${base}/whatsapp/otp/verify`, { phone: e164, code: otpCode, purpose: 'registration' }, { withCredentials: true });
                      setOtpVerified(true);
                      toast.success(t('signup.otpVerified', 'Phone verified'));
                    } catch (e: any) {
                      setOtpVerified(false);
                      toast.error(e?.response?.data?.message || e?.message || t('signup.otpVerifyFailed', 'Invalid or expired code'));
                    } finally {
                      setOtpVerifying(false);
                    }
                  }}
                >
                  {t('signup.verifyOtp', 'Verify')}
                </Button>
              </div>
            )}
            <Spacing size="sm" />

            <InputText
              id="address"
              name="address"
              label={t("signup.address", "Premise / Lot / Street Address")}
            />
            <Spacing size="sm" />

            <FormRow columns={2}>
              <InputText id="city" name="city" label={t("form.city", "City")} />
              <InputText
                id="postalcode"
                name="postalcode"
                label={t("form.postalCode", "Postal Code")}
              />
            </FormRow>
            <Spacing size="sm" />

            <SelectField
              id="country"
              name="country"
              label={t("form.country", "Country")}
              options={countryOptions}
            />
            <Spacing size="sm" />

            <HyperText size="sm" align="center" color="text-gray-600">
              {t("profile.termsPrefix", "By signing up, you agree to the")}{" "}
              <Hyperlink href="/terms" inline>
                {t("profile.terms", "Terms of Service")}
              </Hyperlink>{" "}
              {t("profile.and", "and")}{" "}
              <Hyperlink href="/privacy" inline>
                {t("profile.privacy", "Privacy Policy")}
              </Hyperlink>
              .
            </HyperText>

            <Spacing size="md" />
            <FormActions>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCancelDialog(true)}
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !otpVerified}
                className="!bg-[#B01C2F] hover:!bg-[#951325] focus-visible:!ring-2 focus-visible:!ring-[#B01C2F] focus-visible:!ring-offset-2"
              >
                {t("signup.submit", "Create Account")}
              </Button>
            </FormActions>

            <Spacing size="sm" />
            <HyperText size="sm" align="center" color="text-gray-600">
              {t("signup.haveAccount", "Already have an account?")}{" "}
              <Hyperlink href="/login" inline bold color="text-[#B01C2F]">
                {t("login.signIn", "Sign in")}
              </Hyperlink>
            </HyperText>
          </FormWrapper>
        </div>

        {/* foot note */}
        <p className="mt-4 text-center text-xs text-gray-500">
          {t("common.securedBy", "Secured by MBMB Digital Services")}
        </p>
      </div>

      {/* subtle background bubble */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 -z-10 h-56 w-56 rounded-full opacity-10 blur-3xl"
        style={{ background: PRIMARY }}
      />

      <ConfirmDialog
        open={showCancelDialog}
        title={t("signup.discardTitle", "Discard changes?")}
        description={t(
          "signup.discardDesc",
          "Your changes will be lost. Are you sure you want to leave this page?"
        )}
        confirmText={t("signup.discardConfirm", "Discard and go to Login")}
        cancelText={t("common.cancel", "Cancel")}
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          router.push("/login");
        }}
      />
    </LayoutWithoutSidebar>
  );
}