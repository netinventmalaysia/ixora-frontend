import { useState } from 'react';
import { useTranslation } from '@/utils/i18n';
import Button from '@/components/forms/Button';
import Image from 'next/image';

const baseNav = [
  { href: '#start', key: 'landing.nav.intro' },
  { href: '#manfaat', key: 'landing.nav.benefits' },
  { href: '#komponen', key: 'landing.nav.components' },
  { href: '#pencapaian', key: 'landing.nav.achievements' },
  { href: '#faq', key: 'landing.nav.faq' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navItems = baseNav.map(i => ({ href: i.href, label: t(i.key) }));
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#B01C2F]">
          <span className="relative inline-block h-8 w-8">
            <Image src="/images/logo.png" alt="IXORA Logo" fill sizes="32px" className="object-contain" />
          </span>
          <span>IXORA</span>
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 focus:outline-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 md:hidden"
          aria-label="Toggle navigation"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map(i => (
            <li key={i.href}>
              <a href={i.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                {i.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#hubungi">
              <Button variant="danger" size="sm" className="bg-[#B01C2F] px-4 py-2 text-white hover:bg-[#951325]">{t('landing.nav.contact')}</Button>
            </a>
          </li>
        </ul>
      </div>
      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900 md:hidden">
          <ul className="space-y-3">
            {navItems.map(i => (
              <li key={i.href}>
                <a onClick={() => setOpen(false)} href={i.href} className="block text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  {i.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#hubungi" onClick={() => setOpen(false)} className="block">
                <Button variant="danger" size="sm" className="mt-2 w-full bg-[#B01C2F] text-white hover:bg-[#951325]">Hubungi Kami</Button>
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
