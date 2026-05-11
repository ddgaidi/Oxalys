"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, AlertCircle, CheckCircle2, AlertTriangle, Ban, WifiOff,
  Sparkles
} from "lucide-react";
import FabLabGridCard from "./FabLabGridCard";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { fetchFabLabs } from "@/lib/supabase/fablabs";
import { useTheme } from "@/lib/context/ThemeContext";
import type { FabLab } from "@/types";

const AIR_QUALITY_POLLING_INTERVAL_MS = 1000;

/* ── Safety filter config ── */
const FILTERS = [
  { id: "all",     label: "Tous",         icon: Sparkles,      color: "#3b82f6" },
  { id: "optimal", label: "Optimal",      icon: CheckCircle2,  color: "#10b981" },
  { id: "medium",  label: "Moyen",        icon: AlertCircle,   color: "#facc15" },
  { id: "alert",   label: "Alerte",       icon: AlertTriangle, color: "#f97316" },
  { id: "danger",  label: "Danger",       icon: Ban,           color: "#ef4444" },
  { id: "offline", label: "Hors service", icon: WifiOff,       color: "#94a3b8" },
] as const;
type FilterId = typeof FILTERS[number]["id"];

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
            className="grid grid-cols-5 divide-x rounded-2xl overflow-hidden"
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
