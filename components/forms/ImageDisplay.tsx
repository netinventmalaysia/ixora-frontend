import Image from "next/image";

type ImageDisplayProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  rounded?: boolean;
  shadow?: boolean;
  bordered?: boolean;
  className?: string;
  align?: "left" | "center" | "right"; // NEW: Alignment
};

export default function ImageDisplay({
  src,
  alt,
  width = 300,
  height = 200,
  rounded = true,
  shadow = true,
  bordered = false,
  className = "",
  align = "center",
}: ImageDisplayProps) {
  const styleClasses = [
    rounded ? "rounded-xl" : "",
    shadow ? "shadow-md" : "",
    bordered ? "border border-gray-200" : "",
    className,
  ].join(" ");

  const alignmentClass =
    align === "left"
      ? "justify-start"
      : align === "right"
      ? "justify-end"
      : "justify-center";

  return (
    <div className={`flex ${alignmentClass}`}>
      <div className={`overflow-hidden ${styleClasses}`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          layout="intrinsic"
          objectFit="cover"
        />
      </div>
    </div>
  );
}
