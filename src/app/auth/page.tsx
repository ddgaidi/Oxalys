"use client";

import { useState } from "react";
import OxalysLogo from "@/components/ui/OxalysLogo";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Mode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5 py-12 grid-bg">
      <div className="w-full max-w-md">
        <div className="card-strong rounded-2xl p-8 shadow-xl shadow-black/10">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="flex justify-center mb-4">
              <OxalysLogo size={40} />
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight mb-1">
              {mode === "login" ? "Bon retour" : "Rejoindre Oxalys"}
            </h1>
            <p className="text-[var(--text-muted)] text-sm">
              {mode === "login"
                ? "Connectez-vous à votre compte"
                : "Créez votre compte gratuitement"}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex border border-[var(--border-strong)] rounded-lg p-1 mb-7">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? "bg-gradient-brand text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
