"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import { fetchFabLabs } from "@/lib/supabase/fablabs";
import type { FabLab, Gender } from "@/types";

function OxalysLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/oxalys.png"
        alt="Oxalys Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}

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

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const isPhone = /^\+?[0-9\s]{8,}$/.test(identifier);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: isPhone ? "" : identifier,
      password,
      phone: isPhone ? identifier : undefined,
    } as Parameters<typeof supabase.auth.signInWithPassword>[0]);
    setLoading(false);
    if (err) return setError(err.message);
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">
          Email ou téléphone
        </label>
        <input
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="email@exemple.fr"
          className="input-brand"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="input-brand"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary py-3.5 mt-2 disabled:opacity-60"
      >
        {loading ? "Connexion..." : "Se connecter →"}
      </button>

      <a href="#" className="text-center text-sky-400 text-sm hover:underline">
        Mot de passe oublié ?
      </a>
    </div>
  );
}

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const STEPS = ["Identité", "Contact", "FabLab", "Sécurité"];

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const GENDERS: { value: Gender; label: string }[] = [
  { value: "homme", label: "👨 Homme" },
  { value: "femme", label: "👩 Femme" },
  { value: "non-binaire", label: "🧑 Non-binaire" },
  { value: "non-precise", label: "🔒 Non précisé" },
];

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface FormData {
  gender: Gender | "";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fablabId: string | null;
  password: string;
  confirmPassword: string;
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
function RegisterForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [fablabs, setFablabs] = useState<FabLab[]>([]);
  const [loadingFablabs, setLoadingFablabs] = useState(true);
  const [form, setForm] = useState<FormData>({
    gender: "", firstName: "", lastName: "",
    email: "", phone: "", fablabId: null,
    password: "", confirmPassword: "",
  });
  const router = useRouter();

  useEffect(() => {
    async function loadFabLabs() {
      try {
        const data = await fetchFabLabs();
        setFablabs(data);
      } catch (err) {
        console.error("Failed to load fablabs", err);
      } finally {
        setLoadingFablabs(false);
      }
    }
    loadFabLabs();
  }, []);

  const set = (key: keyof FormData, value: FormData[keyof FormData]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleFinish() {
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          gender: form.gender,
          phone: form.phone,
          fablabId: form.fablabId,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Impossible de creer le compte.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/"), 2200);
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-display font-black text-xl text-gradient mb-2">Bienvenue !</h2>
        <p className="text-[var(--text-muted)] text-sm">Votre compte a été créé. Si vous avez choisi un FabLab, une demande de certification est envoyée à son équipe.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Step progress */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
              i <= step ? "bg-gradient-brand" : "bg-[var(--border)]"
            }`}
            title={label}
          />
        ))}
      </div>

      <p className="font-display font-bold text-base mb-5 text-[var(--text-muted)]">
        Étape {step + 1} — <span className="text-[var(--text)]">{STEPS[step]}</span>
      </p>

      {/* Step 0 — Identity */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-2">Genre</label>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("gender", value)}
                  className={`py-3 px-3 rounded-xl border font-semibold text-sm transition-all ${
                    form.gender === value
                      ? "border-sky-400 bg-sky-400/10 text-sky-400"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-sky-400/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Prénom *</label>
            <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
              placeholder="Jean" className="input-brand" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Nom *</label>
            <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
              placeholder="Dupont" className="input-brand" />
          </div>
        </div>
      )}

      {/* Step 1 — Contact */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              placeholder="jean@exemple.fr" className="input-brand" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">
              Téléphone <span className="font-normal opacity-60">(optionnel)</span>
            </label>
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
              placeholder="+33 6 12 34 56 78" className="input-brand" />
          </div>
        </div>
      )}

      {/* Step 2 — FabLab */}
      {step === 2 && (
        <div className="flex flex-col gap-3">
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-1">
            Choisissez votre FabLab de référence (optionnel — vous pourrez en ajouter d&apos;autres plus tard).
          </p>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {loadingFablabs ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-400"></div>
              </div>
            ) : fablabs.length > 0 ? (
              fablabs.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => set("fablabId", f.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    form.fablabId === f.id
                      ? "border-sky-400 bg-sky-400/10"
                      : "border-[var(--border)] hover:border-sky-400/30"
                  }`}
                >
                  <p className={`font-bold text-sm ${form.fablabId === f.id ? "text-sky-400" : "text-[var(--text)]"}`}>
                    {f.name}
                  </p>
                  <p className="text-[var(--text-muted)] text-xs">{f.city} · {f.zip_code}</p>
                </button>
              ))
            ) : (
              <p className="text-center py-4 text-xs text-[var(--text-muted)]">
                Aucun FabLab trouvé.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => { set("fablabId", null); setStep(3); }}
            className="text-[var(--text-muted)] text-sm text-left hover:text-sky-400 transition-colors"
          >
            Passer cette étape →
          </button>
        </div>
      )}

      {/* Step 3 — Password */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Mot de passe *</label>
            <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)}
              placeholder="Minimum 8 caractères" className="input-brand" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Confirmer *</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)}
              placeholder="••••••••" className="input-brand" />
          </div>
          <div className="bg-green-400/8 border border-green-400/20 rounded-xl p-4 text-xs text-green-400">
            ✓ En créant votre compte, vous acceptez nos CGU et notre politique de confidentialité.
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Nav buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="btn-outline flex-1 py-3.5"
          >
            ← Retour
          </button>
        )}
        <button
          type="button"
          onClick={() => step < 3 ? setStep((s) => s + 1) : handleFinish()}
          disabled={loading}
          className="btn-primary flex-[2] py-3.5 disabled:opacity-60"
        >
          {loading ? "Création..." : step < 3 ? "Suivant →" : "Finaliser 🎉"}
        </button>
      </div>
    </div>
  );
}
