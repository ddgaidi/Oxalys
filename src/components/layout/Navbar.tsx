"use client";

/*
 * Commentaires de structure : Gere la navigation principale, le theme et les actions utilisateur.
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, User, LogOut } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import OxalysLogo from "@/components/ui/OxalysLogo";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const NAV_LINKS = [
  { label: "Accueil",    href: "/"          },
  { label: "Tarifs",     href: "/tarifs"    },
  { label: "Ton FabLab", href: "/ton-fablab"},
];

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function Navbar() {
  const pathname           = usePathname();
  const router             = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser]    = useState<SupabaseUser | null>(null);
  const [initials, setInitials] = useState("");
  const isDark             = theme === "dark";

  /* ── Auth state ── */
  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) loadInitials(sb, data.user.id);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadInitials(sb, session.user.id);
      else setInitials("");
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadInitials(sb: ReturnType<typeof createClient>, uid: string) {
    const { data } = await sb.from("etudiant").select("prenom,nom").eq("id", uid).single();
    if (data) {
      setInitials(`${data.prenom?.[0] ?? ""}${data.nom?.[0] ?? ""}`.toUpperCase() || "?");
    }
  }

  async function handleLogout() {
    const sb = createClient();
    await sb.auth.signOut();
    router.push("/");
    setMobileOpen(false);
  }

  /* ── Design tokens ── */
  const navBg      = isDark ? "rgba(8,12,24,0.88)"     : "rgba(248,250,255,0.88)";
  const navBorder  = isDark ? "rgba(255,255,255,0.07)"  : "rgba(0,0,0,0.07)";
  const activeColor = isDark ? "#ffffff"                : "#0f172a";
  const activeBg   = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const mutedColor = isDark ? "rgba(255,255,255,0.5)"  : "#64748b";
  const iconColor  = isDark ? "rgba(255,255,255,0.55)" : "#64748b";
  const mobileBg   = isDark ? "rgba(8,12,24,0.97)"     : "rgba(248,250,255,0.97)";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-xl"
      style={{ background: navBg, borderBottom: `1px solid ${navBorder}` }}
    >
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <OxalysLogo size={110} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative text-sm font-medium px-3.5 py-2 rounded-xl transition-all duration-150"
                style={{ color: active ? activeColor : mutedColor, background: active ? activeBg : "transparent" }}
              >
                {label}
                {active && (
                  <span
                    className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full"
                    style={{ background: "linear-gradient(90deg,#3b82f6,#10b981)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            style={{ color: iconColor }}
            aria-label="Changer le thème"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user ? (
            /* ── Logged in ── */
            <div className="flex items-center gap-2">
              <Link
                href="/profil"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg,#2563eb,#059669)",
                  boxShadow: "0 2px 10px rgba(37,99,235,0.3)",
                }}
                aria-label="Mon profil"
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold">
                  {initials || <User size={12} />}
                </span>
                <span className="text-white text-sm font-semibold">Mon profil</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                aria-label="Se déconnecter"
                title="Se déconnecter"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            /* ── Logged out ── */
            <Link href="/auth" className="btn-primary text-sm px-4 py-2 rounded-xl">
              Connexion
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ color: iconColor }}
            aria-label="Thème"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ color: iconColor }}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-5 py-4 flex flex-col gap-1"
          style={{ background: mobileBg, borderTop: `1px solid ${navBorder}` }}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium px-3.5 py-3 rounded-xl transition-colors"
                style={{ color: active ? activeColor : mutedColor, background: active ? activeBg : "transparent" }}
              >
                {label}
              </Link>
            );
          })}

          {user ? (
            <>
              <Link
                href="/profil"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 text-sm font-semibold px-4 py-3 mt-2 rounded-xl"
                style={{ background: "linear-gradient(135deg,#2563eb,#059669)", color: "white" }}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold">
                  {initials || "?"}
                </span>
                Mon profil
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
                style={{ color: "#ef4444", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}
              >
                <LogOut size={15} />
                Se déconnecter
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-sm px-5 py-3 mt-2 text-center rounded-xl"
            >
              Connexion / Inscription
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
