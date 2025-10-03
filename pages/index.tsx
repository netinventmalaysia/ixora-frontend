import Layout from "@/components/landing-page/Layout";
import Hero from "@/components/landing-page/Hero";
import PWAInstallPrompt from "@/components/common/PWAInstallPrompt";
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
      <PWAInstallPrompt
        cooldownDays={3}
        showManualButton={true}
        // texts={{ title: "Pasang IXORA?", manualButton: "Pasang IXORA" }}
      />
      {/* <ComponentsGrid />
      <Benefits />
      <FAQ /> */}
      <Contact />
    </Layout>
  );
}
