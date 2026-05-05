"use client";

import { useRef } from "react";
import Image from "next/image";
import { Heart, MapPin, ArrowUpRight, CheckCircle2, AlertTriangle, Ban } from "lucide-react";
import type { FabLab } from "@/types";

/* ── Unique gradient per card (from name hash) ── */
const DARK_GRADIENTS = [
  ["#0f2d4a", "#1a1040"],
  ["#0a2e1e", "#0f1e30"],
  ["#1e0a2e", "#2e1040"],
  ["#2e1a0a", "#1e0a20"],
  ["#0a1e2e", "#102040"],
  ["#2e0a1a", "#200a30"],
  ["#0a2e2e", "#102030"],
  ["#1a2e0a", "#0a1e10"],
];
const LIGHT_GRADIENTS = [
  ["#dbeafe", "#ede9fe"],
  ["#d1fae5", "#cffafe"],
  ["#ede9fe", "#fce7f3"],
  ["#fef3c7", "#e0f2fe"],
  ["#e0f2fe", "#dbeafe"],
  ["#fce7f3", "#ede9fe"],
  ["#cffafe", "#d1fae5"],
  ["#d1fae5", "#fef3c7"],
];

function cardGradient(name: string, isDark: boolean) {
  const list = isDark ? DARK_GRADIENTS : LIGHT_GRADIENTS;
  const idx = name.charCodeAt(0) % list.length;
  const [a, b] = list[idx];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

/* ── Safety config ── */
const SAFETY = {
  safe:    { color: "#10b981", label: "Optimal", Icon: CheckCircle2 },
  caution: { color: "#f59e0b", label: "Alerte",  Icon: AlertTriangle },
  danger:  { color: "#ef4444", label: "Danger",  Icon: Ban },
};

interface Props {
  fablab: FabLab;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
  index: number;
  isDark: boolean;
}

export default function FabLabGridCard({ fablab, isFavorite, onToggleFavorite, onClick, index, isDark }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const safety = SAFETY[fablab.safety];

  /* ── 3-D tilt on mouse move ── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - 0.5) * 14;
    const y = ((e.clientY - top)  / height - 0.5) * -14;
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale(1.03) translateY(-4px)`;
    el.style.transition = "transform 0.08s linear";
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1) translateY(0)";
    el.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
  };

  /* ── Theme-aware tokens for the card footer ── */
  const footerBg      = isDark ? "rgba(10,14,26,0.95)" : "rgba(255,255,255,0.97)";
  const tagBg         = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)";
  const tagColor      = isDark ? "rgba(255,255,255,0.55)" : "#64748b";
  const tagBorder     = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const overflowColor = isDark ? "rgba(255,255,255,0.3)" : "#94a3b8";

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="animate-card-reveal relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        animationDelay: `${index * 0.06}s`,
        willChange: "transform",
        transformStyle: "preserve-3d",
        boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.07)",
        border: isDark ? "none" : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Image / gradient background ── */}
      <div className="relative h-52 w-full overflow-hidden"
        style={{ background: cardGradient(fablab.name, isDark) }}
      >
        {fablab.cover_url && (
          <Image
            src={fablab.cover_url}
            alt={fablab.name}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
          />
        )}

        {/* Gradient overlay — always dark for text legibility on the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Safety top stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${safety.color}, transparent)`,
            boxShadow: `0 0 12px ${safety.color}`,
          }}
        />

        {/* Scan line on hover */}
        <div
          className="absolute left-0 right-0 h-[1px] opacity-0 group-hover:animate-scan-sweep pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${safety.color}cc, transparent)` }}
        />

        {/* Top bar: safety badge + fav */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md"
            style={{
              background: `${safety.color}22`,
              border: `1px solid ${safety.color}55`,
              color: safety.color,
            }}
          >
            <safety.Icon size={10} />
            {safety.label}
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(fablab.id); }}
            className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200"
            style={{
              background: isFavorite ? "rgba(239,68,68,0.25)" : "rgba(0,0,0,0.35)",
              border: `1px solid ${isFavorite ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.15)"}`,
            }}
            aria-label="Favori"
          >
            <Heart
              size={14}
              className="transition-all duration-200"
              style={{ color: isFavorite ? "#ef4444" : "rgba(255,255,255,0.7)", fill: isFavorite ? "#ef4444" : "none" }}
            />
          </button>
        </div>

        {/* Bottom overlay: name + location */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display font-bold text-white text-base leading-tight mb-1.5 drop-shadow-lg">
            {fablab.name}
          </h3>
          <div className="flex items-center gap-1 text-white/70 text-xs">
            <MapPin size={11} className="shrink-0" />
            {fablab.city}
            {fablab.zip_code && ` · ${fablab.zip_code}`}
          </div>
        </div>
      </div>

      {/* ── Bottom content ── */}
      <div
        className="px-4 py-3 flex items-center justify-between gap-3"
        style={{
          background: footerBg,
          borderTop: `1px solid ${safety.color}20`,
        }}
      >
        {/* Equipment tags */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
          {(fablab.equipment ?? []).slice(0, 3).map((eq) => (
            <span
              key={eq}
              className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: tagBg, color: tagColor, border: `1px solid ${tagBorder}` }}
            >
              {eq}
            </span>
          ))}
          {(fablab.equipment?.length ?? 0) > 3 && (
            <span className="text-[10px]" style={{ color: overflowColor }}>
              +{(fablab.equipment?.length ?? 0) - 3}
            </span>
          )}
        </div>

        {/* Arrow */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
          style={{ background: `${safety.color}25`, border: `1px solid ${safety.color}40` }}
        >
          <ArrowUpRight size={13} style={{ color: safety.color }} />
        </div>
      </div>

      {/* ── Outer glow border on hover ── */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 1px ${safety.color}40, 0 0 30px ${safety.color}20` }}
      />
    </div>
  );
}
