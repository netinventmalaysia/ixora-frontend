import React from 'react';

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-md border border-gray-200 p-4 ${className}`}>{children}</div>
  );
}
