// pages/profile.tsx

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormWrapper from "todo/components/forms/FormWrapper";
import Button from "todo/components/forms/Button";
import FormSectionHeader from "@/components/forms/FormSectionHeader";
import FormActions from "todo/components/forms/FormActions";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import Heading from "todo/components/forms/Heading";
import FormRow from "todo/components/forms/FormRow";
import Hyperlink from "todo/components/forms/Hyperlink";
import InputText from "todo/components/forms/InputText";
import { countryOptions } from "todo/components/data/SelectionList";
import SelectField from "todo/components/forms/SelectField";
import DatePickerField from "todo/components/forms/DatePickerField";
import TextLine from "todo/components/forms/HyperText";
import PhotoUploadField from "todo/components/forms/PhotoUploadField";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import Toggle from "todo/components/forms/Toggle";
import RadioGroupField from "todo/components/forms/RadioGroupField";
import { identificationTypeList } from "todo/components/data/RadioList";
import {
  getUserProfile,
  updateUser,
  fetchMyBusinesses,
  fetchBusinessById,
} from "todo/services/api";
import toast from "react-hot-toast";
import router from "next/router";
import { AxiosResponse } from "axios";
import axios from "axios";
import SidebarContent from "todo/components/main/Sidebar";
import { logoUrl } from "todo/components/main/SidebarConfig";
import { useTranslation } from "@/utils/i18n";
import LogoSpinner from "@/components/common/LogoSpinner";

type UserProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  identificationType?: string;
  identificationNumber?: string;
  dateOfBirth?: string;
  address?: string;
  role: "personal" | "business";
  profilePicture?: string;
  bio?: string;
  isActive?: boolean;
  isAccountVerified?: boolean;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  city?: string;
  postalcode?: string;
  country?: string;
  organisation?: "organisation" | "business";
  companyName?: string;
  registrationNumber?: string;
};

