import Link from "next/link";
import { ArrowRight, Cpu, Layers, Zap } from "lucide-react";

const FEATURE_PILLS = [
  { icon: Cpu, label: "Impression 3D" },
  { icon: Zap, label: "Découpe laser" },
  { icon: Layers, label: "CNC & Fraisage" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-5 py-24 overflow-hidden grid-bg">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-emerald-500/6 blur-[80px] animate-pulse-glow [animation-delay:2s]" />
      </div>

      {/* Radial fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-card)] rounded-full px-4 py-1.5 mb-8 text-[var(--text-muted)] text-sm font-medium animate-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-brand inline-block" />
          La plateforme des makers français
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.1] tracking-tight mb-6 animate-fade-in-up [animation-delay:0.08s] opacity-0"
        >
          Trouve ton{" "}
          <span className="text-gradient">FabLab idéal.</span>
          <br />
          Créez{" "}
          <span className="text-gradient">ensemble.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[var(--text-muted)] text-[clamp(1rem,2vw,1.15rem)] max-w-xl mx-auto leading-relaxed mb-10 animate-fade-in-up [animation-delay:0.16s] opacity-0">
          Oxalys connecte makers, étudiants et professionnels aux meilleurs
          espaces de fabrication numérique partout en France.
        </p>

        {/* CTAs */}
        <div className="flex gap-3 justify-center flex-wrap mb-12 animate-fade-in-up [animation-delay:0.24s] opacity-0">
          <Link
            href="/ton-fablab"
            className="btn-primary px-7 py-3 text-base shadow-lg shadow-blue-600/20 gap-2"
          >
            Explorer les FabLabs
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/auth"
            className="btn-outline px-7 py-3 text-base"
          >
            Créer un compte
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex items-center justify-center gap-3 flex-wrap animate-fade-in-up [animation-delay:0.32s] opacity-0">
          {FEATURE_PILLS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] border border-[var(--border)] rounded-full px-3 py-1.5 bg-[var(--bg-card)]"
            >
              <Icon size={12} className="text-blue-500" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
