"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, MapPin, Users } from "lucide-react";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { KEY_STATS } from "@/lib/data";

const ICONS = [Building2, MapPin, Users];

function StatCard({
  index,
  label,
  value,
  suffix,
  trigger,
}: {
  index: number;
  label: string;
  value: number;
  suffix: string;
  trigger: boolean;
}) {
  const count = useCountUp(value, 2000, trigger);
  const Icon = ICONS[index] ?? Building2;

  return (
    <div className="flex flex-col items-center text-center px-8 py-10 relative">
      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
        <Icon size={20} className="text-blue-500" />
      </div>
      <div className="font-display font-bold text-[2.75rem] leading-none text-gradient mb-2">
        {count.toLocaleString("fr-FR")}{suffix}
      </div>
      <div className="text-[var(--text-muted)] text-sm">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 px-5 border-y border-[var(--border)] bg-[var(--bg-elevated)]/40">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
          {KEY_STATS.map((s, i) => (
            <StatCard key={s.label} index={i} {...s} trigger={triggered} />
          ))}
        </div>
      </div>
    </section>
  );
}