// Keep business form fields in sync if a business is selected
function BusinessEffect({ businessId }: { businessId?: number }) {
  const { setValue } = useFormContext();

  useEffect(() => {
    if (!businessId) return;

    fetchBusinessById(businessId)
      .then((biz) => {
        setValue("companyName", biz.companyName);
        setValue("registrationNumber", biz.registrationNumber);
        // also populate address fields (state removed per latest requirements)
        setValue("address", biz.address);
        setValue("city", biz.city);
        setValue("postalcode", biz.postalcode);
        setValue("country", biz.country);
      })
      .catch(() => {
        toast.error("Failed to load business details");
      });
  }, [businessId, setValue]);

  return null;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountType, setAccountType] = useState<"personal" | "business">("personal");
  const [isOrganisation, setIsOrganisation] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [fullName, setFullName] = useState<string>("Guest");
  const [email, setEmail] = useState<string>("");
  // OTP flow state for phone change
  const [otpSending, setOtpSending] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [originalPhoneNormalized, setOriginalPhoneNormalized] = useState<string>("");

  const [businessOptions, setBusinessOptions] = useState<{ label: string; value: string }[]>([]);
  const [businessId, setBusinessId] = useState<number>();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
    try {
      const payer = localStorage.getItem('payerName');
      if (payer) {
        setFullName(payer);
      } else {
        const profRaw = localStorage.getItem('userProfile');
        if (profRaw) {
          const prof = JSON.parse(profRaw);
          const first = prof?.firstName || prof?.first_name || '';
          const last = prof?.lastName || prof?.last_name || '';
          setFullName((`${first} ${last}`).trim() || prof?.fullName || 'Guest');
        } else {
          setFullName(localStorage.getItem('username') || 'Guest');
        }
      }
    } catch {
      setFullName(localStorage.getItem('username') || 'Guest');
    }
    setEmail(localStorage.getItem("email") || "");
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const userIdStr = localStorage.getItem("userId") || "";
      const userId = Number(userIdStr);
      if (!userId) {
        toast.error("User not logged in");
        router.push("/");
        return;
      }
      const res: AxiosResponse<UserProfile | any> = await getUserProfile(userId);
      const raw = res.data as any;
      // Normalize potential snake_case from backend to our camelCase model
      const data: UserProfile = {
        id: raw.id,
        email: raw.email,
        firstName: raw.firstName ?? raw.first_name ?? '',
        lastName: raw.lastName ?? raw.last_name ?? '',
        phoneNumber: raw.phoneNumber ?? raw.phone_number,
        identificationType: raw.identificationType ?? raw.identification_type,
        identificationNumber: raw.identificationNumber ?? raw.identification_number ?? raw.ic,
        dateOfBirth: raw.dateOfBirth ?? raw.date_of_birth,
        address: raw.address,
        role: (raw.role as any) || 'personal',
        profilePicture: raw.profilePicture ?? raw.profile_picture,
        bio: raw.bio,
        isActive: raw.isActive,
        isAccountVerified: raw.isAccountVerified,
        isEmailVerified: raw.isEmailVerified,
        isTwoFactorEnabled: raw.isTwoFactorEnabled,
        city: raw.city,
        postalcode: raw.postalcode ?? raw.postal_code,
        country: raw.country,
        organisation: raw.organisation,
        companyName: raw.companyName ?? raw.company_name,
        registrationNumber: raw.registrationNumber ?? raw.registration_number,
      };
      setUserProfile(data);
      setAccountType(data.role);
      setIsOrganisation(data.organisation === "organisation");
      // Remember original phone in normalized digits-only E.164 (without plus)
      try {
        const digits = String(data.phoneNumber || "").replace(/[^\d]/g, '').trim();
        let e164 = '';
        if (digits) {
          if (digits.startsWith('60')) e164 = digits;
          else if (digits.startsWith('0')) e164 = '60' + digits.slice(1);
          else e164 = '601' + digits;
        }
        setOriginalPhoneNormalized(e164);
      } catch { setOriginalPhoneNormalized(""); }

      // If business user, load saved businesses to pick from
      if (data.role === "business") {
        const allBiz = await fetchMyBusinesses();
        setBusinessOptions(
          allBiz.map((b: any) => ({ label: b.name, value: b.id.toString() }))
        );
        if (allBiz.length) setBusinessId(allBiz[0].id);
      }
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      // If phone is changed, require verification
      const currentDigits = String(data.phoneNumber || "").replace(/[^\d]/g, '').trim();
      let currentE164 = '';
      if (currentDigits) {
        if (currentDigits.startsWith('60')) currentE164 = currentDigits;
        else if (currentDigits.startsWith('0')) currentE164 = '60' + currentDigits.slice(1);
        else currentE164 = '601' + currentDigits;
      }
      const phoneChanged = currentE164 !== originalPhoneNormalized;
      if (phoneChanged && !otpVerified) {
        throw new Error(t('signup.verifyPhoneFirst', 'Please verify your phone number first'));
      }

      const payload: UserProfile = {
        id: userProfile!.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        identificationType: data.identificationType,
        identificationNumber: data.identificationNumber,
        role: accountType,
        profilePicture: data.profilePicture,
        address: data.address,
        city: data.city,
        postalcode: data.postalcode,
        country: data.country,
        organisation:
          accountType === "business"
            ? isOrganisation
              ? "organisation"
              : "business"
            : undefined,
      } as any;
      if (data.dateOfBirth) {
        try {
          (payload as any).dateOfBirth = data.dateOfBirth.toISOString();
        } catch {}
      }

      await updateUser(payload);
      toast.success("Profile updated successfully!");
      await fetchUser();
      // Reset OTP flags after successful save
      setOtpRequested(false);
      setOtpVerified(false);
      setOtpCode('');
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60"
        aria-hidden="true"
      >
        <LogoSpinner size={56} className="drop-shadow-md" title={t("common.loading")} />
      </div>
    );
  if (!userProfile) return <div className="p-6 text-red-500">{t("profile.failedLoad")}</div>;

  return (
    <SidebarContent
      teams={[]}
      logoUrl={logoUrl}
      userRole={userRole || "guest"}
  fullName={fullName}
      email={email}
    >
      <FormWrapper
        onSubmit={handleSubmit}
        defaultValues={{
          ...userProfile,
          dateOfBirth: userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth) : undefined,
        }}
      >
        <Heading level={2} align="left" bold>
          {t("profile.title")}
        </Heading>
        <Spacing size="lg" />

        {/* Account Details */}
        <FormSectionHeader
          title={t("profile.accountDetailsTitle")}
          description={t("profile.accountDetailsDesc")}
        />
        <Spacing size="lg" />
        <InputText
          id="email"
          name="email"
          type="email"
          label={t("signup.emailLabel")}
          requiredMessage={t("signup.emailRequired")}
        />
        <Spacing size="md" />
        <RadioGroupField
          name="identificationType"
          label={t("signup.identificationType")}
          options={identificationTypeList}
          inline={true}
          requiredMessage={t("signup.identificationTypeRequired")}
        />
        <Spacing size="sm" />
        <InputText
          id="identificationNumber"
          name="identificationNumber"
          label={t("signup.identificationNumber")}
          requiredMessage={t("signup.identificationNumberRequired")}
        />
        <Spacing size="lg" />

        {/* User Information */}
        <LineSeparator />
        <FormSectionHeader
          title={t("profile.userInfoTitle")}
          description={t("profile.userInfoDesc")}
        />
        <Spacing size="sm" />
        <PhotoUploadField
          name="profilePicture"
          label={t("signup.profilePicture")}
          buttonText={t("signup.uploadPhoto")}
          folder="profile_pictures"
          onUpload={(path) => console.log("Uploaded profile picture:", path)}
        />
        <Spacing size="sm" />
        <InputText
          id="firstName"
          name="firstName"
          label={t("form.firstName")}
          requiredMessage={t("form.firstNameRequired")}
        />
        <Spacing size="sm" />
        <InputText
          id="lastName"
          name="lastName"
          label={t("form.lastName")}
        />
        <Spacing size="sm" />
        <DatePickerField
          name="dateOfBirth"
          label={t("signup.dateOfBirth")}
          dateFormat="dd/MM/yyyy"
          placeholder={t("signup.dateOfBirthPlaceholder")}
        />
        <Spacing size="sm" />
        <InputText
          id="phoneNumber"
          name="phoneNumber"
          label={t("signup.phoneNumber")}
          requiredMessage={t("signup.phoneNumberRequired")}
          placeholder={t('signup.phonePlaceholder', 'e.g., 0101111111 or 60101111111')}
        />
        {/* OTP controls for phone change */}
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
                  if (!digits) {
                    toast.error(t('signup.phoneRequired', 'Phone number is required'));
                    return;
                  }
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
              id="otpCodeProfile"
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
          <InputText id="city" name="city" label={t("form.city")} />
          <InputText id="postalcode" name="postalcode" label={t("form.postalCode")} />
        </FormRow>
        <Spacing size="sm" />
        <SelectField id="country" name="country" label={t("form.country")} options={countryOptions} />

        {/* Business Information */}
        {accountType === "business" && (
          <>
            <LineSeparator />
            <FormSectionHeader
              title={t("profile.businessInfoTitle")}
              description={t("profile.businessInfoDesc")}
            />
            <Spacing size="lg" />
            <Toggle
              label=""
              description={isOrganisation ? t("profile.organisation") : t("profile.company")}
              checked={isOrganisation}
              onChange={setIsOrganisation}
            />
            <Spacing size="sm" />

            <SelectField
              id="businessName"
              name="businessName"
              label={t("profile.businessName")}
              options={businessOptions}
              onChange={(e) => setBusinessId(Number(e.target.value))}
              requiredMessage={t("profile.selectBusiness")}
            />
            <BusinessEffect businessId={businessId} />
            <Spacing size="sm" />

            <InputText
              id="companyName"
              name="companyName"
              label={isOrganisation ? t("profile.organisationName") : t("profile.companyName")}
              requiredMessage={t("profile.companyNameRequired")}
            />
            <Spacing size="sm" />
            <InputText
              id="registrationNumber"
              name="registrationNumber"
              label={isOrganisation ? t("profile.rosNumber") : t("profile.ssmNumber")}
              requiredMessage={isOrganisation ? t("profile.rosRequired") : t("profile.ssmRequired")}
            />
          </>
        )}

        {/* Terms & Actions */}
        <Spacing size="lg" />
        <TextLine size="sm" align="center" color="text-gray-600">
          {t("profile.termsPrefix")} {" "}
          <Hyperlink href="/terms" inline>
            {t("profile.terms")}
          </Hyperlink>{" "}
          {t("profile.and")} {" "}
          <Hyperlink href="/privacy" inline>
            {t("profile.privacy")}
          </Hyperlink>
        </TextLine>

        <FormActions>
          <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={(() => {
              // Disable save if phone changed and not verified
              try {
                const input: HTMLInputElement | null = document.getElementById('phoneNumber') as any;
                const raw = (input?.value || '').toString();
                const digits = raw.replace(/[^\d]/g, '').trim();
                let e164 = '';
                if (digits) {
                  if (digits.startsWith('60')) e164 = digits;
                  else if (digits.startsWith('0')) e164 = '60' + digits.slice(1);
                  else e164 = '601' + digits;
                }
                const changed = e164 !== originalPhoneNormalized;
                return loading || (changed && !otpVerified);
              } catch { return loading; }
            })()}
          >
            {t("profile.saveChanges")}
          </Button>
        </FormActions>
      </FormWrapper>

      <ConfirmDialog
        open={showCancelDialog}
        title={t("signup.discardTitle")}
        description={t("signup.discardDesc")}
        confirmText={t("signup.discardConfirm")}
        cancelText={t("common.cancel")}
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          router.push("/dashboard");
        }}
      />
    </SidebarContent>
  );
}
