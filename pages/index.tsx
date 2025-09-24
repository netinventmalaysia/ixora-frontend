import PageMeta from "../components/common/PageMeta";
import {
  Users,
  ArrowRight,
  Shield,
  Wifi,
  MessageSquare,
  Printer,
  Fingerprint,
  CheckCircle,
} from "lucide-react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone?: "blue" | "green" | "purple" | "orange";
};

// Peta semula 'tone' kepada palet merah/aksen supaya kekal serasi dengan kod sedia ada
const toneBg: Record<NonNullable<FeatureCardProps["tone"]>, string> = {
  blue: "bg-rose-100",    // ganti biru -> rose lembut
  green: "bg-red-100",    // ganti hijau -> merah lembut
  purple: "bg-amber-100", // ganti ungu -> kuning/amber sebagai aksen hangat
  orange: "bg-orange-100"
};

const FeatureCard = ({ icon, title, desc, tone = "blue" }: FeatureCardProps) => (
  <div className="group relative rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl">
    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${toneBg[tone]}`}>
      {icon}
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/0 transition-all group-hover:ring-black/5" />
  </div>
);

const TrustItem = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <CheckCircle className="h-4 w-4 text-green-500" />
    <span>{label}</span>
  </div>
);

const LandingPage = () => {
  return (
    <>
      <PageMeta
        title="IXORA – Ekosistem Digital MBMB"
        description="Platform sehenti MBMB untuk permohonan, kelulusan, pembayaran, notifikasi dan analitik. Disokong AI, selamat, dan dihoskan dalam Private Cloud MBMB."
      />

      {/* Gradien latar merah lembut */}
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-orange-50">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-red-100 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-start px-4 sm:px-6 lg:px-8">
            <a
              href="/"
              className="flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]"
            >
              <img src="/images/logo.png" alt="Logo IXORA" className="h-8 w-8" />
              <span className="text-lg font-bold text-gray-900">IXORA</span>
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* hiasan blob merah/jingga */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#B01C2F]/25 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-72 w-72 translate-y-1/3 rounded-full bg-[#E6691F]/25 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                    Ekosistem Digital
                    <span className="block text-[#B01C2F]">MBMB IXORA</span>
                  </h1>
                  <p className="max-w-2xl text-xl leading-relaxed text-gray-700">
                    Platform sehenti generasi baharu untuk urusan bandaraya: permohonan → kelulusan → pembayaran → notifikasi → analitik.
                    Lebih pantas, telus dan tanpa kaunter – disokong AI & Private Cloud MBMB.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <a
                    href="/start"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B01C2F] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#951325] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F] focus-visible:ring-offset-2"
                  >
                    <Users size={20} /> Jelajah Perkhidmatan
                  </a>
                  <a
                    href="/hubungi"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 px-8 py-4 font-semibold text-gray-800 transition-all duration-200 hover:border-red-300 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F] focus-visible:ring-offset-2"
                  >
                    <ArrowRight size={20} /> Lihat Demo
                  </a>
                </div>

                {/* Trust */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <TrustItem label="Selamat & Dipercayai" />
                  <TrustItem label="Private Cloud MBMB" />
                  <TrustItem label="Cashless & Counterless" />
                </div>
              </div>

              {/* Right - Feature Cards */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FeatureCard
                  icon={<Shield className="h-6 w-6 text-[#B01C2F]" />}
                  title="IXORA Hub"
                  desc="Perkhidmatan rakyat sehenti (permit, lesen, cukai, kompaun) dalam satu portal bersepadu."
                  tone="blue"
                />
                <FeatureCard
                  icon={<Fingerprint className="h-6 w-6 text-[#B01C2F]" />}
                  title="IXORA Workspace"
                  desc="Operasi dalaman yang tersusun – kawalan akses, jejak audit, dan aliran kerja digital."
                  tone="green"
                />
                <FeatureCard
                  icon={<MessageSquare className="h-6 w-6 text-[#B01C2F]" />}
                  title="IXORA+ AI Assist"
                  desc="Chatbot AI 24/7: status permohonan, notifikasi OTP/resit & maklum balas pintar."
                  tone="purple"
                />
                <FeatureCard
                  icon={<Printer className="h-6 w-6 text-[#B01C2F]" />}
                  title="IXORA Access"
                  desc="Kiosk/terminal layan diri & MyCetak untuk akses pantas di lokasi strategik."
                  tone="orange"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="bg-white/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Mengapa Pilih IXORA?
              </h2>
              <p className="text-xl text-gray-600">
                Reka bentuk berteraskan komuniti, dipacu data & AI, memudahkan urusan dan menjimatkan masa serta kos.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100">
                  <Wifi className="h-8 w-8 text-[#B01C2F]" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Akses Mudah</h3>
                <p className="text-gray-600">
                  Urus semua perkhidmatan MBMB dalam satu akaun & pengalaman seragam, bila-bila masa, di mana-mana.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
                  <Shield className="h-8 w-8 text-[#B01C2F]" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Keselamatan Terjamin</h3>
                <p className="text-gray-600">
                  Private Cloud MBMB, kawalan akses berpusat, penyulitan data & audit berkala berpandukan amalan terbaik.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                  <MessageSquare className="h-8 w-8 text-[#B01C2F]" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Notifikasi Masa Nyata</h3>
                <p className="text-gray-600">
                  Notifikasi status, OTP & resit digital terus ke peranti – mengurangkan kebergantungan kepada kaunter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2a2a2a] py-8 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 text-sm">
              <nav className="flex flex-col items-center gap-6 md:flex-row">
                <a
                  href="/security"
                  className="rounded transition-colors hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]"
                >
                  Dasar Keselamatan
                </a>
                <span className="hidden text-gray-500 md:block">|</span>
                <a
                  href="/terms"
                  className="rounded transition-colors hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]"
                >
                  Terma & Syarat
                </a>
              </nav>
              <div className="text-center text-gray-300">
                Hak Cipta Terpelihara © 2025 Majlis Bandaraya Melaka Bersejarah (MBMB)
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;

// import Head from 'next/head';
// import { useTranslation } from '@/utils/i18n';
// import LanguageSelector from '@/components/common/LanguageSelector';
// import { Navbar } from '@/components/landing/Navbar';
// import { Hero } from '@/components/landing/Hero';
// import { Intro } from '@/components/landing/Intro';
// import { Benefits } from '@/components/landing/Benefits';
// import { ComponentsGrid } from '@/components/landing/ComponentsGrid';
// import { Achievements } from '@/components/landing/Achievements';
// import { FAQ } from '@/components/landing/FAQ';
// import { Contact } from '@/components/landing/Contact';
// import { Footer } from '@/components/landing/Footer';

// export default function LandingPage(){
//   const { t } = useTranslation();
//   return (
//     <>
//       <Head>
//         <title>{t('landing.hero.title')} | MBMB</title>
//         <meta name="description" content={t('landing.intro.subheading')} />
//       </Head>
//   <div className="fixed right-3 top-20 sm:top-24 z-50"><LanguageSelector className="!static" /></div>
//       <Navbar />
//       <Hero />
//       <Intro />
//       <Benefits />
//       <ComponentsGrid />
//       <Achievements />
//       <FAQ />
//       <Contact />
//       <Footer />
//     </>
//   );
// }

