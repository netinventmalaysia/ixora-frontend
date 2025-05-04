type FormRowProps = {
    children: React.ReactNode;
    columns?: number; // 1, 2 or 3
    gapX?: string; // Override horizontal gap if needed
    gapY?: string;
    className?: string; // For additional custom classes
  };
  
  export default function FormRow({
    children,
    columns = 2,
    gapX = "gap-x-6",
    gapY = "gap-y-8",
    className = "",
  }: FormRowProps) {
    let gridClass = "sm:grid-cols-6"; // default: 2 fields (3+3)
  
    if (columns === 1) gridClass = "sm:grid-cols-3";
    if (columns === 3) gridClass = "sm:grid-cols-9"; // 3 fields (3+3+3)
  
    return (
      <div className={`w-full grid grid-cols-1 ${gapX} ${gapY} ${gridClass} ${className}`}>
        {children}
      </div>
    );
  }