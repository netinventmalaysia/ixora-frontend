import Layout from "@/components/landing-page/Layout";
import Hero from "@/components/landing-page/Hero";
import Benefits from "@/components/landing-page/Benefits";
import Services from "@/components/landing-page/Services";
import ComponentsGrid from "@/components/landing-page/ComponentsGrid";
import SmartCityGuide from "@/components/landing-page/SmartCityGuide";
import FAQ from "@/components/landing-page/Faq";
import Contact from "@/components/landing-page/Contact";

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <Services />
      <SmartCityGuide />
      <ComponentsGrid />
      <Benefits />
      <FAQ />
      <Contact />
    </Layout>
  );
}
