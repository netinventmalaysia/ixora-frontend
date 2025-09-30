"use client";
import Image from "next/image";
import { useTranslation } from "@/utils/i18n";
import { ArrowRightIcon, CreditCardIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/solid";

const PRIMARY = "#B01C2F";

export default function Hero() {
const { t } = useTranslation();

const stats = [
{ label: t("landing.hero.stats.uptime", "Uptime"), value: "99.9%" },
{ label: t("landing.hero.stats.transactions", "Transactions"), value: "150k+" },
{ label: t("landing.hero.stats.security", "Security"), value: "PDPA-Act" },
];

return (
<section id="intro" className="relative isolate overflow-hidden bg-white">
  <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10">
    <div
      className="grid grid-cols-1 items-center gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-24 2xl:py-28 min-h-[68vh]">
      <div className="lg:col-span-6">
        <h1
          className="text-4xl font-extrabold tracking-tight text-[#B01C2F] sm:text-5xl xl:text-[56px] xl:leading-[1.1]">
          {t("landing.hero.title", "IXORA MBMB")}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
          {t("landing.hero.subtitle", "Smarter Governance, Smoother Community")}
        </p>
        <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
          <strong>{t("landing.hero.tagline", "Built with Trust · Powered by MBMB · Inspired for You")}</strong>
        </p>

        {/* Get Started Button */}
        {/* CTA Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-[#B01C2F] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#951325] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B01C2F] transition"
          >
            <ArrowRightIcon className="h-5 w-5 text-white" />
            {t("landing.hero.ctaPrimary", "Start Digital Services")}
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-[#B01C2F] bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B01C2F] transition"
          >
            <CreditCardIcon className="h-5 w-5 text-[#B01C2F]" />
            {t("landing.hero.ctaEasyPay", "EasyPay")}
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-[#B01C2F] bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B01C2F] transition"
          >
            <DevicePhoneMobileIcon className="h-5 w-5 text-[#B01C2F]" />
            {t("landing.hero.ctaSecondary", "IXORA MBMB App")}
          </a>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 lg:max-w-none">
          {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-4 text-center shadow-sm">
            <dt className="text-[11px] tracking-wide text-gray-500">
              {s.label}
            </dt>
            <dd className="mt-0.5 text-lg font-semibold text-gray-900 sm:text-xl">
              {s.value}
            </dd>
          </div>
          ))}
        </dl>
      </div>
      <div className="lg:col-span-6">
        <div className="relative mx-auto aspect-[5/4] w-full max-w-xl sm:max-w-2xl 2xl:max-w-3xl">
          <Image src="/images/ixora-bill.png" alt={t("landing.hero.title", "IXORA MBMB" )} fill priority
            className="object-contain drop-shadow" />
        </div>
      </div>
    </div>
  </div>
</section>
);
}