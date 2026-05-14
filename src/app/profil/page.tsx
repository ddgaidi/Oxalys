"use client";

/*
 * Commentaires de structure : Affiche le profil utilisateur, ses informations et ses FabLabs favoris.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut, MapPin, Mail, Phone, Heart, Star,
  Plus, Cpu, AlertCircle, CheckCircle2, AlertTriangle, Ban, User, WifiOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fetchFabLabById } from "@/lib/supabase/fablabs";
import { useTheme } from "@/lib/context/ThemeContext";
import { useFavorites } from "@/lib/hooks/useFavorites";
import type { FabLab } from "@/types";

/* ── Safety config ── */
const SAFETY = {
  optimal: { color: "#10b981", Icon: CheckCircle2,  label: "Optimal" },
  medium:  { color: "#facc15", Icon: AlertCircle,   label: "Moyen" },
  alert:   { color: "#f97316", Icon: AlertTriangle, label: "Alerte" },
  danger:  { color: "#ef4444", Icon: Ban,           label: "Danger" },
  offline: { color: "#94a3b8", Icon: WifiOff,       label: "Hors service" },
};

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const GENRE_LABEL: Record<string, string> = {
  homme:        "Homme",
  femme:        "Femme",
  "non-binaire":"Non-binaire",
  "non-precise":"Non précisé",
};

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const CARD_GRADIENTS = [
  ["#0f2d4a","#1a1040"], ["#0a2e1e","#0f1e30"],
  ["#1e0a2e","#2e1040"], ["#2e1a0a","#1e0a20"],
];
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const LIGHT_GRADIENTS = [
  ["#dbeafe","#ede9fe"], ["#d1fae5","#cffafe"],
  ["#ede9fe","#fce7f3"], ["#fef3c7","#e0f2fe"],
];
// Helper interne : isole une transformation ou une regle metier du rendu principal.
function cardGradient(name: string, isDark: boolean) {
  const list = isDark ? CARD_GRADIENTS : LIGHT_GRADIENTS;
  return `linear-gradient(135deg, ${list[name.charCodeAt(0) % list.length][0]}, ${list[name.charCodeAt(0) % list.length][1]})`;
}

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface EtudiantRow {
  id: string;
  prenom: string;
  nom: string;
  genre: string;
  email: string;
  telephone: string | null;
  fablab_id: string | null;
  favoris: string[];
  created_at: string;
}

