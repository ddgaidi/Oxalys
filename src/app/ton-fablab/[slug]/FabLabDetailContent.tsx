"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Globe, Mail, Phone, MapPin,
  Wrench, CheckCircle2, AlertTriangle, Ban,
  Cpu, ExternalLink,
} from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import FabLabFavoriteButton from "./FabLabFavoriteButton";
import type { FabLab, SafetyLevel } from "@/types";

/* ── Safety config ── */
const SAFETY: Record<SafetyLevel, { color: string; bg: string; border: string; label: string; icon: typeof CheckCircle2 }> = {
  safe:    { color: "#10b981", bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.35)",  label: "Accessible · 100% Safe",      icon: CheckCircle2 },
  caution: { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)",  label: "Accessible · Faire attention", icon: AlertTriangle },
  danger:  { color: "#ef4444", bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.35)",   label: "Interdit d'accès",             icon: Ban },
};

export default function FabLabDetailContent({ fablab }: { fablab: FabLab }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const safety = SAFETY[fablab.safety];
  const SafetyIcon = safety.icon;

  /* ── Theme-aware tokens ── */
  const pageBg  = isDark
    ? "linear-gradient(160deg, #080c18 0%, #0a0f1e 40%, #06111a 100%)"
    : "linear-gradient(160deg, #f0f4ff 0%, #f8faff 40%, #eef6f2 100%)";
  const dotColor = isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.09)";
  const cardBg   = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const cardShadow = isDark ? "none" : "0 2px 12px rgba(0,0,0,0.05)";
  const sectionLabel = isDark ? "rgba(255,255,255,0.35)" : "#94a3b8";
  const bodyText     = isDark ? "rgba(255,255,255,0.7)" : "#374151";
  const titleColor   = isDark ? "#ffffff" : "#0f172a";
  const locColor     = isDark ? "rgba(255,255,255,0.6)" : "#64748b";
  const eqTagBg      = isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.06)";
  const eqTagBorder  = isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.18)";
  const eqTagColor   = isDark ? "rgba(147,197,253,0.85)" : "#2563eb";
  const pillBg       = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const pillBorder   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const pillColor    = isDark ? "rgba(255,255,255,0.6)" : "#64748b";
  const backBg       = isDark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.7)";
  const backBorder   = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  const backColor    = isDark ? "rgba(255,255,255,0.8)" : "#374151";
  const linkBg       = isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.06)";
  const linkBorder   = isDark ? "rgba(59,130,246,0.18)" : "rgba(59,130,246,0.15)";
  const contactBg    = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const contactBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const contactColor  = isDark ? "rgba(255,255,255,0.6)" : "#374151";
  const noContact     = isDark ? "rgba(255,255,255,0.3)" : "#94a3b8";
  const safetyDescColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  return (
    <div className="min-h-screen" style={{ background: pageBg }}>
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Hero cover ── */}
      <div className="relative z-10 w-full" style={{ height: "clamp(240px, 40vh, 380px)" }}>
        {/* Safety top stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 z-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${safety.color}, transparent)`,
            boxShadow: `0 0 16px ${safety.color}`,
          }}
        />

        {/* Image or fallback */}
        {fablab.cover_url ? (
          <Image
            src={fablab.cover_url}
            alt={fablab.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #0f2d4a 0%, #1a1040 100%)"
                : "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
            }}
          >
            <Wrench size={48} style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }} />
            <span className="text-xs" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
              Pas d&apos;image disponible
            </span>
          </div>
        )}

        {/* Gradient overlays — always dark for text legibility */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: isDark
              ? "linear-gradient(to top, #080c18 0%, rgba(8,12,24,0.5) 50%, transparent 100%)"
              : "linear-gradient(to top, rgba(240,244,255,0.95) 0%, rgba(240,244,255,0.4) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: isDark
              ? "linear-gradient(to right, rgba(8,12,24,0.4) 0%, transparent 100%)"
              : "linear-gradient(to right, rgba(240,244,255,0.3) 0%, transparent 100%)",
          }}
        />

        {/* Back button — top left */}
        <Link
          href="/ton-fablab"
          className="absolute top-5 left-5 z-20 flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl backdrop-blur-md transition-all duration-200 hover:scale-105"
          style={{
            background: backBg,
            border: `1px solid ${backBorder}`,
            color: backColor,
          }}
        >
          <ArrowLeft size={15} />
          Retour
        </Link>

        {/* Safety badge — top right */}
        <div
          className="absolute top-5 right-5 z-20 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-md"
          style={{ background: safety.bg, border: `1px solid ${safety.border}`, color: safety.color }}
        >
          <SafetyIcon size={12} />
          {safety.label}
        </div>

        {/* Title block — bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-6 max-w-4xl mx-auto">
          <h1
            className="font-display font-bold leading-tight tracking-tight drop-shadow-xl"
            style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", color: titleColor }}
          >
            {fablab.name}
          </h1>
          <div className="flex items-center gap-1.5 mt-1.5" style={{ color: locColor }}>
            <MapPin size={13} />
            <span className="text-sm">
              {fablab.city}
              {fablab.zip_code && ` · ${fablab.zip_code}`}
              {fablab.address && ` · ${fablab.address}`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 py-8 pb-20">

        {/* Action bar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          {fablab.equipment && fablab.equipment.length > 0 && (
            <div
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm"
              style={{ background: pillBg, border: `1px solid ${pillBorder}`, color: pillColor }}
            >
              <Cpu size={14} style={{ color: "#3b82f6" }} />
              {fablab.equipment.length} équipement{fablab.equipment.length > 1 ? "s" : ""} disponible{fablab.equipment.length > 1 ? "s" : ""}
            </div>
          )}
          <FabLabFavoriteButton fablabId={fablab.id} isDark={isDark} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left column: Description + Equipment */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Description */}
            <div
              className="rounded-2xl p-6"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
            >
              <h2 className="font-display font-semibold text-sm uppercase tracking-widest mb-4" style={{ color: sectionLabel }}>
                Description
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: bodyText }}>
                {fablab.description}
              </p>
            </div>

            {/* Equipment */}
            {fablab.equipment && fablab.equipment.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
              >
                <h2 className="font-display font-semibold text-sm uppercase tracking-widest mb-4" style={{ color: sectionLabel }}>
                  Équipements
                </h2>
                <div className="flex flex-wrap gap-2">
                  {fablab.equipment.map((eq) => (
                    <span
                      key={eq}
                      className="text-xs font-medium px-3 py-1.5 rounded-xl cursor-default transition-all duration-200"
                      style={{ background: eqTagBg, border: `1px solid ${eqTagBorder}`, color: eqTagColor }}
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Safety + Contact */}
          <div className="flex flex-col gap-5">

            {/* Safety detail card */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: safety.bg,
                border: `1px solid ${safety.border}`,
                boxShadow: `0 0 30px ${safety.color}14`,
              }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${safety.color}20`, border: `1px solid ${safety.color}40` }}
                >
                  <SafetyIcon size={17} style={{ color: safety.color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: sectionLabel }}>
                    Statut de sécurité
                  </p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: safety.color }}>
                    {safety.label}
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: safetyDescColor }}>
                {fablab.safety === "safe"
                  ? "Les conditions d'air ont été vérifiées. Cet espace est sûr pour tous les utilisateurs."
                  : fablab.safety === "caution"
                  ? "Des précautions sont recommandées. Consultez le responsable avant d'utiliser certaines machines."
                  : "L'accès à cet espace est temporairement interdit. Contactez l'établissement pour plus d'informations."}
              </p>
            </div>

            {/* Contact */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
            >
              <h2 className="font-display font-semibold text-sm uppercase tracking-widest mb-1" style={{ color: sectionLabel }}>
                Contact &amp; Liens
              </h2>

              {fablab.website && (
                <a
                  href={fablab.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm rounded-xl px-3 py-2.5 transition-all duration-200 group"
                  style={{ background: linkBg, border: `1px solid ${linkBorder}`, color: "#3b82f6" }}
                >
                  <Globe size={14} className="shrink-0" />
                  <span className="truncate flex-1">{fablab.website.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink size={12} className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {fablab.email && (
                <a
                  href={`mailto:${fablab.email}`}
                  className="flex items-center gap-2.5 text-sm rounded-xl px-3 py-2.5 transition-all duration-200"
                  style={{ background: contactBg, border: `1px solid ${contactBorder}`, color: contactColor }}
                >
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">{fablab.email}</span>
                </a>
              )}

              {fablab.phone && (
                <a
                  href={`tel:${fablab.phone}`}
                  className="flex items-center gap-2.5 text-sm rounded-xl px-3 py-2.5 transition-all duration-200"
                  style={{ background: contactBg, border: `1px solid ${contactBorder}`, color: contactColor }}
                >
                  <Phone size={14} className="shrink-0" />
                  <span>{fablab.phone}</span>
                </a>
              )}

              {!fablab.website && !fablab.email && !fablab.phone && (
                <p className="text-xs" style={{ color: noContact }}>
                  Aucune information de contact disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
