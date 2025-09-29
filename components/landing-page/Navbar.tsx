// components/landing-page/Navbar.tsx
import Image from "next/image";
import { useState } from "react";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useTranslation } from "@/utils/i18n";

const PRIMARY = "#B01C2F";
const PRIMARY_HOVER = "#951325";

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const nav = [
    { label: t("landing.nav.intro"), href: "#intro" },
    { label: t("landing.nav.benefits"), href: "#benefits" },
    { label: t("landing.nav.components"), href: "#components" },
    { label: t("landing.nav.faq"), href: "#faq" },
    { label: t("landing.nav.contact"), href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 2xl:px-10">
        <a href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="IXORA MBMB" width={24} height={24} className="h-7 w-auto" priority />
          <span className="text-sm font-semibold tracking-wide text-gray-900 2xl:text-base">
            {t("landing.hero.title", "IXORA MBMB")}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-gray-600 hover:text-gray-900">
              {n.label}
            </a>
          ))}
          <LanguageSelector className="!static ml-1" />
        </nav>

        {/* Mobile: language + burger */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector className="!static" />
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
            className="p-2"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-200 md:hidden">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block px-4 py-2">
              {n.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}