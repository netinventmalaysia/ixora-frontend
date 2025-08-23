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
  // Use clientLang if set; otherwise default to server language 'en'.
  // IMPORTANT: do NOT read localStorage here — reading it during client render
  // can cause the client to render different HTML than the server and
  // trigger hydration mismatches.
  const lang = clientLang || 'en';
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
  // Start with server default so initial client render matches SSR.
  const [lang, setLang] = useState<string>('en');

  useEffect(() => {
    // On mount read stored preference and update clientLang and state.
    try {
      const stored = (localStorage.getItem('ixora:lang') as string) || 'en';
      clientLang = stored;
      setLang(stored);
    } catch (err) {
      clientLang = 'en';
      setLang('en');
    }

    const handler = (e: Event) => {
      try {
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
