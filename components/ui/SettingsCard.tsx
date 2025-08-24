import React, { ReactNode } from 'react';

type Props = {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function SettingsCard({ title, description, children, className = '' }: Props) {
  return (
    <div className={`bg-white shadow sm:rounded-lg p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      {description ? <p className="mt-1 text-xs text-gray-500">{description}</p> : null}
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function SettingsCardRow({
  label,
  status,
  children,
  className = '',
}: {
  label?: React.ReactNode;
  status?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-x-4 ${className}`}>
      {label ? <div className="text-sm text-gray-700">{label}</div> : null}
      {status ? (
        <div className="text-sm text-gray-700">Status: <strong className="ml-1">{status}</strong></div>
      ) : null}
      <div className="ml-auto">{children}</div>
    </div>
  );
}
