"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "@/utils/i18n";
import {
ArrowRightOnRectangleIcon,
CreditCardIcon,
DevicePhoneMobileIcon,
} from "@heroicons/react/24/solid";
import HeroCarousel from "@/components/common/HeroCarousel";
import { triggerPWAInstall } from "@/components/common/PWAInstallPrompt";

const PRIMARY = "#B01C2F";

type HeroProps = {
todayTransactions?: number;
};

export default function Hero({ todayTransactions = 1532 }: HeroProps) {
const { t } = useTranslation();
const [pulse, setPulse] = useState(false);

useEffect(() => {
const interval = setInterval(() => {
setPulse(true);
setTimeout(() => setPulse(false), 500);
}, 2500);
return () => clearInterval(interval);
}, []);

return (
<section id="intro" className="relative isolate overflow-hidden bg-white">
  <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10 mb-25">
    <div
      className="grid min-h-[68vh] grid-cols-1 items-center gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-24 2xl:py-28">
      {/* Left */}
      <div className="lg:col-span-6">
        {/* 🔹 Dua logo di atas tajuk */}
        <div className="mb-4 flex items-center gap-4">
          <Image src="/images/logo.png" alt="IXORA Logo" width={70} height={70} className="object-contain" priority />
          {/* Pipe separator */}
          <div className="h-8 w-px bg-gray-300 sm:h-14" aria-hidden="true" />
          <Image src="/images/logo-mbmb.png" alt="MBMB Logo" width={60} height={60} className="object-contain"
            priority />
          <div className="h-8 w-px bg-gray-300 sm:h-14" aria-hidden="true" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-[56px] xl:leading-[1.1]">
            <span className="text-[#B01C2F]">IXORA</span>{" "}
            <span className="text-[#005C76]">MBMB</span>
          </h1>
        </div>

        {/*
        <hr className="my-4 border-gray-300" /> */}

        <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
          {t("landing.hero.subtitle", "Smarter Governance, Seamless Community")}
        </p>

        <p className="mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
          <strong>
            {t(
            "landing.hero.tagline",
            "Built with Trust · Powered by Melaka Historic City Council · Inspired for You"
            )}
          </strong>
        </p>

        {/* CTA Buttons + Live Pulse wrapper */}
        <div className="mt-6 w-full max-w-md sm:max-w-lg">
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Primary: start digital services */}
            <Link href="/login" prefetch={false} aria-label={t("landing.hero.ctaPrimary", "Start Digital Services" )}
              className="inline-flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-lg bg-[#B01C2F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#951325] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F] focus-visible:ring-offset-2">
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-white" aria-hidden="true" />
            {t("landing.hero.ctaPrimary", "Start Digital Services")}
            </Link>

            {/* Secondary: download IXORA app */}
            <button type="button" onClick={()=> triggerPWAInstall()}
              aria-label={t("landing.hero.ctaSecondary", "Download IXORA MBMB")}
              className="inline-flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-lg border
              border-[#B01C2F] bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition
              hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]
              focus-visible:ring-offset-2"
              >
              <DevicePhoneMobileIcon className="h-5 w-5 text-[#B01C2F]" aria-hidden="true" />
              {t("landing.hero.ctaSecondary", "Download IXORA MBMB")}
            </button>

            {/* Optional: EasyPay */}
            <a href="signup" aria-label="Easy Pay"
              className="inline-flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-lg border border-[#B01C2F] bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F] focus-visible:ring-offset-2">
              <CreditCardIcon className="h-5 w-5 text-[#B01C2F]" aria-hidden="true" />
              {t("landing.hero.ctaEasyPay", "Register Now")}
            </a>
          </div>

          {/* Live Pulse */}
          <div className="mt-6 w-full rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md"
            style={{ borderColor: PRIMARY }}>
            <div className="flex items-start gap-3">
              <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border
                transition-transform duration-300 ${ pulse ? "scale-110" : "scale-100" }`}
                style={{ borderColor: PRIMARY }} aria-hidden="true">
                <Image src="/images/logo-mbmb.png" alt="MBMB Logo" width={28} height={28} className="object-contain"
                  priority />
              </div>

              <div className="space-y-0 mt-2">
                <div className="flex items-center gap-2">
                  <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                    <span className={`h-3 w-3 rounded-full ${ pulse ? "animate-[ping_0.6s_ease-out_1]" : "animate-pulse"
                      }`} style={{ background: PRIMARY }} aria-hidden="true" />
                  </h4>
                  <span className="text-xs text-gray-500">
                    {t("landing.hero.PulseToday", "Pulse today active")}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-gray-600">
                  {t("landing.hero.livePulse", "Terima kasih!")}{" "}
                  <strong>{todayTransactions.toLocaleString()}</strong>{" "}
                  {t(
                  "landing.hero.livePulseSuffix",
                  "transaksi hari ini menyalakan tenaga saya."
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* End Live Pulse */}
        </div>
      </div>

      {/* Right Illustration → Carousel */}
      <div className="lg:col-span-6">
        <HeroCarousel slides={[ { src: "/images/ixora-bill.png" , alt: t("landing.hero.title", "IXORA MBMB" ) }, {
          src: "/images/ixora-digital.png" , alt: "Digital Governance" }, { src: "/images/ixora-hai.png" ,
          alt: "IXORA Greetings" }, { src: "/images/ixora-flag.png" , alt: "IXORA Melaka Flag" }, {
          src: "/images/ixora-mobile.png" , alt: "IXORA Mobile App" }, { src: "/images/ixora-run.png" , alt: "IXORA Run"
          }, { src: "/images/ixora-hero.png" , alt: "IXORA Hero" }, ]} aspect="aspect-[5/4]"/>
      </div>
    </div>
  </div>

  {/* Decorative gradient */}
  <div aria-hidden="true"
    className="pointer-events-none absolute -top-24 right-0 -z-10 h-56 w-56 rounded-full opacity-10 blur-3xl"
    style={{ background: PRIMARY }} />
</section>
);
}