import Image from "next/image";
import { useTranslation } from "@/utils/i18n";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#B01C2F] text-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center gap-4 text-xs sm:text-sm overflow-x-auto">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="IXORA MBMB" width={18} height={18} />
            <span className="font-semibold">{t("landing.hero.title", "IXORA MBMB")}</span>
          </div>

          <span className="opacity-50">•</span>

          <nav className="flex items-center gap-4">
            <a href="#privacy" className="opacity-90 hover:opacity-100">{t("privacy", "Privacy")}</a>
            <a href="#terms" className="opacity-90 hover:opacity-100">{t("terms", "Terms")}</a>
            {/* <a href="#status" className="opacity-90 hover:opacity-100">{t("status", "Status")}</a>
            <a href="#help" className="opacity-90 hover:opacity-100">{t("help", "Help")}</a> */}
          </nav>

          <span className="ml-auto opacity-90">
            © {year} {t("landing.footer.text", "IXORA MBMB – Digital Ecosystem")}
          </span>
        </div>
      </div>
    </footer>
  );
}
