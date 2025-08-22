import en from '@/locales/en.json';
import ms from '@/locales/ms.json';
import zh from '@/locales/zh.json';

type Locales = { [k: string]: any };

const LOCALES: { [lang: string]: Locales } = {
  en,
  ms,
  zh,
};

export function getLanguage(): string {
  try {
    return (localStorage.getItem('ixora:lang') as string) || 'en';
  } catch (e) {
    return 'en';
  }
}

export function setLanguage(lang: string) {
  try {
    localStorage.setItem('ixora:lang', lang);
    try {
      window.dispatchEvent(new CustomEvent('ixora:languagechange', { detail: { lang } }));
    } catch (e) {}
  } catch (e) {}
}

export default function t(key: string, fallback?: string) {
  const lang = getLanguage() || 'en';
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
