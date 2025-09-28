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
    { label: t("landing.nav.intro"), href: "#intro" },
    { label: t("landing.nav.benefits"), href: "#benefits" },
    { label: t("landing.nav.components"), href: "#components" },
    { label: t("landing.nav.faq"), href: "#faq" },
    { label: t("landing.nav.contact"), href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="IXORA MBMB" width={18} height={18} className="h-7 w-auto" priority />
          <span className="text-sm font-semibold tracking-wide text-gray-900">{t("landing.hero.title", "IXORA MBMB")}</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-gray-600 transition-colors hover:text-gray-900">
              {n.label}
            </a>
          ))}

          {/* Use nav.contact for the button label */}
          <a
            href="#contact"
            className="inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: PRIMARY }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
          >
            {t("landing.nav.contact")}
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

      {open && (
        <div className="border-t border-gray-200 md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-md px-3 py-2 text-center text-sm font-medium text-white"
              style={{ backgroundColor: PRIMARY }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
            >
              {t("landing.nav.contact")}
            </a>

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

  // These keys aren’t in your JSON; keep fallbacks or add them to JSON if you prefer:
  const stats = [
    { label: t("landing.hero.stats.uptime", "Uptime"), value: "99.9%" },
    { label: t("landing.hero.stats.transactions", "Transactions"), value: "150k+" },
    { label: t("landing.hero.stats.security", "Security"), value: "PDPA-Act" },
  ];

  return (
    <section id="intro" className="relative isolate overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-20%] -z-10 h-[36rem] w-[36rem] blur-3xl"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(176,28,47,0.18) 0%, rgba(176,28,47,0) 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        style={{
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,0.02) 40%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,0.02) 40%, transparent)",
          backgroundSize: "32px 32px",
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24 min-h-[72vh]">
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#B01C2F] sm:text-5xl lg:text-[52px] lg:leading-[1.1]">
              {t("landing.hero.title", "IXORA MBMB")}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600 lg:text-lg">
              {t("landing.hero.subtitle", "Smarter Governance, Smoother Community")}
            </p>
            <p className="mt-2 max-w-xl text-sm text-gray-500">
              {t("landing.hero.tagline", "Built with Trust · Powered by Melaka Historic City Council · Inspired for You")}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="login"
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: PRIMARY }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
              >
                {t("landing.hero.ctaPrimary", "Start Digital Services")}
              </a>
              <a
                href="#benefits"
                className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                style={{ borderColor: "#E5E7EB" }}
              >
                {t("landing.hero.ctaSecondary", "Download IXORA+ App")}
              </a>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:max-w-none lg:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border bg-white p-4 text-center shadow-sm" style={{ borderColor: "#E5E7EB" }}>
                  <dt className="text-[11px] uppercase tracking-wide text-gray-500">{s.label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold text-gray-900 lg:text-xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-xl sm:max-w-2xl">
              <Image
                src="/images/ixora-hero.png"
                alt={t("landing.hero.title", "IXORA MBMB")}
                fill
                priority
                className="object-contain drop-shadow"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 55vw, 720px"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute left-[-20%] bottom-[-30%] -z-10 h-[30rem] w-[30rem] blur-3xl"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255,179,186,0.28) 0%, rgba(255,255,255,0) 65%)" }}
      />
    </section>
  );
}

