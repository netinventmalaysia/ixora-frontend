// pages/landing.tsx
import Head from "next/head";
import Image from "next/image";
import { useMemo, useState } from "react";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useTranslation } from "@/utils/i18n";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`IXORA MBMB — ${t('landing.hero.title', 'Smarter Governance, Smoother Community')}`}</title>
        <meta
          name="description"
          content={t(
            "landing.meta.description",
            "IXORA MBMB is MBMB’s all-in-one digital ecosystem: pay bills, manage permits, track requests, and access city services in one place."
          )}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Language switcher — fixed, subtle */}
      {/* <LanguageSelector className="!static fixed right-3 top-20 sm:top-24" /> */}

      <Navbar />

      <main className="relative overflow-hidden">
        <Hero />
        <Benefits />
        <ComponentsGrid />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

/* ========================= NAVBAR ========================= */
function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const nav = [
    { label: t("landing.nav.intro", "Introduction"), href: "#intro" },
    { label: t("landing.nav.benefits", "Benefits"), href: "#benefits" },
    { label: t("landing.nav.components", "Components"), href: "#components" },
    { label: t("landing.nav.faq", "FAQ"), href: "#faq" },
    { label: t("landing.nav.contact", "Contact"), href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="IXORA MBMB" width={28} height={28} className="h-7 w-auto" priority />
          <span className="text-sm font-semibold tracking-wide">IXORA MBMB</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            {t("landing.nav.cta", "Contact Us")}
          </a>
        </nav>

        <button
          aria-label="Open menu"
          onClick={() => setOpen((s) => !s)}
          className="inline-flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800 md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              {t("landing.nav.cta", "Contact Us")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ========================= HERO ========================= */
function Hero() {
  const { t } = useTranslation();
  const stats = [
    { label: t("landing.hero.uptime", "Uptime"), value: "98.9%" },
    { label: t("landing.hero.transactions", "Transactions"), value: "150k+" },
    { label: t("landing.hero.security", "Security"), value: "PDPA-Act" },
  ];

  return (
    <section
      id="intro"
      className="relative isolate overflow-hidden bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950"
    >
      {/* subtle blob */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu blur-3xl">
        <div className="mx-auto h-56 w-[36rem] rounded-full bg-gradient-to-r from-sky-300 via-fuchsia-300 to-teal-300 opacity-25" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24">
        {/* copy */}
        <div className="place-self-center lg:col-span-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">IXORA MBMB</h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            {t(
              "landing.hero.subtitle",
              "Smarter Governance, Smoother Community—one digital gateway for residents, businesses, tourists, and the local community."
            )}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="login"
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              {t("landing.cta.getStarted", "Get Started")}
            </a>
            <a
              href="#benefits"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {t("landing.cta.explore", "Explore Features")}
            </a>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <dt className="text-xs text-gray-500">{s.label}</dt>
                <dd className="mt-1 text-lg font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* image */}
        <div className="flex items-center justify-center lg:col-span-6">
          <div className="relative aspect-[4/3] w-full max-w-md sm:max-w-lg lg:max-w-xl">
            <Image
              src="/images/mascot.png"
              alt="IXORA mascot"
              fill
              priority
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================= BENEFITS ========================= */
function Benefits() {
  const { t } = useTranslation();
  const items = [
    { title: t("landing.benefits.oneStop", "One-Stop Center"), desc: t("landing.benefits.oneStopDesc", "Access all services in one portal."), icon: "🏛️" },
    { title: t("landing.benefits.anytime", "24/7 Access"), desc: t("landing.benefits.anytimeDesc", "Available anytime, anywhere."), icon: "🕒" },
    { title: t("landing.benefits.counterless", "Counterless"), desc: t("landing.benefits.counterlessDesc", "No physical counter visits required."), icon: "📲" },
    { title: t("landing.benefits.transparent", "Transparent"), desc: t("landing.benefits.transparentDesc", "Real-time status & notifications."), icon: "🔎" },
    { title: t("landing.benefits.dataDriven", "Data-Driven"), desc: t("landing.benefits.dataDrivenDesc", "Smart analytics & dashboards."), icon: "📊" },
    { title: t("landing.benefits.secure", "Secure"), desc: t("landing.benefits.secureDesc", "MBMB Private Cloud & controls."), icon: "🔐" },
  ];

  return (
    <section id="benefits" className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">{t("landing.benefits.title", "Key Benefits")}</h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-lg group-hover:scale-105">
                <span aria-hidden>{b.icon}</span>
              </div>
              <h3 className="text-base font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= COMPONENTS GRID ========================= */
function ComponentsGrid() {
  const { t } = useTranslation();
  const components = [
    { name: t("landing.components.portal", "Portal"), blurb: t("landing.components.portalDesc", "Central hub for city services."), icon: "🧭" },
    { name: t("landing.components.mobile", "Mobile App"), blurb: t("landing.components.mobileDesc", "Services on the go."), icon: "📱" },
    { name: t("landing.components.ai", "AI Assistant"), blurb: t("landing.components.aiDesc", "Smart help & suggestions."), icon: "🤖" },
    { name: t("landing.components.workspace", "Workspace"), blurb: t("landing.components.workspaceDesc", "Staff & department tools."), icon: "🗂️" },
    { name: t("landing.components.access", "Access"), blurb: t("landing.components.accessDesc", "Single sign-on & identity."), icon: "🔑" },
    { name: t("landing.components.notify", "NotifyMe"), blurb: t("landing.components.notifyDesc", "Alerts & status updates."), icon: "🔔" },
    { name: t("landing.components.cloud", "Private Cloud"), blurb: t("landing.components.cloudDesc", "Secure MBMB infrastructure."), icon: "☁️" },
    { name: t("landing.components.analytics", "Analytics"), blurb: t("landing.components.analyticsDesc", "KPIs & performance boards."), icon: "📈" },
    { name: t("landing.components.identity", "Identity"), blurb: t("landing.components.identityDesc", "Citizen & business profiles."), icon: "🪪" },
  ];

  return (
    <section id="components" className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">{t("landing.components.title", "IXORA MBMB Components")}</h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((c) => (
            <div key={c.name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-2 text-2xl">{c.icon}</div>
              <h3 className="text-base font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{c.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= FAQ ========================= */
function FAQ() {
  const { t } = useTranslation();
  const items = useMemo(
    () => [
      {
        q: t("landing.faq.q1", "What is IXORA MBMB?"),
        a: t(
          "landing.faq.a1",
          "IXORA MBMB is MBMB’s all-in-one digital ecosystem—more than a payment portal. It brings services, permits, requests, identity, analytics, and notifications into one place."
        ),
      },
      { q: t("landing.faq.q2", "Who can use it?"), a: t("landing.faq.a2", "Residents, businesses, tourists, and the local community.") },
      {
        q: t("landing.faq.q3", "How does it benefit citizens & businesses?"),
        a: t("landing.faq.a3", "Faster self-service, transparent status, digital payments, fewer counter visits, and 24/7 availability."),
      },
      { q: t("landing.faq.q4", "Is it secure?"), a: t("landing.faq.a4", "Yes. IXORA runs on MBMB’s private cloud with strict access controls and compliance. ISO-ready practices are followed.") },
      {
        q: t("landing.faq.q5", "What modules are available?"),
        a: t("landing.faq.a5", "Assessment Tax, Compounds, Booth Rentals, Permits & Licences, Notifications, Analytics, Identity, and more rolling out."),
      },
    ],
    [t]
  );

  return (
    <section id="faq" className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">{t("landing.faq.title", "Frequently Asked Questions")}</h2>
        <div className="mt-8 space-y-3">
          {items.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
      >
        <span className="font-medium">{q}</span>
        <svg className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300">{a}</p>}
    </div>
  );
}

/* ========================= CONTACT ========================= */
function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">{t("landing.contact.title", "Contact Us")}</h2>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-base font-semibold">{t("landing.contact.address", "Address")}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Majlis Bandaraya Melaka Bersejarah (MBMB) <br />
              Jalan Graha Maju, 75450 Melaka
            </p>
            <div className="mt-4 flex gap-2">
              <a
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
              >
                Google Maps
              </a>
              <a
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-base font-semibold">{t("landing.contact.contact", "Contact")}</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <strong>{t("landing.contact.phone", "Phone")}:</strong> +60 X-XXXX XXXX
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a className="text-gray-900 underline-offset-2 hover:underline dark:text-white" href="mailto:ixora@mbmb.gov.my">
                  ixora@mbmb.gov.my
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-900 to-black p-6 text-white shadow-sm dark:border-gray-800">
            <h3 className="text-base font-semibold">{t("landing.join.title", "Join MBMB’s Digital Community")}</h3>
            <p className="mt-2 text-sm text-gray-200">
              {t("landing.join.desc", "Create your IXORA MBMB account and experience seamless municipal services.")}
            </p>
            <div className="mt-4 flex gap-2">
              <a href="#" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100">
                {t("landing.join.register", "Register")}
              </a>
              <a href="login" className="rounded-md border border-white/30 px-3 py-1.5 text-sm text-white hover:bg-white/10">
                {t("landing.join.login", "Log In")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================= FOOTER ========================= */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-gradient-to-b from-gray-900 to-black text-gray-300 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="IXORA MBMB" width={22} height={22} className="h-5 w-auto" />
            <span className="text-sm font-semibold text-white">IXORA MBMB</span>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Status
            </a>
            <a href="#" className="hover:text-white">
              Help
            </a>
          </nav>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {year} MBMB — Melaka Smart City Digital Ecosystem. All rights reserved.
        </p>
      </div>
    </footer>
  );
}