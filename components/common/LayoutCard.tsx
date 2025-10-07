import { ReactNode } from 'react';

/**
 * LayoutCard
 * Unified card container styling used across authentication pages and main app content.
 * Centralizes border, radius, ring, padding, and background so future theme tweaks are single-source.
 */
type PaddingVariant = 'none' | 'sm' | 'md' | 'lg';

const paddingClasses: Record<PaddingVariant, string> = {
  none: 'p-0',
  sm: 'p-4 sm:p-5',
  md: 'p-6 sm:p-8',
  lg: 'p-8 sm:p-10',
};

export default function LayoutCard({
  children,
  className = '',
  padding = 'md',
}: {
  children: ReactNode;
  className?: string;
  padding?: PaddingVariant;
}) {
  return (
    <div className={`bg-white text-gray-800 rounded-2xl shadow-sm border border-[#B01C2F] ring-1 ring-[#B01C2F]/10 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
