"use client";

/*
 * Commentaires de structure : Affiche le pied de page et les liens de navigation secondaires.
 */
import Link from "next/link";
import OxalysLogo from "@/components/ui/OxalysLogo";
import { useTheme } from "@/lib/context/ThemeContext";

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const PRODUCT_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Ton FabLab", href: "/ton-fablab" },
  { label: "Tarifs", href: "/tarifs" },
];

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const COMPANY_LINKS = [
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
  { label: "Presse", href: "/presse" },
];

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGU", href: "/cgu" },
  { label: "Confidentialité", href: "/confidentialite" },
];

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const footerBg    = isDark ? "rgba(6,10,20,0.97)"      : "rgba(248,250,255,0.97)";
  const borderColor = isDark ? "rgba(255,255,255,0.06)"   : "rgba(0,0,0,0.07)";
  const labelColor  = isDark ? "rgba(255,255,255,0.22)"   : "#94a3b8";
  const linkColor   = isDark ? "rgba(255,255,255,0.45)"   : "#64748b";
  const dotColor    = isDark ? "rgba(59,130,246,0.06)"    : "rgba(59,130,246,0.05)";
  const copyColor   = isDark ? "rgba(255,255,255,0.22)"   : "#94a3b8";
  const descColor   = isDark ? "rgba(255,255,255,0.4)"    : "#94a3b8";

  return (
    <footer className="relative" style={{ background: footerBg, borderTop: `1px solid ${borderColor}` }}>
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="mb-4">
              <OxalysLogo size={100} />
            </div>
            <p className="text-sm leading-relaxed max-w-[210px]" style={{ color: descColor }}>
              Surveillance qualité de l&apos;air des FabLabs universitaires en temps réel.
            </p>
          </div>

          {[
            { title: "Produit",    links: PRODUCT_LINKS },
            { title: "Entreprise", links: COMPANY_LINKS },
            { title: "Légal",      links: LEGAL_LINKS   },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: labelColor }}>
                {title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm transition-colors duration-200 hover:text-blue-400"
                      style={{ color: linkColor }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <p className="text-xs" style={{ color: copyColor }}>
            © {new Date().getFullYear()} Oxalys SAS. Tous droits réservés.
          </p>
          <p className="text-xs" style={{ color: copyColor }}>
            Fabriqué en France 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
