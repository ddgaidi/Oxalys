"use client";

/*
 * Commentaires de structure : Affiche l ecran d authentification et bascule entre connexion et inscription.
 */
import { useState } from "react";
import OxalysLogo from "@/components/ui/OxalysLogo";
import { useTheme } from "@/lib/context/ThemeContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// Type local : limite les valeurs possibles et securise les branches de logique.
type Mode = "login" | "register";

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pageBg     = isDark ? "linear-gradient(160deg, #080c18 0%, #0a0f1e 40%, #06111a 100%)" : "linear-gradient(160deg, #f0f4ff 0%, #f8faff 40%, #eef6f2 100%)";
  const dotColor   = isDark ? "rgba(59,130,246,0.13)" : "rgba(59,130,246,0.08)";
  const glowBg     = isDark ? "radial-gradient(ellipse, rgba(59,130,246,0.14) 0%, transparent 70%)" : "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)";
  const cardBg     = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.88)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const cardShadow = isDark ? "0 0 40px rgba(59,130,246,0.08), 0 24px 48px rgba(0,0,0,0.3)" : "0 4px 32px rgba(0,0,0,0.08)";
  const titleColor = isDark ? "#ffffff"                : "#0f172a";
  const subColor   = isDark ? "rgba(255,255,255,0.5)"  : "#64748b";
  const tabBg      = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const tabBorder  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const tabColor   = isDark ? "rgba(255,255,255,0.45)" : "#64748b";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-16 relative"
      style={{ background: pageBg }}
    >
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 pointer-events-none z-0"
        style={{ background: glowBg }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Safety top stripe */}
        <div
          className="w-full h-0.5 rounded-full mb-6"
          style={{ background: "linear-gradient(90deg, transparent, #3b82f6, #10b981, transparent)" }}
        />

        <div
          className="rounded-2xl p-8"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow, backdropFilter: "blur(20px)" }}
        >
          {/* Header */}
          <div className="text-center mb-7">
            <div className="flex justify-center mb-5">
              <OxalysLogo size={140} />
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight mb-1.5" style={{ color: titleColor }}>
              {mode === "login" ? "Bon retour" : "Rejoindre Oxalys"}
            </h1>
            <p className="text-sm" style={{ color: subColor }}>
              {mode === "login" ? "Connectez-vous à votre compte" : "Créez votre compte gratuitement"}
            </p>
          </div>

          {/* Mode tabs */}
          <div
            className="flex rounded-xl p-1 mb-7"
            style={{ background: tabBg, border: `1px solid ${tabBorder}` }}
          >
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={
                  mode === m
                    ? {
                        background: "linear-gradient(135deg, #2563eb, #059669)",
                        color: "white",
                        boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                      }
                    : { color: tabColor, background: "transparent" }
                }
              >
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs mt-5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#94a3b8" }}>
          La consultation des FabLabs est toujours gratuite pour les étudiants
        </p>
      </div>
    </div>
  );
}
