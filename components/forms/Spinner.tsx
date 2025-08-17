import React from 'react';

export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <svg className="size-5 animate-spin" viewBox="0 0 24 24" aria-hidden>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a 8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
}