/* ========================= BENEFITS ========================= */
function Benefits() {
  const { t } = useTranslation();

  const items = [
    { k: "oneStop", icon: "🏛️" },
    { k: "access", icon: "🕒" },
    { k: "counterless", icon: "📲" },
    { k: "transparent", icon: "🔎" },
    { k: "dataDriven", icon: "📊" },
    { k: "secure", icon: "🔐" },
  ];

  return (
    <section id="benefits" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h2 className="text-center mt-6 text-2xl font-bold sm:text-3xl text-gray-900">
          {t("landing.benefits.title")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ k, icon }) => (
            <div key={k} className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: "#E5E7EB" }}>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg group-hover:scale-105" style={{ backgroundColor: "#FFF1F2", color: PRIMARY }}>
                <span aria-hidden>{icon}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">{t(`landing.benefits.items.${k}.title`)}</h3>
              <p className="mt-1 text-sm text-gray-600">{t(`landing.benefits.items.${k}.desc`)}</p>
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
  const items = t(
    "landing.components.items",
    undefined,
    ["Portal", "Mobile App", "AI Assistant", "Workspace", "Access", "NotifyMe", "Private Cloud", "Analytics", "Identity"]
  ) as string[];

  // quick blurbs (optional fallbacks)
  const blurbs: Record<string, string> = {
    Portal: "Central hub for city services.",
    "Mobile App": "Services on the go.",
    "AI Assistant": "Smart help & suggestions.",
    Workspace: "Staff & department tools.",
    Access: "Single sign-on & identity.",
    NotifyMe: "Alerts & status updates.",
    "Private Cloud": "Secure MBMB infrastructure.",
    Analytics: "KPIs & dashboards.",
    Identity: "Citizen & business profiles.",
  };

  const icons: Record<string, string> = {
    Portal: "🧭",
    "Mobile App": "📱",
    "AI Assistant": "🤖",
    Workspace: "🗂️",
    Access: "🔑",
    NotifyMe: "🔔",
    "Private Cloud": "☁️",
    Analytics: "📈",
    Identity: "🪪",
  };

  return (
    <section id="components" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl text-gray-900">{t("landing.components.title")}</h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((name) => (
            <div key={name} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md" style={{ borderColor: "#E5E7EB" }}>
              <div className="mb-2 text-2xl" style={{ color: PRIMARY }}>{icons[name] ?? "🧩"}</div>
              <h3 className="text-base font-semibold text-gray-900">{name}</h3>
              <p className="mt-1 text-sm text-gray-600">{blurbs[name] ?? ""}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= FAQ (uses nested groups) ========================= */
function FAQ() {
  const { t } = useTranslation();

  const groups = [
    { id: "1", type: "qa" as const, rows: [
      { q: t("landing.faq.groups.1.q1"), a: t("landing.faq.groups.1.a1") },
      { q: t("landing.faq.groups.1.q2"), a: t("landing.faq.groups.1.a2") },
      { q: t("landing.faq.groups.1.q3"), a: t("landing.faq.groups.1.a3") },
    ]},
    { id: "2", type: "list" as const, list: t("landing.faq.groups.2.list", "") as string[] },
    { id: "3", type: "body" as const, body: t("landing.faq.groups.3.body") },
    { id: "4", type: "body" as const, body: t("landing.faq.groups.4.body") },
    { id: "5", type: "body" as const, body: t("landing.faq.groups.5.body") },
    { id: "6", type: "body" as const, body: t("landing.faq.groups.6.body") },
    { id: "7", type: "body" as const, body: t("landing.faq.groups.7.body") },
  ];

  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl text-gray-900">{t("landing.faq.title")}</h2>

        <div className="mt-8 space-y-6">
          {groups.map((g) => (
            <div key={g.id} className="rounded-xl border bg-white" style={{ borderColor: "#E5E7EB" }}>
              <div className="px-4 py-3 font-semibold text-gray-900">{t(`landing.faq.groups.${g.id}.heading`, "")}</div>

              {/* QA block */}
              {"rows" in g && g.rows?.length ? (
                <div className="divide-y" style={{ borderColor: "#E5E7EB" }}>
                  {g.rows.map((r, i) => (
                    <FAQItem key={`${g.id}-${i}`} q={r.q} a={r.a} />
                  ))}
                </div>
              ) : null}

              {/* List block */}
              {"list" in g && g.list && g.list.length ? (
                <ul className="px-5 pb-4 list-disc space-y-1 text-sm text-gray-700">
                  {g.list.map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              ) : null}

              {/* Body block */}
              {"body" in g && g.body ? (
                <p className="px-5 pb-4 text-sm text-gray-700">{g.body}</p>
              ) : null}
            </div>
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
        <h2 className="text-center text-2xl font-bold sm:text-3xl text-gray-900">{t("landing.contact.title")}</h2>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E5E7EB" }}>
            <h3 className="text-base font-semibold text-gray-900">{t("landing.contact.addressLabel")}</h3>
            <p className="mt-2 text-sm text-gray-600">
              {(t("landing.contact.addressLines", "", [
                "Menara MBMB, Jalan Graha Makmur",
                "Ayer Keroh, 75450 Melaka",
                "Malaysia"
              ]) as string[]).map((ln, i, arr) => (
                <span key={i}>{ln}{i < arr.length - 1 ? <><br/></> : null}</span>
              ))}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E5E7EB" }}>
            <h3 className="text-base font-semibold text-gray-900">{t("landing.contact.phoneLabel")}/{t("landing.contact.emailLabel")}</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li><strong>{t("landing.contact.phoneLabel")}:</strong> +60 X-XXXX XXXX</li>
              <li>
                <strong>{t("landing.contact.emailLabel")}:</strong>{" "}
                <a className="text-gray-900 underline-offset-2 hover:underline" href="mailto:ixora@mbmb.gov.my">ixora@mbmb.gov.my</a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E5E7EB" }}>
            <h3 className="text-base font-semibold text-gray-900">{t("landing.contact.panelTitle")}</h3>
            <p className="mt-2 text-sm text-gray-600">{t("landing.contact.panelDesc")}</p>
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-white"
                style={{ backgroundColor: PRIMARY }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
              >
                {t("landing.contact.ctaRegister", t("landing.contact.ctaRegister", "Register"))}
              </a>
              <a href="login" className="rounded-md border px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50" style={{ borderColor: "#E5E7EB" }}>
                {t("landing.contact.ctaLogin", t("landing.contact.ctaLogin", "Log In"))}
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
  const { t } = useTranslation();

  return (
    <footer className="bg-[#B01C2F] text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-12 items-center gap-4 overflow-x-auto whitespace-nowrap text-xs sm:text-sm">
          <div className="flex items-center gap-2 shrink-0">
            <Image src="/images/logo.png" alt="IXORA MBMB" width={18} height={18} className="h-4 w-auto sm:h-5" />
            <span className="font-semibold">{t("landing.hero.title", "IXORA MBMB")}</span>
          </div>

          <span className="opacity-50">•</span>

          <nav className="flex items-center gap-4">
            <a href="#" className="opacity-90 transition hover:opacity-100">{t("privacy", "Privacy")}</a>
            <a href="#" className="opacity-90 transition hover:opacity-100">{t("terms", "Terms")}</a>
            <a href="#" className="opacity-90 transition hover:opacity-100">{t("status", "Status")}</a>
            <a href="#" className="opacity-90 transition hover:opacity-100">{t("help", "Help")}</a>
          </nav>

          <span className="ml-auto shrink-0 opacity-90">
            © {year} {t("landing.footer.text", "IXORA MBMB – Melaka Smart City Digital Ecosystem")}
          </span>
        </div>
      </div>
    </footer>
  );
}