/* ── Avatar initials ── */
function initials(prenom: string, nom: string) {
  return `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase() || "?";
}

/* ── Mini FabLab card for favorites ── */
function FavCard({
  fablab, isDark, onRemove,
}: { fablab: FabLab; isDark: boolean; onRemove: () => void }) {
  const s = SAFETY[fablab.safety];
  return (
    <div
      className="relative rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.03]"
      style={{
        boxShadow: isDark ? `0 0 0 1px rgba(255,255,255,0.07)` : `0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.06)`,
      }}
    >
      {/* Image / gradient */}
      <div className="relative h-28 w-full" style={{ background: cardGradient(fablab.name, isDark) }}>
        {fablab.cover_url && (
          <Image src={fablab.cover_url} alt={fablab.name} fill className="object-cover opacity-60" sizes="300px" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {/* Safety stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          style={{ background: "rgba(239,68,68,0.3)", border: "1px solid rgba(239,68,68,0.5)" }}
          aria-label="Retirer des favoris"
        >
          <span style={{ color: "#ef4444", fontSize: "12px", fontWeight: "bold" }}>×</span>
        </button>
        {/* Name */}
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-white text-xs font-bold leading-tight truncate drop-shadow">{fablab.name}</p>
          <p className="text-white/60 text-[10px] flex items-center gap-1 mt-0.5">
            <MapPin size={8} />{fablab.city}
          </p>
        </div>
      </div>
      {/* Footer */}
      <div
        className="px-3 py-2 flex items-center justify-between"
        style={{
          background: isDark ? "rgba(10,14,26,0.95)" : "rgba(255,255,255,0.95)",
          borderTop: `1px solid ${s.color}25`,
        }}
      >
        <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: s.color }}>
          <s.Icon size={9} />{s.label}
        </span>
        <Link href={`/ton-fablab/${fablab.slug}`} className="text-[10px] hover:text-blue-400 transition-colors" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "#94a3b8" }}>
          Voir →
        </Link>
      </div>
    </div>
  );
}

/* ── Empty slot ── */
function EmptySlot({ isDark }: { isDark: boolean }) {
  return (
    <Link href="/ton-fablab">
      <div
        className="h-full min-h-[152px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
        style={{
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <Plus size={14} className="text-blue-500" />
        </div>
        <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#94a3b8" }}>
          Ajouter
        </span>
      </div>
    </Link>
  );
}

/* ══ PAGE PRINCIPALE ══════════════════════════════════════════ */
export default function ProfilePage() {
  const { theme }  = useTheme();
  const isDark     = theme === "dark";
  const router     = useRouter();
  const supabase   = createClient();

  const [profile,   setProfile]   = useState<EtudiantRow | null>(null);
  const [fablabRef, setFablabRef] = useState<FabLab | null>(null);
  const [favFablabs, setFavFablabs] = useState<(FabLab | null)[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [userId,    setUserId]    = useState<string | undefined>(undefined);

  const { favorites, toggleFavorite } = useFavorites(userId);

  /* ── Fetch data ── */
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      setUserId(user.id);

      const { data: row } = await supabase
        .from("etudiant")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!row) { setLoading(false); return; }
      setProfile(row as EtudiantRow);

      if (row.fablab_id) {
        setFablabRef(await fetchFabLabById(row.fablab_id));
      }

      if (row.favoris?.length) {
        const results = await Promise.all(row.favoris.map((id: string) => fetchFabLabById(id)));
        setFavFablabs(results);
      }

      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Re-sync favoris quand useFavorites change ── */
  useEffect(() => {
    if (!userId || !favorites.length) return;
    Promise.all(favorites.map((id) => fetchFabLabById(id))).then(setFavFablabs);
  }, [favorites, userId]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  /* ── Design tokens ── */
  const pageBg     = isDark ? "linear-gradient(160deg,#080c18 0%,#0a0f1e 40%,#06111a 100%)" : "linear-gradient(160deg,#f0f4ff 0%,#f8faff 40%,#eef6f2 100%)";
  const dotColor   = isDark ? "rgba(59,130,246,0.12)"  : "rgba(59,130,246,0.07)";
  const titleColor = isDark ? "#ffffff"                 : "#0f172a";
  const bodyColor  = isDark ? "rgba(255,255,255,0.6)"   : "#64748b";
  const cardBg     = isDark ? "rgba(255,255,255,0.03)"  : "rgba(255,255,255,0.85)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)"  : "rgba(0,0,0,0.08)";
  const cardShadow = isDark ? "none"                    : "0 2px 12px rgba(0,0,0,0.05)";
  const labelColor = isDark ? "rgba(255,255,255,0.3)"   : "#94a3b8";

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: pageBg }}>
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle,${dotColor} 1px,transparent 1px)`, backgroundSize: "32px 32px" }} />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <p className="text-sm" style={{ color: bodyColor }}>Chargement du profil…</p>
        </div>
      </div>
    );
  }

  const displayName  = profile ? `${profile.prenom} ${profile.nom}`.trim() || "Étudiant" : "Étudiant";
  const memberSince  = profile ? new Date(profile.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "";
  const favCount     = favorites.length;
  const fillPct      = (favCount / 5) * 100;

  return (
    <div className="min-h-screen relative" style={{ background: pageBg }}>
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: `radial-gradient(circle,${dotColor} 1px,transparent 1px)`, backgroundSize: "32px 32px" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 pt-28 pb-24">

        {/* ══ HERO AVATAR ══════════════════════════════════════ */}
        <div className="flex flex-col items-center text-center mb-14 animate-profile-slide">

          {/* Pulsing rings */}
          <div className="relative mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full animate-avatar-ring pointer-events-none"
                style={{
                  border: "1px solid rgba(59,130,246,0.35)",
                  animationDelay: `${i * 0.8}s`,
                }}
              />
            ))}

            {/* Avatar circle */}
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center animate-avatar-glow"
              style={{ background: "linear-gradient(135deg,#2563eb 0%,#059669 100%)" }}
            >
              <span className="font-display font-black text-3xl text-white select-none">
                {initials(profile?.prenom ?? "", profile?.nom ?? "")}
              </span>
            </div>
          </div>

          {/* Name */}
          <h1
            className="font-display font-bold tracking-tight mb-1"
            style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", color: titleColor }}
          >
            {displayName}
          </h1>

          {/* Status pills */}
          <div className="flex items-center gap-2 flex-wrap justify-center mt-2">
            <span
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-dot-pulse" />
              Connecté
            </span>
            {profile?.genre && profile.genre !== "non-precise" && (
              <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: cardBg, border: `1px solid ${cardBorder}`, color: bodyColor }}>
                {GENRE_LABEL[profile.genre] ?? profile.genre}
              </span>
            )}
            <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: cardBg, border: `1px solid ${cardBorder}`, color: bodyColor }}>
              Membre depuis {memberSince}
            </span>
          </div>
        </div>

        {/* ══ FAVORIS BAR ══════════════════════════════════════ */}
        <div
          className="rounded-2xl p-5 mb-8 animate-profile-slide"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow, animationDelay: "0.1s", opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart size={15} className="text-red-400" style={{ fill: "#f87171" }} />
              <span className="font-semibold text-sm" style={{ color: titleColor }}>
                Favoris
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: favCount >= 5 ? "#ef4444" : "#10b981" }}>
              {favCount} / 5
            </span>
          </div>
          {/* Progress bar */}
          <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{
                width: `${fillPct}%`,
                background: favCount >= 5
                  ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                  : "linear-gradient(90deg,#3b82f6,#10b981)",
                boxShadow: `0 0 8px ${favCount >= 5 ? "#ef4444" : "#3b82f6"}60`,
              }}
            />
          </div>
          {favCount >= 5 && (
            <p className="text-xs mt-2" style={{ color: "#f87171" }}>
              Limite atteinte — retire un favori pour en ajouter un nouveau
            </p>
          )}
        </div>

        {/* ══ GRILLE : info + FabLab ref ═══════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

          {/* Info personnelles */}
          <div
            className="rounded-2xl p-6 animate-profile-slide"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow, animationDelay: "0.15s", opacity: 0 }}
          >
            {/* Safety stripe */}
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl pointer-events-none"
              style={{ background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.6),transparent)" }} />

            <h2 className="font-display font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: labelColor }}>
              Informations
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { icon: User, label: "Nom complet", value: displayName },
                { icon: Mail, label: "Email",        value: profile?.email },
                { icon: Phone, label: "Téléphone",   value: profile?.telephone ?? "Non renseigné" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                    <Icon size={13} className="text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: labelColor }}>{label}</p>
                    <p className="text-sm font-medium truncate" style={{ color: value === "Non renseigné" ? labelColor : titleColor }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FabLab de référence */}
          <div
            className="rounded-2xl overflow-hidden animate-profile-slide"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            {fablabRef ? (
              <Link href={`/ton-fablab/${fablabRef.slug}`} className="block h-full group">
                <div className="relative h-full min-h-[160px]" style={{ background: cardGradient(fablabRef.name, isDark) }}>
                  {fablabRef.cover_url && (
                    <Image src={fablabRef.cover_url} alt={fablabRef.name} fill className="object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-500" sizes="400px" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(90deg,transparent,${SAFETY[fablabRef.safety].color},transparent)` }} />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                      FabLab de référence
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Star size={12} className="text-yellow-400" style={{ fill: "#facc15" }} />
                      <span className="text-[11px] font-semibold" style={{ color: SAFETY[fablabRef.safety].color }}>
                        {SAFETY[fablabRef.safety].label}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white text-base leading-tight drop-shadow">{fablabRef.name}</h3>
                    <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={10} />{fablabRef.city} · {fablabRef.zip_code}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                className="h-full min-h-[160px] rounded-2xl flex flex-col items-center justify-center gap-2 p-6 text-center"
                style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
              >
                <Cpu size={28} style={{ color: isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1" }} />
                <p className="text-sm font-medium" style={{ color: titleColor }}>Aucun FabLab de référence</p>
                <Link href="/ton-fablab" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                  Choisir un FabLab →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ══ FAVORIS GRID ═════════════════════════════════════ */}
        <div
          className="rounded-2xl p-6 mb-8 animate-profile-slide"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow, animationDelay: "0.25s", opacity: 0 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <Heart size={13} style={{ color: "#f87171", fill: "#f87171" }} />
            </div>
            <h2 className="font-display font-semibold text-sm" style={{ color: titleColor }}>
              Mes FabLabs favoris
            </h2>
            <span className="ml-auto text-xs" style={{ color: labelColor }}>
              {favCount} / 5 slots
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Loaded favorites */}
            {favorites.map((favId, i) => {
              const fab = favFablabs[i];
              if (!fab) return (
                <div key={favId} className="rounded-2xl animate-shimmer" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", minHeight: "152px" }} />
              );
              return (
                <FavCard
                  key={favId}
                  fablab={fab}
                  isDark={isDark}
                  onRemove={() => toggleFavorite(favId)}
                />
              );
            })}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 5 - favCount) }).map((_, i) => (
              <EmptySlot key={`empty-${i}`} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* ══ LOGOUT ═══════════════════════════════════════════ */}
        <div className="flex justify-center animate-profile-slide" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 group"
            style={{
              background: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444",
              boxShadow: "0 0 0 0 rgba(239,68,68,0)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 20px rgba(239,68,68,0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 0 rgba(239,68,68,0)")}
          >
            <LogOut size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            Se déconnecter
          </button>
        </div>

      </div>
    </div>
  );
}
