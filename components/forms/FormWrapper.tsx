import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

export default function FormWrapper({
  onSubmit,
  children,
  defaultValues,
}: {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  defaultValues?: Record<string, any>; // allow optional default values
}) {
  const methods = useForm({ defaultValues });

  // When defaultValues change (e.g., after fetching data), reset the form
  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full max-w-3xl mx-auto">
        {children}
      </form>
    </FormProvider>
  );
}
