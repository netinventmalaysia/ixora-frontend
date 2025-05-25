import Link from "next/link";

type HyperlinkProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  underline?: boolean;
  bold?: boolean;
  color?: string;       // Tailwind color (e.g., "text-blue-600")
  fontSize?: string;    // Tailwind text size
  className?: string;
  position?: "left" | "center" | "right"; // Alignment for block-level usage
  inline?: boolean;     // Inline usage toggle
};

export default function Hyperlink({
  href,
  children,
  external = false,
  underline = true,
  bold = false,
  color = "text-blue-600",
  fontSize = "text-sm",
  className = "",
  position = "left",
  inline = false,
}: HyperlinkProps) {
  const textAlignmentClass =
    position === "center"
      ? "text-center"
      : position === "right"
      ? "text-right"
      : "text-left";

  const baseClasses = [
    underline ? "underline" : "no-underline",
    bold ? "font-semibold" : "",
    color,
    fontSize,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const linkElement = external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClasses}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={baseClasses}>
      {children}
    </Link>
  );

  // Correct: Avoid wrapping in a block-level element if inline
  return inline ? linkElement : <div className={textAlignmentClass}>{linkElement}</div>;
}
