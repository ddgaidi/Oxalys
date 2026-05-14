"use client";

/*
 * Commentaires de structure : Presente la station Oxalys, ses capteurs et son fonctionnement.
 */
import { useRef, useState, useEffect } from "react";
import { Cpu, Wifi, Wind, Monitor, CircuitBoard, AlertTriangle, Zap } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const r = 35; // pentagon radius as % of container (slightly inset so all nodes stay in view)
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const CX = 50;
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const CY = 50;

/** viewBox 0–100: start past hub glow (~72px ⌀), end just inside card face */
const HUB_LINE_INSET = 8;
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const NODE_LINE_INSET = 2.5;

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function toPos(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: +(CX + r * Math.sin(rad)).toFixed(2),
    y: +(CY - r * Math.cos(rad)).toFixed(2),
  };
}

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function lineEndpoints(angleDeg: number) {
  const pos = toPos(angleDeg);
  const dx = pos.x - CX;
  const dy = pos.y - CY;
  const L = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  return {
    x1: +(CX + ux * HUB_LINE_INSET).toFixed(2),
    y1: +(CY + uy * HUB_LINE_INSET).toFixed(2),
    x2: +(pos.x - ux * NODE_LINE_INSET).toFixed(2),
    y2: +(pos.y - uy * NODE_LINE_INSET).toFixed(2),
  };
}

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const FLOAT_CLASSES = [
  "node-float-a",
  "node-float-b",
  "node-float-c", // sensorHeartbeat
  "node-float-d",
  "node-float-e",
];

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const COMPS = [
  {
    id: "rpi",
    name: "Raspberry Pi",
    role: "Cerveau de la station",
    desc: "Centralise toutes les mesures des capteurs et les transmet en temps réel au dashboard professeur via le réseau de l'établissement.",
    color: "#f97316",
    dimColor: "rgba(249,115,22,0.15)",
    icon: Cpu,
    angle: 0,
    critical: false,
    tag: null as string | null,
  },
  {
    id: "esp32",
    name: "ESP32",
    role: "Module WiFi / Bluetooth",
    desc: "Micro-contrôleur ultra-basse consommation qui assure la transmission sans fil des données entre les capteurs et le Raspberry Pi.",
    color: "#3b82f6",
    dimColor: "rgba(59,130,246,0.15)",
    icon: Wifi,
    angle: 72,
    critical: false,
    tag: null as string | null,
  },
  {
    id: "sensor",
    name: "Capteur qualité d'air",
    role: "Pièce maîtresse",
    desc: "Mesure en continu COV, CO₂, particules fines PM2.5, température et humidité. En cas de défaillance, le dashboard alerte en temps réel et un technicien est automatiquement dispatché.",
    color: "#10b981",
    dimColor: "rgba(16,185,129,0.15)",
    icon: Wind,
    angle: 144,
    critical: true,
    tag: "Critique" as string | null,
  },
  {
    id: "lcd",
    name: "Écran LCD Tactile",
    role: "Interface locale",
    desc: "Affiche en direct toutes les valeurs du capteur. Placé à l'entrée du FabLab, il permet aux étudiants de consulter la qualité de l'air avant d'entrer.",
    color: "#8b5cf6",
    dimColor: "rgba(139,92,246,0.15)",
    icon: Monitor,
    angle: 216,
    critical: false,
    tag: null as string | null,
  },
  {
    id: "arduino",
    name: "Arduino UNO",
    role: "Contrôleur d'affichage",
    desc: "Orchestre l'affichage de l'écran LCD tactile et sert de passerelle entre l'interface locale et le Raspberry Pi central.",
    color: "#06b6d4",
    dimColor: "rgba(6,182,212,0.15)",
    icon: CircuitBoard,
    angle: 288,
    critical: false,
    tag: null as string | null,
  },
];

