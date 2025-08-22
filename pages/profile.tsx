// pages/profile.tsx

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";               // ← for BusinessEffect
import FormWrapper from "todo/components/forms/FormWrapper";
import Button from "todo/components/forms/Button";
import FormSectionHeader from "@/components/forms/FormSectionHeader";
import FormActions from "todo/components/forms/FormActions";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
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
import {
  //fetchCsrfToken,
  getUserProfile,
  updateUser,
  fetchMyBusinesses,     // ← NEW
  fetchBusinessById,      // ← NEW
} from "todo/services/api";
import toast from "react-hot-toast";
import router from "next/router";
import { AxiosResponse } from "axios";
import SidebarContent from "todo/components/main/Sidebar";
import { logoUrl } from "todo/components/main/SidebarConfig";
import t from '@/utils/i18n';

type UserProfile = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  role: "personal" | "business";
  profilePicture?: string;
  bio?: string;
  isActive?: boolean;
  isAccountVerified?: boolean;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  city?: string;
  state?: string;
  postalcode?: string;
  country?: string;
  organisation?: "organisation" | "business";
  companyName?: string;
  registrationNumber?: string;
};

// Tiny component to react to businessId changes
function BusinessEffect({ businessId }: { businessId?: number }) {
  const { setValue } = useFormContext();

  useEffect(() => {
    if (!businessId) return;

    fetchBusinessById(businessId)
      .then((biz) => {
        console.log(biz);
        setValue("companyName", biz.companyName);
        setValue("registrationNumber", biz.registrationNumber);
        // also populate address fields:
        setValue("address", biz.address);
        setValue("city", biz.city);
        setValue("state", biz.state);
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

      // --- NEW: if business, fetch all registered businesses ---
      if (data.role === "business") {
        const allBiz = await fetchMyBusinesses();
        setBusinessOptions(
          allBiz.map((b: any) => ({
            label: b.name,
            value: b.id.toString(),
          }))
        );
        // pre‑select the first one:
        if (allBiz.length) {
          setBusinessId(allBiz[0].id);
        }
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
      //await fetchCsrfToken();

      const payload: UserProfile = {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
        role: accountType,
        organisation:
          accountType === "business"
            ? isOrganisation
              ? "organisation"
              : "business"
            : undefined,
      };

      await updateUser(payload);
      toast.success("Profile updated successfully!");
      await fetchUser();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">{t('common.loading')}</div>;
  if (!userProfile)
    return <div className="p-6 text-red-500">{t('profile.failedLoad')}</div>;

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
          dateOfBirth: new Date(userProfile.dateOfBirth),
        }}
      >
        <Heading level={2} align="left" bold>
          {t('profile.title')}
        </Heading>
        <Spacing size="lg" />

        {/* Account Details */}
        <FormSectionHeader
          title={t('profile.accountDetailsTitle')}
          description={t('profile.accountDetailsDesc')}
        />
        <Spacing size="lg" />
        <InputText
          id="username"
          name="username"
          label="Username"
          requiredMessage="Username is required"
        />
        <Spacing size="sm" />
        <InputText
          id="email"
          name="email"
          type="email"
          label="Email Address"
          requiredMessage="Email Address is required"
        />
        <Spacing size="lg" />

        {/* User Information */}
        <LineSeparator />
        <FormSectionHeader
          title={t('profile.userInfoTitle')}
          description={t('profile.userInfoDesc')}
        />
        <Spacing size="sm" />
        <PhotoUploadField
          name="profilePicture"
          label="Profile Picture"
          buttonText="Upload Photo"
          folder="profile_pictures"
          requiredMessage="Profile picture is required"
          onUpload={(path) => console.log("Uploaded profile picture:", path)}
        />
        <Spacing size="sm" />
        <FormRow columns={2}>
          <InputText
            id="firstName"
            name="firstName"
            label="First Name"
            requiredMessage="First name is required"
          />
          <InputText
            id="lastName"
            name="lastName"
            label="Last Name"
            requiredMessage="Last name is required"
          />
        </FormRow>
        <Spacing size="sm" />
        <DatePickerField
          name="dateOfBirth"
          label="Date of Birth"
          dateFormat="dd/MM/yyyy"
          placeholder="DD/MM/YYYY"
          requiredMessage="Please select your birthdate"
        />
        <Spacing size="sm" />
        <InputText
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          prefix="+601"
          requiredMessage="Phone number is required"
        />
        <Spacing size="sm" />
        <InputText
          id="address"
          name="address"
          label="Premise / Lot / Street Address"
          requiredMessage="Address is required"
        />
        <Spacing size="sm" />
        <FormRow columns={3}>
          <InputText id="city" name="city" label="City" requiredMessage="City is required" />
          <InputText
            id="state"
            name="state"
            label="State / Province"
            requiredMessage="State / Province is required"
          />
          <InputText
            id="postalcode"
            name="postalcode"
            label="ZIP / Postal code"
            requiredMessage="ZIP / Postal code is required"
          />
        </FormRow>
        <Spacing size="sm" />
        <SelectField
          id="country"
          name="country"
          label="Country"
          options={countryOptions}
          requiredMessage="Country is required"
        />

        {/* Business Information */}
        {accountType === "business" && (
          <>
            <LineSeparator />
            <FormSectionHeader
              title="Business Information"
              description="Update your business or organisation details."
            />
            <Spacing size="lg" />
            <Toggle
              label=""
              description={isOrganisation ? t('profile.organisation') : t('profile.company')}
              checked={isOrganisation}
              onChange={setIsOrganisation}
            />
            <Spacing size="sm" />

            <SelectField
              id="businessName"
              name="businessName"
              label={t('profile.businessName')}
              options={businessOptions}
              onChange={(e) => setBusinessId(Number(e.target.value))}
              requiredMessage={t('profile.selectBusiness')}
            />
            <BusinessEffect businessId={businessId} />
            <Spacing size="sm" />

            <InputText
              id="companyName"
              name="companyName"
              label={isOrganisation ? t('profile.organisationName') : t('profile.companyName')}
              requiredMessage={t('profile.companyNameRequired')}
            />
            <Spacing size="sm" />
            <InputText
              id="registrationNumber"
              name="registrationNumber"
              label={isOrganisation ? t('profile.rosNumber') : t('profile.ssmNumber')}
              requiredMessage={isOrganisation ? t('profile.rosRequired') : t('profile.ssmRequired')}
            />
          </>
        )}

        {/* Terms & Actions */}
        <Spacing size="lg" />
        <TextLine size="sm" align="center" color="text-gray-600">
          {t('profile.termsPrefix')} {" "}
          <Hyperlink href="/terms" inline>
            {t('profile.terms')}
          </Hyperlink>{" "}
          {t('profile.and')} {" "}
          <Hyperlink href="/privacy" inline>
            {t('profile.privacy')}
          </Hyperlink>
        </TextLine>

        <FormActions>
          <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {t('profile.saveChanges')}
          </Button>
        </FormActions>
      </FormWrapper>

      <ConfirmDialog
        open={showCancelDialog}
        title="Discard changes?"
        description="Your unsaved changes will be lost. Are you sure you want to leave this page?"
        confirmText="Yes, discard"
        cancelText="Stay"
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          router.push("/dashboard");
        }}
      />
    </SidebarContent>
  );
}
