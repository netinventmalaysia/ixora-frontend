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
import SidebarContent from "todo/components/main/Sidebar";
import { logoUrl } from "todo/components/main/SidebarConfig";
import { useTranslation } from "@/utils/i18n";
import LogoSpinner from "@/components/common/LogoSpinner";

type UserProfile = {
  id: number;
  email: string;
  firstName: string;
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
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [businessOptions, setBusinessOptions] = useState<{ label: string; value: string }[]>([]);
  const [businessId, setBusinessId] = useState<number>();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
    setUsername(localStorage.getItem("username") || "");
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

      const res: AxiosResponse<UserProfile> = await getUserProfile(userId);
      const data = res.data;
      setUserProfile(data);
      setAccountType(data.role);
      setIsOrganisation(data.organisation === "organisation");

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

      const payload: UserProfile = {
        id: userProfile!.id,
        email: data.email,
        firstName: data.firstName,
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
      username={username}
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
        <DatePickerField
          name="dateOfBirth"
          label={t("signup.dateOfBirth")}
          dateFormat="dd/MM/yyyy"
          placeholder={t("signup.dateOfBirthPlaceholder")}
        />
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
          <Button type="submit" variant="primary" loading={loading}>
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
