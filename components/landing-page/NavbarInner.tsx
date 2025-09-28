"use client";
import Image from "next/image";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useTranslation } from "@/utils/i18n";

const PRIMARY = "#B01C2F";
const PRIMARY_HOVER = "#951325";

export default function NavbarInner() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 2xl:px-10">
        {/* Logo + Back to Main */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="IXORA MBMB"
              width={24}
              height={24}
              className="h-7 w-auto"
              priority
            />
            <span className="text-sm font-semibold tracking-wide text-gray-900 2xl:text-base">
              {t("landing.hero.title", "IXORA MBMB")}
            </span>
          </a>
          {/* <a
            href="/"
            className="ml-4 inline-flex items-center rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-white"
            style={{ backgroundColor: PRIMARY }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)
            }
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
          >
            ← {t("backToMain", "Back to Main")}
          </a> */}
        </div>

        {/* Language Selector on the right */}
        <LanguageSelector className="!static" />
      </div>
    </header>
  );
}
