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
import { triggerPWAInstall } from "@/components/common/PWAInstallPrompt";

const PRIMARY = "#B01C2F";

export default function Hero() {
  const { t } = useTranslation();

  const [pulse, setPulse] = useState(false);

  // Simulasi denyutan robot (setiap 2.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: t("landing.hero.stats.uptime", "Uptime"), value: "99.9%" },
    { label: t("landing.hero.stats.transactions", "Transactions"), value: "150k+" },
    {
      label: t("landing.hero.stats.energy", "Digital Pulse"),
      value: (
        <div className="flex flex-col items-center justify-center">
          <div
            className={`h-8 w-8 rounded-xl border flex items-center justify-center transition-transform ${
              pulse ? "scale-110" : "scale-100"
            }`}
            style={{ borderColor: PRIMARY }}
          >
            <span className="text-lg" role="img" aria-label="IXORA Bot">
              🤖
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                pulse ? "animate-[ping_0.6s_ease-out_1]" : "animate-pulse"
              }`}
              style={{ background: PRIMARY }}
            />
            <span className="text-[11px] text-gray-600">Active</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="intro" className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="grid min-h-[68vh] grid-cols-1 items-center gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-24 2xl:py-28">
          {/* Left */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#B01C2F] sm:text-5xl xl:text-[56px] xl:leading-[1.1]">
              {t("landing.hero.title", "IXORA MBMB")}
            </h1>

            <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              {t("landing.hero.subtitle", "Smarter Governance, Smoother Community")}
            </p>

            <p className="mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
              <strong>
                {t("landing.hero.tagline", "Built with Trust · Powered by MBMB · Inspired for You")}
              </strong>
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {/* Login */}
              <Link
                href="/login"
                prefetch={false}
                aria-label="Login"
                className="inline-flex items-center gap-2 rounded-lg bg-[#B01C2F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#951325] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F] focus-visible:ring-offset-2"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                {t("landing.hero.ctaLogin", "Login Here !")}
              </Link>

              {/* Install PWA */}
              <button
                type="button"
                onClick={() => triggerPWAInstall()}
                aria-label="Install PWA"
                className="inline-flex items-center gap-2 rounded-lg border border-[#B01C2F] bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F] focus-visible:ring-offset-2"
              >
                <DevicePhoneMobileIcon className="h-5 w-5 text-[#B01C2F]" aria-hidden="true" />
                {t("landing.hero.ctaPwa", "Install PWA")}
              </button>

              {/* Download Apps */}
              <a
                href="#"
                aria-label="Mobile Apps"
                className="inline-flex items-center gap-2 rounded-lg border border-[#B01C2F] bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F] focus-visible:ring-offset-2"
              >
                <DevicePhoneMobileIcon className="h-5 w-5 text-[#B01C2F]" aria-hidden="true" />
                {t("landing.hero.ctaDownload", "Mobile Apps")}
              </a>

              {/* EasyPay */}
              <a
                href="#"
                aria-label="Easy Pay"
                className="inline-flex items-center gap-2 rounded-lg border border-[#B01C2F] bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F] focus-visible:ring-offset-2"
              >
                <CreditCardIcon className="h-5 w-5 text-[#B01C2F]" aria-hidden="true" />
                {t("landing.hero.ctaEasyPay", "Easy Pay")}
              </a>
            </div>

            {/* KPI Stats */}
            <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 lg:max-w-none">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border bg-white p-4 text-center shadow-sm hover:shadow-md transition"
                  style={{ borderColor: PRIMARY }}
                >
                  <dt className="text-[11px] tracking-wide text-gray-500">{s.label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold text-gray-900 sm:text-xl flex justify-center">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Illustration */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-xl sm:max-w-2xl 2xl:max-w-3xl">
              <Image
                src="/images/ixora-bill.png"
                alt={t("landing.hero.title", "IXORA MBMB")}
                fill
                priority
                className="object-contain drop-shadow"
                sizes="(min-width: 1280px) 768px, (min-width: 640px) 600px, 90vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 -z-10 h-56 w-56 rounded-full opacity-10 blur-3xl"
        style={{ background: PRIMARY }}
      />
    </section>
  );
}