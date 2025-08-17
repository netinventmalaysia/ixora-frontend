import React from 'react';

export default function Stack({ children, gap = '4' }: { children: React.ReactNode; gap?: string }) {
  return <div className={`space-y-${gap}`}>{children}</div>;
}
