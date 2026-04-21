import HeroSection from "./accueil/HeroSection";
import StatsSection from "./accueil/StatsSection";
import PartnersSection from "./accueil/PartnersSection";
import AboutSection from "./accueil/AboutSection";
import TrustedSection from "@/components/ui/TrustedSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <PartnersSection />
      <AboutSection />
      <TrustedSection />
    </>
  );
}
