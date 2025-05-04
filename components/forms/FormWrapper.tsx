import { useForm, FormProvider } from "react-hook-form";

export default function FormWrapper({
  onSubmit,
  children,
}: {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
}) {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
        {children}
      </form>
    </FormProvider>
  );
}