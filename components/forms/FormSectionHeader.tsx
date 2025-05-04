type FormSectionHeaderProps = {
    title: string;
    description?: string;
  };
  
  export default function FormSectionHeader({ title, description }: FormSectionHeaderProps) {
    return (
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>
    );
  }