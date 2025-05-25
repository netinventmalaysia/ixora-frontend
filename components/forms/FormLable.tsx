interface FormLabelProps {
    htmlFor: string;
    children: React.ReactNode;
  }
  
  export default function FormLabel({ htmlFor, children }: FormLabelProps) {
    return (
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-900">
        {children}
      </label>
    );
  }