import { useState } from "react";
import Image from 'next/image';
import LanguageSelector from '@/components/common/LanguageSelector';
import { useTranslation } from '@/utils/i18n';
import FormWrapper from "todo/components/forms/FormWrapper";
import Button from 'todo/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
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
import { createUser } from "todo/services/api";
import toast from 'react-hot-toast';
import router from "next/router";
import RadioGroupField from "todo/components/forms/RadioGroupField";
import { identificationTypeList } from "todo/components/data/RadioList";
import { useFormContext, useWatch } from "react-hook-form";
import LogoSpinner from '@/components/common/LogoSpinner';


type UserProfile = {
  email: string;
  password: string;
  firstName: string;
  identificationType: string;
  identificationNumber: string;
  role: "personal";
  // Optional fields
  profilePicture?: string;
  dateOfBirth?: string; // ISO string if provided
  address?: string; // Premise / Lot / Street Address
  city?: string;
  postalcode?: string;
  country?: string;
};


export default function SignUpPage() {
  const { t } = useTranslation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      const payload: UserProfile = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        identificationType: data.identificationType,
        identificationNumber: data.identificationNumber,
        role: 'personal',
      };
      // Optional fields if present
      if (data.profilePicture) payload.profilePicture = data.profilePicture;
      if (data.dateOfBirth) {
        try { payload.dateOfBirth = data.dateOfBirth.toISOString(); } catch { /* ignore parse */ }
      }
      if (data.address) payload.address = data.address;
      if (data.city) payload.city = data.city;
      if (data.postalcode) payload.postalcode = data.postalcode;
      if (data.country) payload.country = data.country;

      await createUser(payload);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWithoutSidebar>
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60" aria-hidden="true">
          <LogoSpinner size={56} className="drop-shadow-md" title={t('common.loading')} />
        </div>
      )}
      {/* Top branding bar (logo + subtitle) */}
      <div className="relative mx-auto flex w-full max-w-4xl items-center justify-center px-6 pt-10 pb-4">
        <a href="/" className="group flex flex-col items-center focus:outline-none" aria-label="Go to homepage">
          <div className="relative mb-3 h-20 w-20 transition-transform group-hover:scale-105">
            <Image src="/images/logo.png" alt="IXORA Logo" fill sizes="80px" className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#B01C2F] group-hover:text-[#8c1423]">IXORA</h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('landing.hero.subtitle')}</p>
        </a>
      </div>
      {/* Fixed language selector aligned same as landing page */}
      <div className="fixed right-3 top-20 sm:top-24 z-50">
        <LanguageSelector className="!static" />
      </div>
      <FormWrapper onSubmit={handleSubmit}>
  <Heading level={2} align="left" bold>{t('signup.title')}</Heading>
        <Spacing size="lg" />

        <FormSectionHeader
          title={t('signup.createAccountTitle')}
          description={t('signup.createAccountDesc')}
        />
        <Spacing size="lg" />

  <InputText id="email" name="email" type="email" label={t('signup.emailLabel')} requiredMessage={t('signup.emailRequired')} />
        <Spacing size="sm" />
  <InputText id="password" name="password" label={t('form.password')} type="password" requiredMessage={t('form.passwordRequired')} showHint={true} />
        <Spacing size="lg" />

        {/* radio button add new or old IC number / passport / my tentera */}
        <RadioGroupField
          name="identificationType"
          label={t('signup.identificationType')}
          options={identificationTypeList}
          inline={true}
          requiredMessage={t('signup.identificationTypeRequired')}
        />


        <Spacing size="sm" />
        <InputText
          id="identificationNumber"
          name="identificationNumber"
          label={t('signup.identificationNumber')}
          requiredMessage={t('signup.identificationNumberRequired')}
        />

        <LineSeparator />
  <FormSectionHeader title={t('signup.userInfoTitle')} description={t('signup.userInfoDesc')} />
        <Spacing size="sm" />

        <PhotoUploadField
          name="profilePicture"
          label={t('signup.profilePicture')}
          buttonText={t('signup.uploadPhoto')}
          folder="profile_pictures"
          onUpload={(path) => console.log("Uploaded profile picture:", path)}
        />
        <Spacing size="sm" />

        <InputText id="firstName" name="firstName" label={t('form.firstName')} requiredMessage={t('form.firstNameRequired')} />
        <Spacing size="sm" />

        <DatePickerField
          name="dateOfBirth"
          label={t('signup.dateOfBirth')}
          dateFormat="dd/MM/yyyy"
          placeholder={t('signup.dateOfBirthPlaceholder')}
        />
        <Spacing size="sm" />

  <InputText id="address" name="address" label={t('signup.address', 'Premise / Lot / Street Address')} />
        <Spacing size="sm" />

        <FormRow columns={2}>
          <InputText id="city" name="city" label={t('form.city')} />
          <InputText id="postalcode" name="postalcode" label={t('form.postalCode')} />
        </FormRow>
        <Spacing size="sm" />

  <SelectField id="country" name="country" label={t('form.country')} options={countryOptions} />
        <Spacing size="sm" />

        <TextLine size="sm" align="center" color="text-gray-600">
          {t('profile.termsPrefix')} {" "}
          <Hyperlink href="/terms" inline>{t('profile.terms')}</Hyperlink> {" "}{t('profile.and')} {" "}
          <Hyperlink href="/privacy" inline>{t('profile.privacy')}</Hyperlink>.
        </TextLine>

        <FormActions>
          <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>{t('common.cancel')}</Button>
          <Button type="submit" variant="primary" loading={loading}>{t('signup.submit')}</Button>
        </FormActions>
      </FormWrapper>

      <ConfirmDialog
        open={showCancelDialog}
        title={t('signup.discardTitle')}
        description={t('signup.discardDesc')}
        confirmText={t('signup.discardConfirm')}
        cancelText={t('common.cancel')}
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          router.push('/');
        }}
      />
    </LayoutWithoutSidebar>
  );
}

