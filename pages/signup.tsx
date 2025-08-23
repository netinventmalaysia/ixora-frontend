import { useState } from "react";
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


type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  identificationType: string;
  identificationNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  role: "personal";
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
};


export default function SignUpPage() {
  const { t } = useTranslation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      const payload: UserProfile = {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
        role: 'personal',
      };

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
      <FormWrapper onSubmit={handleSubmit}>
  <Heading level={2} align="left" bold>{t('signup.title')}</Heading>
        <Spacing size="lg" />

        <FormSectionHeader
          title={t('signup.createAccountTitle')}
          description={t('signup.createAccountDesc')}
        />
        <Spacing size="lg" />

  <InputText id="username" name="username" label={t('signup.username')} requiredMessage={t('signup.usernameRequired')} />
        <Spacing size="sm" />
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
          requiredMessage={t('signup.profilePictureRequired')}
          onUpload={(path) => console.log("Uploaded profile picture:", path)}
        />
        <Spacing size="sm" />

        <FormRow columns={2}>
          <InputText id="firstName" name="firstName" label={t('form.firstName')} requiredMessage={t('form.firstNameRequired')} />
          <InputText id="lastName" name="lastName" label={t('form.lastName')} requiredMessage={t('form.lastNameRequired')} />
        </FormRow>
        <Spacing size="sm" />

        <DatePickerField
          name="dateOfBirth"
          label={t('signup.dateOfBirth')}
          dateFormat="dd/MM/yyyy"
          placeholder={t('signup.dateOfBirthPlaceholder')}
          requiredMessage={t('signup.dateOfBirthRequired')}
        />
        <Spacing size="sm" />

  <InputText id="phoneNumber" name="phoneNumber" label={t('signup.phoneNumber')} prefix="+601" requiredMessage={t('signup.phoneNumberRequired')} />
        <Spacing size="sm" />

  <InputText id="address" name="address" label={t('signup.address')} requiredMessage={t('signup.addressRequired')} />
        <Spacing size="sm" />

        <FormRow columns={3}>
          <InputText id="city" name="city" label={t('form.city')} requiredMessage={t('form.cityRequired')} />
          <InputText id="state" name="state" label={t('form.state')} requiredMessage={t('form.stateRequired')} />
          <InputText id="postalcode" name="postalcode" label={t('form.postalCode')} requiredMessage={t('form.postalCodeRequired')} />
        </FormRow>
        <Spacing size="sm" />

  <SelectField id="country" name="country" label={t('form.country')} options={countryOptions} requiredMessage={t('form.countryRequired')} />
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

