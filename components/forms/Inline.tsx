import React from 'react';

export default function Inline({ children, gap = '3' }: { children: React.ReactNode; gap?: string }) {
  return <div className={`flex gap-${gap}`}>{children}</div>;
}
