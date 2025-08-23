import en from '@/locales/en.json';
import ms from '@/locales/ms.json';
import zh from '@/locales/zh.json';
import { useEffect, useState } from 'react';

type Locales = { [k: string]: any };

const LOCALES: { [lang: string]: Locales } = {
  en,
  ms,
  zh,
};

// default language used for SSR
let clientLang: string | null = null;

export function getLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  try {
    return clientLang || (localStorage.getItem('ixora:lang') as string) || 'en';
  } catch (e) {
    return 'en';
  }
}

export function setLanguage(lang: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ixora:lang', lang);
    clientLang = lang;
    try {
      window.dispatchEvent(new CustomEvent('ixora:languagechange', { detail: { lang } }));
    } catch (e) {}
  } catch (e) {}
}

export function t(key: string, fallback?: string) {
  const lang = (typeof window === 'undefined') ? 'en' : getLanguage() || 'en';
  const dict = LOCALES[lang] || LOCALES.en;

  const parts = key.split('.');
  let cur: any = dict;
  for (const p of parts) {
    if (!cur) break;
    cur = cur[p];
  }
  if (cur == null) return fallback ?? key;
  return cur;
}

// React hook for client components to re-render on language change
export function useTranslation() {
  const [lang, setLang] = useState<string>(() => {
    if (typeof window === 'undefined') return 'en';
    try {
      return (localStorage.getItem('ixora:lang') as string) || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        // read current lang from storage
        const l = (localStorage.getItem('ixora:lang') as string) || 'en';
        clientLang = l;
        setLang(l);
      } catch (err) {}
    };
    window.addEventListener('ixora:languagechange', handler as EventListener);
    return () => window.removeEventListener('ixora:languagechange', handler as EventListener);
  }, []);

  return { t: (k: string, f?: string) => t(k, f), lang };
}

export default t;
