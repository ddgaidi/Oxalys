import Link from "next/link";
import OxalysLogo from "@/components/ui/OxalysLogo";

const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGU", href: "/cgu" },
  { label: "Confidentialité", href: "/confidentialite" },
];

const PRODUCT_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Ton FabLab", href: "/ton-fablab" },
  { label: "Tarifs", href: "/tarifs" },
];

const COMPANY_LINKS = [
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
  { label: "Presse", href: "/presse" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <OxalysLogo size={26} />
              <span className="font-display font-bold text-base text-[var(--text)]">Oxalys</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-[200px]">
              La plateforme qui connecte makers et FabLabs partout en France.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-widest mb-4">
              Produit
            </p>
            <ul className="flex flex-col gap-2.5">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-widest mb-4">
              Entreprise
            </p>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-widest mb-4">
              Légal
            </p>
            <ul className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-subtle)]">
            © {new Date().getFullYear()} Oxalys SAS. Tous droits réservés.
          </p>
          <p className="text-xs text-[var(--text-subtle)]">
            Fabriqué en France 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
