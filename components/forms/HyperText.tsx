import { ReactNode } from "react";

type HyperTextProps = {
  children: ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  align?: "left" | "center" | "right";
  color?: string; // Tailwind color
  bold?: boolean;
  italic?: boolean;
  className?: string;
};

export default function HyperText({
  children,
  size = "base",
  align = "left",
  color = "text-gray-800",
  bold = false,
  italic = false,
  className = "",
}: HyperTextProps) {
  const fontSizeClass = `text-${size}`;
  const alignClass = `text-${align}`;
  const fontWeightClass = bold ? "font-semibold" : "";
  const italicClass = italic ? "italic" : "";

  const classes = [
    fontSizeClass,
    alignClass,
    fontWeightClass,
    italicClass,
    color,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <p className={classes}>{children}</p>;
}