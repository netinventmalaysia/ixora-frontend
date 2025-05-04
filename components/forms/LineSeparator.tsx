type LineSeparatorProps = {
    marginTop?: string;   // e.g., "mt-6"
    marginBottom?: string; // e.g., "mb-6"
    colorClass?: string;   // e.g., "border-gray-300"
    thickness?: string;    // e.g., "border" or "border-2"
  };
  
  export default function LineSeparator({
    marginTop = "mt-6",
    marginBottom = "mb-6",
    colorClass = "border-gray-100",
    thickness = "border",
  }: LineSeparatorProps) {
    return (
      <div className={`${marginTop} ${marginBottom}`}>
        <div className={`${thickness} ${colorClass} w-full`} />
      </div>
    );
  }