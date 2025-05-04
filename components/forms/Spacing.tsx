// components/Spacing.tsx
type SpacingProps = {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "custom";
    customHeight?: string; // e.g., "50px" or "3rem"
  };
  
  export default function Spacing({ size = "sm", customHeight }: SpacingProps) {
    let heightClass = "";
  
    if (size === "custom" && customHeight) {
      return <div style={{ height: customHeight }} />;
    }
  
    switch (size) {
      case "xs":
        heightClass = "h-2";
        break;
      case "sm":
        heightClass = "h-4";
        break;
      case "md":
        heightClass = "h-6";
        break;
      case "lg":
        heightClass = "h-8";
        break;
      case "xl":
        heightClass = "h-12";
        break;
      case "2xl":
        heightClass = "h-16";
        break;
      default:
        heightClass = "h-6";
    }
  
    return <div className={heightClass} />;
  }
  