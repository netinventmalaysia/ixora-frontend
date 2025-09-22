import Head from 'next/head';
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
  return (
    <>
      <Head>
        <title>IXORA | MBMB</title>
        <meta name="description" content="IXORA Gerbang Digital MBMB" />
      </Head>
      <Navbar />
      <Hero />
      <Intro />
      <Benefits />
      <ComponentsGrid />
      <Achievements />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}
