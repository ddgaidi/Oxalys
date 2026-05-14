"use client";

/*
 * Commentaires de structure : Gere le formulaire de connexion et la redirection apres authentification.
 */
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function LoginForm() {
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
