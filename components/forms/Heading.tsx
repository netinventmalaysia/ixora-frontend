import { JSX, ReactNode } from "react";
import classNames from "classnames";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  className?: string;
};

export default function Heading({
  level = 2,
  children,
  align = 'left',
  bold = true,
  className = '',
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const baseClass = classNames(
    'tracking-tight text-gray-900',
    {
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right',
      'font-bold': bold,
      'font-normal': !bold,
    },
    {
      'text-3xl': level === 1,
      'text-2xl': level === 2,
      'text-xl': level === 3,
      'text-lg': level === 4,
      'text-base': level === 5,
      'text-sm': level === 6,
    },
    className
  );

  return <Tag className={baseClass}>{children}</Tag>;
}
