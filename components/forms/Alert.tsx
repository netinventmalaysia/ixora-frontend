import React from 'react';

export default function Alert({ children, variant = 'error' }: { children: React.ReactNode; variant?: 'error' | 'info' }) {
  const classes = variant === 'error' ? 'rounded-md bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200' : 'rounded-md bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-gray-200';
  return <div className={classes}>{children}</div>;
}
