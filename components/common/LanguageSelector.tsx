import React from 'react';
import { useTranslation, setLanguage } from '@/utils/i18n';

type Props = {
  codes?: string[];
  className?: string;
};

export default function LanguageSelector({ codes = ['en', 'ms', 'zh', 'ta'], className = '' }: Props) {
  const { lang } = useTranslation();

  return (
    <div className={`absolute top-0 right-0 z-50 ${className}`}>
      <div className="inline-flex rounded bg-white/80 shadow-sm p-0.5">
        {codes.map((code) => (
          <button
            key={code}
            aria-label={`Select ${code}`}
            onClick={() => setLanguage(code)}
            className={`px-3 py-1 text-xs font-medium ${lang === code ? 'bg-[#B01C2F] text-white rounded' : 'text-gray-700'}`}
          >
            {code === 'en' ? 'EN' : code === 'ms' ? 'MY' : code === 'zh' ? 'CN' : 'TA'}
          </button>
        ))}
      </div>
    </div>
  );
}
