"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Ban,
  CheckCircle2,
  Heart,
  MapPin,
  Search,
  Sparkles,
  WifiOff,
  Wrench,
} from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { fetchFabLabs } from "@/lib/supabase/fablabs";
import { useTheme } from "@/lib/context/ThemeContext";
import type { FabLab } from "@/types";

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const AIR_QUALITY_POLLING_INTERVAL_MS = 1000;

/* ── Safety filter config ── */
const FILTERS = [
  { id: "all",     label: "Tous",         icon: Sparkles,      color: "#3b82f6" },
  { id: "optimal", label: "Optimal",      icon: CheckCircle2,  color: "#10b981" },
  { id: "medium",  label: "Moyen",        icon: AlertCircle,   color: "#facc15" },
  { id: "alert",   label: "Alerte",       icon: AlertTriangle, color: "#f97316" },
  { id: "danger",  label: "Danger",       icon: Ban,           color: "#ef4444" },
  { id: "maintenance", label: "Maintenance", icon: Wrench,     color: "#8b5cf6" },
  { id: "offline", label: "Hors service", icon: WifiOff,       color: "#94a3b8" },
] as const;
// Type local : limite les valeurs possibles et securise les branches de logique.
type FilterId = typeof FILTERS[number]["id"];

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function hasFabLabAirQualityChanged(current: FabLab[], next: FabLab[]) {
  if (current.length !== next.length) return true;

  return next.some((nextFabLab) => {
    const currentFabLab = current.find((fablab) => fablab.id === nextFabLab.id);
    return (
      !currentFabLab ||
      currentFabLab.safety !== nextFabLab.safety ||
      currentFabLab.air_quality_average !== nextFabLab.air_quality_average
    );
  });
}

