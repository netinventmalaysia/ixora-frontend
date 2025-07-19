import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import LayoutWithoutSidebar from '@/components/main/LayoutWithoutSidebar';
import FormWrapper from '@/components/forms/FormWrapper';
import Heading from '@/components/forms/Heading';
import InputText from '@/components/forms/InputText';
import Button from '@/components/forms/Button';
import FormActions from '@/components/forms/FormActions';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import toast from 'react-hot-toast';
import { forgotPassword } from '@/services/api';


type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordPage() {


  const methods = useForm<ForgotPasswordFormValues>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    console.log('Form submitted:', data);
    if (submitted) return;
    try {
      await forgotPassword(data);
      setSubmitted(true);
      toast.success('Reset link sent! Please check your email.');
    } catch (error) {
      toast.error('Failed to send reset link');
    }
  };

  return (
    <LayoutWithoutSidebar>
      <FormWrapper onSubmit={onSubmit}>
        <Heading level={1} align="center" bold>
          Forgot Password
        </Heading>
        <Spacing size="md" />
        <LineSeparator />
        <Spacing size="md" />

        <InputText
          id="email"
          name="email"
          label="Email Address"
          type="email"
          requiredMessage="Email is required"
          placeholder="Enter your email address"
        />

        <Spacing size="md" />

        <FormActions>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={submitted}
          >
            {submitted ? 'Link Sent' : 'Send Reset Link'}
          </Button>
        </FormActions>

        {submitted && (
          <>
            <Spacing size="md" />
            <div className="text-green-700 font-medium text-center">
              Please check your email for the password reset link.
            </div>
          </>
        )}
      </FormWrapper>
    </LayoutWithoutSidebar>
  );
}
