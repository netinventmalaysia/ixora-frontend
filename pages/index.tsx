import Head from 'next/head';
import { useTranslation } from '@/utils/i18n';
import LanguageSelector from '@/components/common/LanguageSelector';
import ClientOnly from '@/components/common/ClientOnly';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Intro } from '@/components/landing/Intro';
import { Benefits } from '@/components/landing/Benefits';
import { ComponentsGrid } from '@/components/landing/ComponentsGrid';
import { Achievements } from '@/components/landing/Achievements';
import { FAQ } from '@/components/landing/FAQ';
import { Contact } from '@/components/landing/Contact';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage(){
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{`${t('landing.hero.title')} | MBMB`}</title>
        <meta name="description" content={t('landing.intro.subheading')} />
      </Head>
      <ClientOnly>
        <div className="fixed right-3 top-20 sm:top-24 z-50"><LanguageSelector className="!static" /></div>
        <Navbar />
        <Hero />
        <Intro />
        <Benefits />
        <ComponentsGrid />
        {/* <Achievements /> */}
        <FAQ />
        <Contact />
        <Footer />
      </ClientOnly>
    </>
  );
}