/* ── Animated dot background ── */
function DotGrid({ isDark }: { isDark: boolean }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: isDark
          ? "radial-gradient(circle, rgba(59,130,246,0.15) 1px, transparent 1px)"
          : "radial-gradient(circle, rgba(59,130,246,0.09) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

/* ── Skeleton card ── */
function SkeletonCard({ isDark }: { isDark: boolean }) {
  const bg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const shine = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: bg }}>
      <div className="h-52 animate-shimmer" style={{ background: shine }} />
      <div className="px-4 py-3 flex gap-2">
        <div className="h-4 w-20 rounded-full animate-shimmer" style={{ background: shine }} />
        <div className="h-4 w-16 rounded-full animate-shimmer" style={{ background: shine }} />
      </div>
    </div>
  );
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function TonFabLabPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [fablabs, setFablabs] = useState<FabLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites(undefined);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    async function refreshFabLabs(showLoader = false) {
      if (isFetching) return;
      isFetching = true;

      try {
        const freshFabLabs = await fetchFabLabs();
        if (!isMounted) return;

        setFablabs((currentFabLabs) =>
          hasFabLabAirQualityChanged(currentFabLabs, freshFabLabs)
            ? freshFabLabs
            : currentFabLabs
        );
      } finally {
        isFetching = false;
        if (isMounted && showLoader) setLoading(false);
      }
    }

    refreshFabLabs(true);
    const intervalId = window.setInterval(refreshFabLabs, AIR_QUALITY_POLLING_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  /* ── Keyboard shortcut: "/" to focus search ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    let result = fablabs;
    const q = query.toLowerCase().trim();
    if (q) result = result.filter(
      (f) => f.name.toLowerCase().includes(q) || f.zip_code.includes(q) || f.city.toLowerCase().includes(q)
    );
    if (filter !== "all") result = result.filter((f) => f.safety === filter);
    return result;
  }, [query, filter, fablabs]);

  const sorted = useMemo(() => [
    ...filtered.filter((f) => favorites.includes(f.id)),
    ...filtered.filter((f) => !favorites.includes(f.id)),
  ], [filtered, favorites]);

  const optimalCount = fablabs.filter((f) => f.safety === "optimal").length;
  const mediumCount  = fablabs.filter((f) => f.safety === "medium").length;
  const alertCount   = fablabs.filter((f) => f.safety === "alert").length;
  const dangerCount  = fablabs.filter((f) => f.safety === "danger").length;
  const maintenanceCount = fablabs.filter((f) => f.safety === "maintenance").length;
  const offlineCount = fablabs.filter((f) => f.safety === "offline").length;

  /* ── Theme-aware tokens ── */
  const pageBg   = isDark
    ? "linear-gradient(160deg, #080c18 0%, #0a0f1e 40%, #06111a 100%)"
    : "linear-gradient(160deg, #f0f4ff 0%, #f8faff 40%, #eef6f2 100%)";
  const titleColor   = isDark ? "#ffffff" : "#0f172a";
  const subtitleColor = isDark ? "#94a3b8" : "#64748b";
  const stripBg      = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)";
  const stripBorder  = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const stripDivider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const statLabel    = isDark ? "#475569" : "#94a3b8";
  const searchBg     = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)";
  const searchBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const searchFocusBorder = "rgba(59,130,246,0.5)";
  const searchFocusShadow = isDark
    ? "0 0 0 3px rgba(59,130,246,0.12), 0 0 30px rgba(59,130,246,0.1)"
    : "0 0 0 3px rgba(59,130,246,0.1), 0 4px 20px rgba(59,130,246,0.08)";
  const searchTextColor   = isDark ? "#e2e8f0" : "#0f172a";
  const searchIconColor   = isDark ? "#475569" : "#94a3b8";
  const kbdBg      = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const kbdColor   = isDark ? "#475569" : "#94a3b8";
  const kbdBorder  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const filterInactiveBg     = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const filterInactiveBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const filterInactiveColor  = isDark ? "#64748b" : "#94a3b8";
  const resultsMeta = isDark ? "#475569" : "#94a3b8";
  const emptyBg     = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)";
  const emptyBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const emptyTitle  = isDark ? "#f1f5f9" : "#0f172a";
  const emptyText   = isDark ? "#64748b" : "#94a3b8";
  const footerText  = isDark ? "#334155" : "#94a3b8";
  const badgeBg     = isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.07)";
  const badgeBorder = isDark ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.25)";
  const glowBg      = isDark
    ? "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)"
    : "radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)";

  return (
    <div
      className="min-h-screen relative"
      style={{ background: pageBg }}
    >
      <DotGrid isDark={isDark} />

      {/* ── Hero header ── */}
      <div className="relative z-10 pt-16 pb-10 px-5 text-center animate-header">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-56 pointer-events-none"
          style={{ background: glowBg }}
        />

        <div className="relative max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
            style={{ borderColor: badgeBorder, color: "#60a5fa", background: badgeBg }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-dot-pulse"
              style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }}
            />
            {loading ? "Chargement…" : `${fablabs.length} FabLabs en ligne`}
          </div>

          <h1
            className="font-display font-bold leading-tight tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: titleColor }}
          >
            Trouve ton{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              espace de création
            </span>
          </h1>

          <p style={{ color: subtitleColor }} className="text-base mb-2">
            Consulte en temps réel la sécurité de chaque FabLab avant d&apos;entrer
          </p>
        </div>
      </div>

      {/* ── Stats strip ── */}
      {!loading && (
        <div className="relative z-10 max-w-4xl mx-auto px-5 mb-8 animate-counter">
          <div
            className="grid grid-cols-3 sm:grid-cols-6 divide-x rounded-2xl overflow-hidden"
            style={{
              border: `1px solid ${stripBorder}`,
              background: stripBg,
              boxShadow: isDark ? "none" : "0 1px 8px rgba(0,0,0,0.06)",
            }}
          >
            {[
              { count: optimalCount, color: "#10b981", label: "Optimaux" },
              { count: mediumCount,  color: "#facc15", label: "Moyens" },
              { count: alertCount,   color: "#f97316", label: "Alertes" },
              { count: dangerCount,  color: "#ef4444", label: "Dangers" },
              { count: maintenanceCount, color: "#8b5cf6", label: "Maint." },
              { count: offlineCount, color: "#94a3b8", label: "HS" },
            ].map(({ count, color, label }) => (
              <div key={label} className="flex flex-col items-center py-3 gap-0.5" style={{ borderColor: stripDivider }}>
                <span className="font-display font-bold text-xl" style={{ color }}>{count}</span>
                <span className="text-[11px]" style={{ color: statLabel }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Search + Filter bar ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 mb-10 flex flex-col gap-3">
        <div
          className="relative rounded-2xl transition-all duration-300"
          style={{
            background: searchBg,
            border: `1px solid ${focused ? searchFocusBorder : searchBorder}`,
            boxShadow: focused ? searchFocusShadow : (isDark ? "none" : "0 1px 4px rgba(0,0,0,0.05)"),
          }}
        >
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: focused ? "#60a5fa" : searchIconColor }}
          />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Rechercher par nom, ville ou code postal…"
            disabled={loading}
            className="w-full bg-transparent pl-11 pr-24 py-4 text-sm outline-none placeholder:text-[#94a3b8]"
            style={{ color: searchTextColor, fontFamily: "Inter, sans-serif" }}
          />
          {!focused && !query && (
            <kbd
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: kbdBg, color: kbdColor, border: `1px solid ${kbdBorder}` }}
            >
              /
            </kbd>
          )}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs transition-colors"
              style={{ color: isDark ? "#64748b" : "#94a3b8" }}
            >
              Effacer
            </button>
          )}
        </div>

        {/* Safety filters */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ id, label, icon: Icon, color }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: active ? `${color}20` : filterInactiveBg,
                  border: `1px solid ${active ? color + "50" : filterInactiveBorder}`,
                  color: active ? color : filterInactiveColor,
                  boxShadow: active ? `0 0 12px ${color}25` : "none",
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            );
          })}

          {!loading && (
            <span className="ml-auto text-xs self-center" style={{ color: resultsMeta }}>
              {sorted.length} résultat{sorted.length !== 1 ? "s" : ""}
              {favorites.length > 0 && ` · ${favorites.length} favori${favorites.length > 1 ? "s" : ""}`}
            </span>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} isDark={isDark} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="text-center py-24 rounded-3xl"
            style={{ background: emptyBg, border: `1px solid ${emptyBorder}`, boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <Search size={40} className="mx-auto mb-4" style={{ color: isDark ? "#334155" : "#cbd5e1" }} />
            <p className="font-display font-semibold text-lg mb-2" style={{ color: emptyTitle }}>Aucun résultat</p>
            <p className="text-sm" style={{ color: emptyText }}>Aucun FabLab ne correspond à votre recherche</p>
            <button
              onClick={() => { setQuery(""); setFilter("all"); }}
              className="mt-6 text-sm text-blue-500 hover:text-blue-400 transition-colors"
            >
              Réinitialiser les filtres →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((fablab, i) => (
              <FabLabGridCard
                key={fablab.id}
                fablab={fablab}
                isFavorite={favorites.includes(fablab.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => router.push(`/ton-fablab/${fablab.slug}`)}
                index={i}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>

      <p className="relative z-10 text-center text-xs pb-8" style={{ color: footerText }}>
        Connectez-vous pour synchroniser vos favoris · données mises à jour chaque seconde
      </p>
    </div>
  );
}

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
// Configuration locale qui pilote le rendu ou le comportement de ce module.
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

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function cardGradient(name: string, isDark: boolean) {
  const list = isDark ? DARK_GRADIENTS : LIGHT_GRADIENTS;
  const idx = name.charCodeAt(0) % list.length;
  const [a, b] = list[idx];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

/* ── Safety config ── */
const SAFETY = {
  optimal: { color: "#10b981", label: "Optimal",      Icon: CheckCircle2 },
  medium:  { color: "#facc15", label: "Moyen",        Icon: AlertCircle },
  alert:   { color: "#f97316", label: "Alerte",       Icon: AlertTriangle },
  danger:  { color: "#ef4444", label: "Danger",       Icon: Ban },
  maintenance: { color: "#8b5cf6", label: "Maintenance", Icon: Wrench },
  offline: { color: "#94a3b8", label: "Hors service", Icon: WifiOff },
};

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface Props {
  fablab: FabLab;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
  index: number;
  isDark: boolean;
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
function FabLabGridCard({ fablab, isFavorite, onToggleFavorite, onClick, index, isDark }: Props) {
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