/* ── Component ───────────────────────────────────────────────────────────── */

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function StationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [activeId, setActiveId] = useState<string>("rpi");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const activeComp = COMPS.find((c) => c.id === activeId) ?? COMPS[0];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-5 overflow-x-hidden overflow-y-visible"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #050810 0%, #060c18 100%)"
          : "linear-gradient(180deg, #f0f4ff 0%, #e8f0fe 100%)",
      }}
    >
      {/* ── Circuit grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Ambient blobs ── */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background: isDark
            ? "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background: isDark
            ? "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(16,185,129,0.15) 0%, transparent 70%)",
          animationDelay: "2s",
        }}
      />

      {/* ── Section header ── */}
      <div className="relative z-10 text-center mb-16">
        <div
          className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
          style={{
            borderColor: "rgba(59,130,246,0.3)",
            color: isDark ? "#60a5fa" : "#2563eb",
            background: "rgba(59,130,246,0.08)",
          }}
        >
          <Zap size={14} />
          Technologie Oxalys
        </div>
        <h2
          className="font-display font-bold text-[clamp(1.6rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          style={{ color: isDark ? "#ffffff" : "#111827" }}
        >
          Qu&apos;est-ce qu&apos;une{" "}
          <span
            className="font-bold"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Station Oxalys ?
          </span>
        </h2>
        <p
          className="text-[0.9375rem] max-w-xl mx-auto leading-relaxed"
          style={{ color: isDark ? "#94a3b8" : "#4b5563" }}
        >
          Chaque machine de votre FabLab est équipée d&apos;une station autonome composée de
          5 composants électroniques qui surveillent la qualité de l&apos;air en temps réel.
        </p>
      </div>

      {/* ── Main diagram + detail ── */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">

        {/* ── Pentagon diagram ── */}
        <div className="lg:col-span-3 flex justify-center items-center px-2 sm:px-4">
          <div
            className="relative w-full mx-auto"
            style={{
              maxWidth: 520,
              aspectRatio: "1 / 1",
              padding: "clamp(14px, 6.5vw, 40px)",
            }}
          >
            {/* Outer decorative rings */}
            <div
              className="absolute inset-0 rounded-full border pointer-events-none"
              style={{ borderColor: "rgba(59,130,246,0.07)", margin: "4%" }}
            />
            <div
              className="absolute inset-0 rounded-full border pointer-events-none"
              style={{ borderColor: "rgba(59,130,246,0.04)", margin: "8%" }}
            />

            {/* Radar sweep */}
            {triggered && (
              <div
                className="absolute rounded-full overflow-hidden animate-radar pointer-events-none"
                style={{
                  inset: "4%",
                  background: "conic-gradient(from 0deg, transparent 0deg, rgba(59,130,246,0.1) 30deg, transparent 60deg)",
                }}
              />
            )}

            {/* Scan line */}
            {triggered && (
              <div
                className="absolute left-[10%] right-[10%] h-px pointer-events-none animate-scan"
                style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" }}
              />
            )}

            {/* SVG connection lines */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: "visible" }}
            >
              {COMPS.map((comp, i) => {
                const { x1, y1, x2, y2 } = lineEndpoints(comp.angle);
                const isActive = comp.id === activeId;
                const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                return (
                  <g key={comp.id}>
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={comp.color}
                      strokeWidth={isActive ? 0.6 : 0.3}
                      strokeLinecap="round"
                      strokeDasharray={lineLength}
                      strokeDashoffset={triggered ? 0 : lineLength}
                      style={{
                        transition: `stroke-dashoffset 0.7s ease ${i * 0.12}s, stroke-width 0.3s, opacity 0.3s`,
                        opacity: isActive ? 0.9 : 0.25,
                      }}
                    />
                    {triggered && isActive && (
                      <circle r="0.8" fill={comp.color}>
                        <animateMotion
                          dur="1.5s"
                          repeatCount="indefinite"
                          path={`M ${x1} ${y1} L ${x2} ${y2}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Center hub */}
            <div
              className="absolute animate-station-hub"
              style={{
                left: `${CX}%`, top: `${CY}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Expanding rings */}
              {triggered && [0, 1, 2].map((ring) => (
                <div
                  key={ring}
                  className="absolute inset-0 rounded-full border animate-ring"
                  style={{
                    borderColor: "rgba(59,130,246,0.3)",
                    animationDelay: `${ring * 0.8}s`,
                  }}
                />
              ))}
              <div
                className="relative flex flex-col items-center justify-center rounded-full border"
                style={{
                  width: 72, height: 72,
                  background: isDark
                    ? "linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(5,150,105,0.15) 100%)"
                    : "linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(5,150,105,0.12) 100%)",
                  borderColor: "rgba(59,130,246,0.5)",
                  boxShadow: "0 0 30px rgba(59,130,246,0.3), inset 0 0 20px rgba(59,130,246,0.1)",
                }}
              >
                <span
                  className="font-display font-bold text-[9px] tracking-[0.15em] uppercase leading-none"
                  style={{ color: isDark ? "#ffffff" : "#1e3a8a" }}
                >
                  STATION
                </span>
                <span className="text-blue-500 text-[8px] font-medium mt-0.5">v2.4</span>
              </div>
            </div>

            {/* Component nodes */}
            {COMPS.map((comp, i) => {
              const pos = toPos(comp.angle);
              const isActive = comp.id === activeId;
              const Icon = comp.icon;
              return (
                <div
                  key={comp.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: triggered ? 1 : 0,
                    transition: `opacity 0.5s ease ${i * 0.15 + 0.4}s`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(comp.id)}
                    className={`pointer-events-auto ${FLOAT_CLASSES[i]} group block border-0 bg-transparent p-0`}
                  >
                  <div
                    className="relative rounded-xl border transition-all duration-300 cursor-pointer"
                    style={{
                      width: 88,
                      padding: comp.tag ? "10px 10px 18px" : "10px 10px",
                      background: isActive
                        ? `linear-gradient(135deg, ${comp.dimColor}, ${isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)"})`
                        : isDark ? "rgba(8, 12, 24, 0.85)" : "rgba(255,255,255,0.88)",
                      borderColor: isActive ? comp.color : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      boxShadow: isActive
                        ? `0 0 20px ${comp.color}55, 0 0 40px ${comp.color}22`
                        : "none",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {/* Glow dot */}
                    {comp.critical && (
                      <span
                        className="absolute top-2 right-2 z-10 w-2 h-2 rounded-full border border-[#050810]/80"
                        style={{ background: comp.color, boxShadow: `0 0 6px ${comp.color}` }}
                        aria-hidden
                      />
                    )}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center mb-2 mx-auto"
                      style={{ background: `${comp.color}22`, border: `1px solid ${comp.color}44` }}
                    >
                      <Icon size={14} style={{ color: comp.color }} />
                    </div>
                    <p
                      className="font-display font-semibold text-center leading-tight"
                      style={{
                        fontSize: 9,
                        color: isActive
                          ? isDark ? "#ffffff" : "#111827"
                          : isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                      }}
                    >
                      {comp.name}
                    </p>
                    {comp.tag && (
                      <span
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          background: `${comp.color}30`,
                          color: comp.color,
                          border: `1px solid ${comp.color}50`,
                        }}
                      >
                        {comp.tag}
                      </span>
                    )}
                  </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Active component detail */}
          <div
            key={activeComp.id}
            className="rounded-2xl border p-6"
            style={{
              background: isDark
                ? `linear-gradient(135deg, ${activeComp.dimColor}, rgba(8,12,24,0.9))`
                : `linear-gradient(135deg, ${activeComp.dimColor}, rgba(255,255,255,0.95))`,
              borderColor: `${activeComp.color}40`,
              boxShadow: `0 0 30px ${activeComp.color}18`,
              animation: "fadeInUp 0.35s ease forwards",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${activeComp.color}20`, border: `1.5px solid ${activeComp.color}50` }}
              >
                <activeComp.icon size={20} style={{ color: activeComp.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className="font-display font-semibold text-base leading-tight"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    {activeComp.name}
                  </h3>
                  {activeComp.critical && (
                    <span
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${activeComp.color}25`, color: activeComp.color, border: `1px solid ${activeComp.color}40` }}
                    >
                      <AlertTriangle size={9} />
                      Critique
                    </span>
                  )}
                </div>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: isDark ? "#94a3b8" : "#6b7280" }}
                >
                  {activeComp.role}
                </p>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: isDark ? "#cbd5e1" : "#374151" }}
            >
              {activeComp.desc}
            </p>
          </div>

          {/* Component list */}
          <div className="flex flex-col gap-1.5">
            {COMPS.map((comp) => {
              const Icon = comp.icon;
              const isActive = comp.id === activeId;
              return (
                <button
                  key={comp.id}
                  onClick={() => setActiveId(comp.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: isActive ? `${comp.color}15` : "transparent",
                    border: `1px solid ${isActive ? comp.color + "40" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${comp.color}20` }}
                  >
                    <Icon size={14} style={{ color: comp.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-xs truncate"
                      style={{
                        color: isActive
                          ? isDark ? "#ffffff" : "#111827"
                          : isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                      }}
                    >
                      {comp.name}
                    </p>
                    <p
                      className="text-[10px] truncate"
                      style={{ color: isDark ? "#64748b" : "#9ca3af" }}
                    >
                      {comp.role}
                    </p>
                  </div>
                  {comp.critical && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: comp.color, boxShadow: `0 0 6px ${comp.color}` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom note ── */}
      <p
        className="relative z-10 text-center text-xs mt-14"
        style={{ color: isDark ? "#64748b" : "#9ca3af" }}
      >
        1 station · 1 machine · 1 contrat de surveillance · données transmises toutes les{" "}
        <span style={{ color: isDark ? "#94a3b8" : "#6b7280" }} className="font-medium">10 secondes</span>
      </p>
    </section>
  );
}
