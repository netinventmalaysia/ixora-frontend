// pages/landing.tsx
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useTranslation } from "@/utils/i18n";

// Icons
import {
  HomeModernIcon,
  TicketIcon,
  BuildingOffice2Icon,
  DocumentCheckIcon,
  DocumentTextIcon,
  Square3Stack3DIcon,
  MapPinIcon,
  BoltIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  TruckIcon,
  CloudIcon,
  HeartIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
  MapIcon,
  BuildingStorefrontIcon,
  WifiIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const PRIMARY = "#B01C2F";
const PRIMARY_HOVER = "#951325";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>
          {`IXORA MBMB — ${t(
            "landing.hero.title",
            "Smarter Governance, Smoother Community"
          )}`}
        </title>
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
        <Services />
        <ComponentsGrid />
        <SmartCityGuide />
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
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 2xl:px-10">
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

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30 rounded"
            >
              {n.label}
            </a>
          ))}

          <a
            href="#contact"
            className="inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/40"
            style={{ backgroundColor: PRIMARY }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = PRIMARY)
            }
          >
            {t("landing.nav.contact")}
          </a>

          <LanguageSelector className="!static ml-1" />
        </nav>

        <button
          aria-label="Open menu"
          onClick={() => setOpen((s) => !s)}
          className="inline-flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30 md:hidden"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 md:hidden">
          <div className="mx-auto max-w-screen-2xl space-y-1 px-4 py-3 sm:px-6 lg:px-8 2xl:px-10">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-md px-3 py-2 text-center text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/40"
              style={{ backgroundColor: PRIMARY }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = PRIMARY)
              }
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

  const stats = [
    { label: t("landing.hero.stats.uptime", "Uptime"), value: "99.9%" },
    { label: t("landing.hero.stats.transactions", "Transactions"), value: "150k+" },
    { label: t("landing.hero.stats.security", "Security"), value: "PDPA-Act" },
  ];

  return (
    <section id="intro" className="relative isolate overflow-hidden bg-white">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-20%] -z-10 h-[36rem] w-[36rem] blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(176,28,47,0.18) 0%, rgba(176,28,47,0) 60%)",
        }}
      />
      {/* Subtle grid on large screens */}
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

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="grid grid-cols-1 items-center gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-24 2xl:py-28 min-h-[68vh]">
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#B01C2F] sm:text-5xl xl:text-[56px] xl:leading-[1.1]">
              {t("landing.hero.title", "IXORA MBMB")}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              {t("landing.hero.subtitle", "Smarter Governance, Smoother Community")}
            </p>
            <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
              {t(
                "landing.hero.tagline",
                "Built with Trust · Powered by Melaka Historic City Council · Inspired for You"
              )}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="login"
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/40"
                style={{ backgroundColor: PRIMARY }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = PRIMARY)
                }
              >
                {t("landing.hero.ctaPrimary", "Start Digital Services")}
              </a>
              <a
                href="#benefits"
                className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30"
                style={{ borderColor: "#E5E7EB" }}
              >
                {t("landing.hero.ctaSecondary", "Download IXORA+ App")}
              </a>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 lg:max-w-none">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border bg-white p-4 text-center shadow-sm"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <dt className="text-[11px] uppercase tracking-wide text-gray-500">
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
              <Image
                src="/images/ixora-hero.png"
                alt={t("landing.hero.title", "IXORA MBMB")}
                fill
                priority
                className="object-contain drop-shadow"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 60vw, (max-width: 1536px) 720px, 900px"
              />
            </div>
          </div>
        </div>
      </div>

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

