"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { fetchFabLabs } from "@/lib/supabase/fablabs";
import type { Gender, FabLab } from "@/types";

const STEPS = ["Identité", "Contact", "FabLab", "Sécurité"];

const GENDERS: { value: Gender; label: string }[] = [
  { value: "homme", label: "👨 Homme" },
  { value: "femme", label: "👩 Femme" },
  { value: "non-binaire", label: "🧑 Non-binaire" },
  { value: "non-precise", label: "🔒 Non précisé" },
];

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

export default function RegisterForm() {
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
  const supabase = createClient();

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
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          gender: form.gender,
          phone: form.phone,
          fablab_id: form.fablabId,
        },
      },
    });
    setLoading(false);
    if (err) return setError(err.message);
    if (data) { setDone(true); setTimeout(() => router.push("/"), 2000); }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-display font-black text-xl text-gradient mb-2">Bienvenue !</h2>
        <p className="text-[var(--text-muted)] text-sm">Votre compte a été créé. Redirection…</p>
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
