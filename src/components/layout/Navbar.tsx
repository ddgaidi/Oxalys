"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import OxalysLogo from "@/components/ui/OxalysLogo";

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Ton FabLab", href: "/ton-fablab" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <OxalysLogo size={32} />
          <span className="font-display font-bold text-[1.05rem] tracking-tight text-[var(--text)]">
            Oxalys
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-sm font-medium px-3.5 py-2 rounded-lg transition-colors duration-150 ${
                pathname === href
                  ? "text-[var(--text)] bg-[var(--bg-elevated)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]"
              }`}
            >
              {label}
              {pathname === href && (
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full bg-gradient-brand" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors bg-transparent hover:bg-[var(--border)]"
            aria-label="Changer le thème"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link
            href="/auth"
            className="btn-primary text-sm px-4 py-2"
          >
            Connexion
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--border)]"
            aria-label="Thème"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--border)]"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-5 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium px-3.5 py-3 rounded-lg transition-colors ${
                pathname === href
                  ? "text-[var(--text)] bg-[var(--bg-elevated)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/auth"
            onClick={() => setMobileOpen(false)}
            className="btn-primary text-sm px-5 py-3 mt-2 text-center"
          >
            Connexion / Inscription
          </Link>
        </div>
      )}
    </header>
  );
}
