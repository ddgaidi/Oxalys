"use client";

/*
 * Commentaires de structure : Assemble les sections de la page d accueil publique.
 */
import { useTheme } from "@/lib/context/ThemeContext";
import HeroSection from "./accueil/HeroSection";
import StatsSection from "./accueil/StatsSection";
import StationSection from "./accueil/StationSection";
import PartnersSection from "./accueil/PartnersSection";
import AboutSection from "./accueil/AboutSection";
import TrustedSection from "@/components/ui/TrustedSection";

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="relative"
      style={{
        background: isDark
          ? "linear-gradient(160deg, #080c18 0%, #0a0f1e 40%, #06111a 100%)"
          : "linear-gradient(160deg, #f0f4ff 0%, #f8faff 40%, #eef6f2 100%)",
      }}
    >
      {/* Fixed dot grid shared by all sections */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.07)"} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative z-10">
        <HeroSection />
        <StatsSection />
        <StationSection />
        <PartnersSection />
        <AboutSection />
      </div>
    </div>
  );
}