function Services() {
  return (
    <section id="services" className="bg-gray-50">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Modul Perkhidmatan</h2>
          <p className="mt-2 text-gray-600">Urus perkhidmatan MBMB secara digital, mudah & telus</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {serviceCards.map((s) => (
            <a
              key={s.title}
              href={s.href}
              className="relative rounded-2xl bg-white border p-5 shadow-sm hover:shadow-md transition group"
              style={{ borderColor: "#E5E7EB" }}
            >
              {/* Badge Coming Soon */}
              {s.status === "coming-soon" && (
                <span className="absolute top-3 right-3 rounded bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  Coming Soon
                </span>
              )}

              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-3"
                style={{ background: "linear-gradient(135deg,#B01C2F20,#FFF1F2)" }}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
              {s.status !== "coming-soon" && (
                <button className="mt-3 text-xs font-medium text-[#B01C2F] hover:underline">
                  {s.status === "coming-soon" ? "Segera Hadir" : "Buka →"}
                </button>
              )}
            </a>
          ))}
        </div>
      </div>
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
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10 py-14 sm:py-16 lg:py-20">
        <h2 className="text-center mt-2 text-2xl font-bold sm:text-3xl text-gray-900">
          {t("landing.benefits.title")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {items.map(({ k, icon }) => (
            <div
              key={k}
              className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div
                className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl text-lg group-hover:scale-105"
                style={{ backgroundColor: "#FFF1F2", color: PRIMARY }}
              >
                <span aria-hidden>{icon}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {t(`landing.benefits.items.${k}.title`)}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t(`landing.benefits.items.${k}.desc`)}
              </p>
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
    [
      "Portal",
      "Mobile App",
      "AI Assistant",
      "Workspace",
      "Access",
      "NotifyMe",
      "Private Cloud",
      "Analytics",
      "Identity",
    ]
  ) as string[];

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
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10 py-14 sm:py-16 lg:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl text-gray-900">
          {t("landing.components.title")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {items.map((name) => (
            <div
              key={name}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div className="mb-2 text-2xl" style={{ color: PRIMARY }}>
                {icons[name] ?? "🧩"}
              </div>
              <h3 className="text-base font-semibold text-gray-900">{name}</h3>
              <p className="mt-1 text-sm text-gray-600">{blurbs[name] ?? ""}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= SMART CITY GUIDE ========================= */
function SmartCityGuide() {
  const cityCards = [
    { title: "Toilet Awam", desc: "Lokasi, waktu operasi & penarafan kebersihan.", icon: BuildingLibraryIcon, href: "/city/public-toilets" },
    { title: "Pengecas EV", desc: "Senarai & status pengecas terdekat.", icon: BoltIcon, href: "/city/ev-chargers" },
    { title: "Parkir & Kawasan Larangan", desc: "Maklumat zon parkir, kadar & teguran.", icon: MapPinIcon, href: "/city/parking" },
    { title: "Sensor Alam Sekitar", desc: "Kualiti udara, cuaca & indeks UV.", icon: CloudIcon, href: "/city/environment-sensors" },
    { title: "Balai Pertolongan Cemas", desc: "Lokasi klinik, farmasi & AED berdekatan.", icon: HeartIcon, href: "/city/first-aid" },
    { title: "Hotspot Banjir", desc: "Titik kerap banjir & aras air semasa.", icon: ExclamationTriangleIcon, href: "/city/flood-hotspots" },
    { title: "Laluan Selamat & CCTV", desc: "Laluan pejalan kaki selamat & titik CCTV.", icon: VideoCameraIcon, href: "/city/safe-routes-cctv" },
    { title: "Info Pelancong & Warisan", desc: "Pusat maklumat, mercu tanda & jejak warisan.", icon: MapIcon, href: "/city/tourist-info" },
    { title: "Acara & Festival", desc: "Kalendar acara komuniti & perbandaran.", icon: CalendarDaysIcon, href: "/city/events" },
    { title: "Pasar & Penjaja", desc: "Pasar malam, medan selera & waktu operasi.", icon: BuildingStorefrontIcon, href: "/city/markets" },
    { title: "Wi-Fi Awam", desc: "Capaian internet awam & lokasi hotspot.", icon: WifiIcon, href: "/city/public-wifi" },
    { title: "Kutipan Sisa & Kitar Semula", desc: "Jadual kutipan, pusat kitar semula & 3R.", icon: TrashIcon, href: "/city/waste-recycling" },
    { title: "Amaran Bencana", desc: "Notifikasi cuaca buruk & arahan keselamatan.", icon: ShieldCheckIcon, href: "/city/disaster-alerts" },
    { title: "Trafik & Kerja Jalan", desc: "Notis kerja jalan & pengalihan trafik terpilih.", icon: TruckIcon, href: "/city/traffic-roadworks" },
  ];

  return (
    <section id="city" className="bg-gray-50">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10 py-14 sm:py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Panduan Bandaraya Pintar</h2>
          <p className="mt-2 text-gray-600">Maklumat rasmi MBMB untuk warga & pelawat</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {cityCards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="rounded-2xl bg-white p-5 border hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: "#FFF1F2", color: PRIMARY }}
                >
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{c.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{c.desc}</p>
                  <span className="mt-2 inline-block text-xs font-medium text-gray-600 group-hover:text-gray-900">
                    Lihat peta & lokasi →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Optional info bar */}
        {/* <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <InfoPill
            icon={<InformationCircleIcon className="h-4 w-4" />}
            text="Data rasmi MBMB · dikemas kini berkala"
          />
          <InfoPill icon={<TruckIcon className="h-4 w-4" />} text="Notis kerja jalan · pengalihan trafik terpilih" />
          <InfoPill
            icon={<CalendarDaysIcon className="h-4 w-4" />}
            text="Kalendar acara komuniti & festival bandaraya"
          />
        </div> */}
      </div>
    </section>
  );
}

function FAQ() {
  const faqSections = [
    {
      heading: "1. UMUM & PENGENALAN",
      items: [
        {
          q: "Apa maksud IXORA?",
          a: "IXORA ialah ekosistem digital sehenti MBMB ... setiap modul bergabung menjadi satu ekosistem digital yang menyeluruh dan berdaya tahan.",
        },
        {
          q: "Bagaimana IXORA berbeza dengan sistem sedia ada (PBTPay/MyDigital)?",
          a: "Berbeza dengan PBTPay, MelakaPay dan TNG eWallet ... dihoskan dalam Private Cloud MBMB bagi kawalan penuh data & keselamatan.",
        },
        {
          q: "Apa itu IXORA GATEWAY?",
          a: "IXORA GATEWAY ialah Gerbang Digital MBMB ... permohonan lesen, bayar cukai/kompaun, semak status, terima notifikasi.",
        },
        {
          q: "Siapa yang boleh menggunakan IXORA?",
          a: "IXORA boleh digunakan oleh individu, perniagaan, pelancong & komuniti setempat. Akaun: individu & perniagaan.",
        },
      ],
    },
    {
      heading: "2. MANFAAT KEPADA RAKYAT & PERNIAGAAN",
      items: [
        {
          q: "Apakah manfaat utama kepada rakyat & peniaga?",
          a: "One-stop center; akses 24/7; mudah & telus; inklusif dengan kiosk & terminal bergerak.",
        },
        {
          q: "Bagaimana IXORA menyokong aspirasi 'Tanpa Kaunter & Tanpa Tunai'?",
          a: "Semua perkhidmatan boleh diuruskan digital; bayaran melalui FPX, kad, eWallet, QR Pay, kiosk.",
        },
        {
          q: "Adakah pelancong boleh menggunakan IXORA?",
          a: "Ya. Pelancong boleh guna: bayaran parkir digital, bayar kompaun trafik/parkir, lihat acara & pengumuman rasmi.",
        },
      ],
    },
    {
      heading: "3. PERKHIDMATAN & MODUL",
      items: [
        {
          q: "Apakah modul utama yang tersedia dalam IXORA?",
          a: "Cukai Taksiran, Lesen Perniagaan/Penjaja, Permit Bangunan, Sewaan Gerai, Parkir, Kompaun, Lesen Haiwan, Pas Bulanan Parkir, Pelan Ansuran, Remisi Cukai.",
        },
        {
          q: "Bagaimana IXORA membantu operasi dalaman MBMB?",
          a: "Melalui IXORA Workspace untuk pegawai memproses permohonan, cuti/tuntutan, kolaborasi rentas jabatan.",
        },
      ],
    },
    {
      heading: "4. KOMPONEN UTAMA IXORA",
      items: [
        {
          q: "Apakah komponen utama dalam ekosistem IXORA?",
          a: "9 komponen: IXORA Gateway, IXORA+ App, AI Assistant, Workspace, Access, NotifyMe, Private Cloud, Analytics, Identity.",
        },
      ],
    },
    {
      heading: "5. KOS & PENYELENGGARAAN",
      items: [
        {
          q: "Berapa kos pembangunan & penyelenggaraan IXORA?",
          a: "Kos hanya integrasi kritikal (FPX, MyData SSM, AI Chatbot). Modul awam/admin dibina in-house. Penyelenggaraan ditanggung bajet ICT.",
        },
        {
          q: "Adakah pengguna dikenakan caj tambahan?",
          a: "Tiada caj MBMB; caj kecil (jika ada) hanya caj standard bank/eWallet.",
        },
      ],
    },
    {
      heading: "6. KESELAMATAN & PEMATUHAN",
      items: [
        {
          q: "Apakah jaminan keselamatan IXORA?",
          a: "Private Cloud MBMB, SSO & identiti digital, encryption, audit trail, penetration test.",
        },
        {
          q: "Bagaimana IXORA mematuhi undang-undang & dasar?",
          a: "Patuh Akta PDPA 2010 & Dasar Keselamatan ICT MBMB.",
        },
      ],
    },
    {
      heading: "7. OPERASI & KESINAMBUNGAN",
      items: [
        {
          q: "Bagaimana jika sistem tergendala?",
          a: "Ada Disaster Recovery Plan, backup harian, auto-scale, modular design.",
        },
      ],
    },
    {
      heading: "8. KPI & PRESTASI",
      items: [
        {
          q: "Apakah KPI IXORA?",
          a: "≥95% kutipan hasil digital, ≥80% permohonan online, proses lesen ≤7 hari, kepuasan ≥85%, kurangkan lawatan kaunter.",
        },
        {
          q: "Bagaimana prestasi dipantau?",
          a: "Dipantau melalui IXORA Analytics (dashboard masa nyata hasil, masa proses, aduan, chatbot, kiosk).",
        },
      ],
    },
  ];

  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
          SOALAN LAZIM (FAQ) – EKOSISTEM DIGITAL MBMB IXORA
        </h2>

        <div className="mt-8 space-y-8">
          {faqSections.map((section, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {section.heading}
              </h3>
              <div className="space-y-2">
                {section.items.map((f, j) => (
                  <FAQItem key={j} q={f.q} a={f.a} />
                ))}
              </div>
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
    <div
      className="rounded-xl border bg-white transition"
      style={{ borderColor: "#E5E7EB" }}
    >
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
      >
        <span className="font-medium text-gray-900">{q}</span>
        <svg
          className={`h-5 w-5 text-gray-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
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
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10 py-14 sm:py-16 lg:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl text-gray-900">
          {t("landing.contact.title")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-8">
          <div
            className="rounded-2xl border bg-white p-6 shadow-sm"
            style={{ borderColor: "#E5E7EB" }}
          >
            <h3 className="text-base font-semibold text-gray-900">
              {t("landing.contact.addressLabel")}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {(t("landing.contact.addressLines", "", [
                "Menara MBMB, Jalan Graha Makmur",
                "Ayer Keroh, 75450 Melaka",
                "Malaysia",
              ]) as string[]).map((ln, i, arr) => (
                <span key={i}>
                  {ln}
                  {i < arr.length - 1 ? <><br /></> : null}
                </span>
              ))}
            </p>
          </div>

          <div
            className="rounded-2xl border bg-white p-6 shadow-sm"
            style={{ borderColor: "#E5E7EB" }}
          >
            <h3 className="text-base font-semibold text-gray-900">
              {t("landing.contact.phoneLabel")}/{t("landing.contact.emailLabel")}
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li>
                <strong>{t("landing.contact.phoneLabel")}:</strong> +60 X-XXXX XXXX
              </li>
              <li>
                <strong>{t("landing.contact.emailLabel")}:</strong>{" "}
                <a
                  className="text-gray-900 underline-offset-2 hover:underline"
                  href="mailto:ixora@mbmb.gov.my"
                >
                  ixora@mbmb.gov.my
                </a>
              </li>
            </ul>
          </div>

          <div
            className="rounded-2xl border bg-white p-6 shadow-sm"
            style={{ borderColor: "#E5E7EB" }}
          >
            <h3 className="text-base font-semibold text-gray-900">
              {t("landing.contact.panelTitle")}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {t("landing.contact.panelDesc")}
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/40"
                style={{ backgroundColor: PRIMARY }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = PRIMARY)
                }
              >
                {t("landing.contact.ctaRegister", t("landing.contact.ctaRegister", "Register"))}
              </a>
              <a
                href="login"
                className="rounded-md border px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30"
                style={{ borderColor: "#E5E7EB" }}
              >
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
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="flex h-12 items-center gap-4 overflow-x-auto whitespace-nowrap text-xs sm:text-sm">
          <div className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.png"
              alt="IXORA MBMB"
              width={18}
              height={18}
              className="h-4 w-auto sm:h-5"
            />
            <span className="font-semibold">
              {t("landing.hero.title", "IXORA MBMB")}
            </span>
          </div>

          <span className="opacity-50">•</span>

          <nav className="flex items-center gap-4">
            <a href="#" className="opacity-90 transition hover:opacity-100">
              {t("privacy", "Privacy")}
            </a>
            <a href="#" className="opacity-90 transition hover:opacity-100">
              {t("terms", "Terms")}
            </a>
            <a href="#" className="opacity-90 transition hover:opacity-100">
              {t("status", "Status")}
            </a>
            <a href="#" className="opacity-90 transition hover:opacity-100">
              {t("help", "Help")}
            </a>
          </nav>

          <span className="ml-auto shrink-0 opacity-90">
            © {year} {t("landing.footer.text", "IXORA MBMB – Melaka Smart City Digital Ecosystem")}
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Small UI ---------- */
function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs text-gray-700"
      style={{ borderColor: "#E5E7EB" }}
    >
      <span className="text-gray-600">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

const serviceCards = [
  { title: "Cukai Taksiran Harta", desc: "Semak & bayar dengan mudah.", icon: HomeModernIcon, href: "/services/assessment" },
  { title: "Lesen Perniagaan", desc: "Daftar atau renew lesen perniagaan.", icon: DocumentTextIcon, href: "/services/licence" },
  { title: "Sewaan Gerai", desc: "Urus sewaan & invois dengan digital.", icon: BuildingOffice2Icon, href: "/services/booth" },
  { title: "Kompaun & Saman", desc: "Semakan & bayaran kompaun/saman trafik.", icon: TicketIcon, href: "/services/compound" },
  { title: "Permit Bangunan Sementara (Kelulusan Pelan)", desc: "Permohonan & pembaharuan permit sementara.", icon: DocumentCheckIcon, href: "/services/myskb" },
  { title: "Pindah Milik Harta", desc: "Proses pindah milik cukai harta.", icon: Square3Stack3DIcon, href: "#", status: "coming-soon" },
  { title: "Suntikan Typhoid", desc: "Rekod suntikan & status kesihatan.", icon: ShieldCheckIcon, href: "#", status: "coming-soon" },
  { title: "Sewaan Petak Letak Kereta", desc: "Permohonan sewaan petak letak kereta.", icon: MapPinIcon, href: "#", status: "coming-soon" },
  { title: "Bil Pelbagai", desc: "Semakan & bayaran pelbagai bil MBMB.", icon: DocumentTextIcon, href: "#", status: "coming-soon" },
  { title: "Kebenaran Merancang Terhad (DO terhad)", desc: "Permohonan DO terhad secara digital.", icon: DocumentCheckIcon, href: "#", status: "coming-soon" },
  { title: "Remisi Cukai", desc: "Pengurangan cukai taksiran.", icon: HomeModernIcon, href: "#", status: "coming-soon" },
  { title: "Pas Bulanan Letak Kereta", desc: "Langganan parkir bulanan.", icon: TicketIcon, href: "#", status: "coming-soon" },
  { title: "Permit Penjaja", desc: "Daftar & urus lesen penjaja.", icon: BuildingStorefrontIcon, href: "#", status: "coming-soon" },
  { title: "Lesen Haiwan Peliharaan", desc: "Daftar & renew lesen haiwan.", icon: HeartIcon, href: "#", status: "coming-soon" },
  { title: "Permit Sementara", desc: "Kelulusan sementara untuk aktiviti.", icon: DocumentCheckIcon, href: "#", status: "coming-soon" },
  { title: "Pelan Ansuran Cukai", desc: "Bayar cukai ikut pelan ansuran.", icon: CalendarDaysIcon, href: "#", status: "coming-soon" },
  { title: "Lesen Beca", desc: "Permohonan & pembaharuan lesen beca.", icon: TruckIcon, href: "#", status: "coming-soon" },
];

