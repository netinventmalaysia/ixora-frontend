// pages/landing.tsx
import Head from "next/head";
import Image from "next/image";
import { useMemo, useState } from "react";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useTranslation } from "@/utils/i18n";

const PRIMARY = "#B01C2F";
const PRIMARY_HOVER = "#951325";

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
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="IXORA MBMB" width={18} height={18} className="h-7 w-auto" priority />
          <span className="text-sm font-semibold tracking-wide text-gray-900">IXORA MBMB</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: PRIMARY }}
            onMouseOver={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY_HOVER))}
            onMouseOut={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY))}
          >
            {t("landing.nav.cta", "Contact")}
          </a>

          {/* Language selector right after Contact */}
          <LanguageSelector className="!static ml-1" />
        </nav>

        <button
          aria-label="Open menu"
          onClick={() => setOpen((s) => !s)}
          className="inline-flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-200 md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-md px-3 py-2 text-center text-sm font-medium text-white"
              style={{ backgroundColor: PRIMARY }}
              onMouseOver={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY_HOVER))}
              onMouseOut={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY))}
            >
              {t("landing.nav.cta", "Contact")}
            </a>

            {/* Language selector in mobile list */}
            <div className="pt-2">
              <LanguageSelector className="!static" />
            </div>
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
    { label: t("landing.hero.uptime", "Uptime"), value: "99.9%" },
    { label: t("landing.hero.transactions", "Transactions"), value: "150k+" },
    { label: t("landing.hero.security", "Security"), value: "PDPA-Act" },
  ];

  return (
    <section id="intro" className="relative isolate overflow-hidden bg-white">
      {/* top-right soft red glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-20%] -z-10 h-[36rem] w-[36rem] blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(176,28,47,0.18) 0%, rgba(176,28,47,0) 60%)",
        }}
      />

      {/* subtle grid texture (desktop only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,0.02) 40%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,0.02) 40%, transparent)",
          backgroundSize: "32px 32px",
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* desktop-friendly height and spacing */}
        <div className="grid grid-cols-1 items-center gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24 min-h-[72vh]">
          {/* Left column: copy */}
          <div className="lg:col-span-6">
            {/* small badge */}
            {/* <div
              className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide text-gray-700"
              style={{ borderColor: "#E5E7EB", backgroundColor: "#FFF1F2", color: PRIMARY }}
            >
              {t("landing.badge", "Introducing")} · IXORA Ecosystem
            </div> */}

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[52px] lg:leading-[1.1]">
              IXORA MBMB
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 lg:text-lg">
              {t(
                "landing.hero.subtitle",
                "Smarter Governance, Smoother Community — one digital gateway for residents, businesses, tourists, and the local community."
              )}
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="login"
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: PRIMARY }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
              >
                {t("landing.cta.getStarted", "Get Started")}
              </a>
              <a
                href="#benefits"
                className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                style={{ borderColor: "#E5E7EB" }}
              >
                {t("landing.cta.explore", "Explore Features")}
              </a>
            </div>

            {/* stats: cleaner on desktop, compact on mobile */}
            <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:max-w-none lg:gap-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border bg-white p-4 text-center shadow-sm"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <dt className="text-[11px] uppercase tracking-wide text-gray-500">{s.label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold text-gray-900 lg:text-xl">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right column: image (bigger on desktop, keeps aspect) */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-xl sm:max-w-2xl">
              <Image
                src="/images/ixora-hero.png"
                alt="IXORA MBMB mascot"
                fill
                priority
                className="object-contain drop-shadow"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 55vw, 720px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* bottom-left soft red glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-20%] bottom-[-30%] -z-10 h-[30rem] w-[30rem] blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,179,186,0.28) 0%, rgba(255,255,255,0) 65%)",
        }}
      />
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
    <section id="benefits" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h2 className="text-center mt-6 text-2xl font-bold sm:text-3xl text-gray-900">
          {t("landing.benefits.title", "Key Benefits")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg group-hover:scale-105"
                style={{ backgroundColor: "#FFF1F2", color: PRIMARY }}
              >
                <span aria-hidden>{b.icon}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">{b.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{b.desc}</p>
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
    <section id="components" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl text-gray-900">
          {t("landing.components.title", "IXORA MBMB Components")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div className="mb-2 text-2xl" style={{ color: PRIMARY }}>{c.icon}</div>
              <h3 className="text-base font-semibold text-gray-900">{c.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{c.blurb}</p>
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
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl text-gray-900">
          {t("landing.faq.title", "Frequently Asked Questions")}
        </h2>

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
    <div className="rounded-xl border bg-white" style={{ borderColor: "#E5E7EB" }}>
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
      >
        <span className="font-medium text-gray-900">{q}</span>
        <svg className={`h-5 w-5 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && <p className="px-4 pb-4 text-sm text-gray-600">{a}</p>}
    </div>
  );
}

/* ========================= CONTACT ========================= */
function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl text-gray-900">
          {t("landing.contact.title", "Contact Us")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Address */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E5E7EB" }}>
            <h3 className="text-base font-semibold text-gray-900">
              {t("landing.contact.address", "Address")}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Majlis Bandaraya Melaka Bersejarah (MBMB) <br />
              Jalan Graha Maju, 75450 Melaka
            </p>
            <div className="mt-4 flex gap-2">
              <a
                className="rounded-md border px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
                style={{ borderColor: "#E5E7EB" }}
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
              >
                Google Maps
              </a>
              <a
                className="rounded-md border px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
                style={{ borderColor: "#E5E7EB" }}
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E5E7EB" }}>
            <h3 className="text-base font-semibold text-gray-900">
              {t("landing.contact.contact", "Contact")}
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li>
                <strong>{t("landing.contact.phone", "Phone")}:</strong> +60 X-XXXX XXXX
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a className="text-gray-900 underline-offset-2 hover:underline" href="mailto:ixora@mbmb.gov.my">
                  ixora@mbmb.gov.my
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E5E7EB" }}>
            <h3 className="text-base font-semibold text-gray-900">
              {t("landing.join.title", "Join MBMB’s Digital Community")}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {t("landing.join.desc", "Create your IXORA MBMB account and experience seamless municipal services.")}
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-white"
                style={{ backgroundColor: PRIMARY }}
                onMouseOver={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY_HOVER))}
                onMouseOut={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY))}
              >
                {t("landing.join.register", "Register")}
              </a>
              <a
                href="login"
                className="rounded-md border px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
                style={{ borderColor: "#E5E7EB" }}
              >
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
    <footer className="bg-[#B01C2F] text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-12 items-center gap-4 overflow-x-auto whitespace-nowrap text-xs sm:text-sm">
          {/* brand */}
          <div className="flex items-center gap-2 shrink-0">
            <Image src="/images/logo.png" alt="IXORA MBMB" width={18} height={18} className="h-4 w-auto sm:h-5" />
            <span className="font-semibold">IXORA MBMB</span>
          </div>

          <span className="opacity-50">•</span>

          {/* nav */}
          <nav className="flex items-center gap-4">
            <a href="#" className="opacity-90 transition hover:opacity-100">Privacy</a>
            <a href="#" className="opacity-90 transition hover:opacity-100">Terms</a>
            <a href="#" className="opacity-90 transition hover:opacity-100">Status</a>
            <a href="#" className="opacity-90 transition hover:opacity-100">Help</a>
          </nav>

          {/* right-aligned copyright */}
          <span className="ml-auto shrink-0 opacity-90">
            © {year} MBMB — Melaka Smart City Digital Ecosystem
          </span>
        </div>
      </div>
    </footer>
  );
}