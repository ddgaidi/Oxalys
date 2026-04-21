import { TRUSTED_ORGS } from "@/lib/data";
import { GraduationCap } from "lucide-react";

interface Props {
  title?: string;
}

export default function TrustedSection({ title = "Ils nous font confiance" }: Props) {
  return (
    <section className="py-20 px-5 border-t border-[var(--border)] bg-[var(--bg-elevated)]/30">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-[0.2em] text-center mb-10">
          {title}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TRUSTED_ORGS.map((org) => (
            <div
              key={org}
              className="card p-4 flex items-center gap-3 hover:border-[var(--border-strong)] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <GraduationCap size={16} className="text-blue-500" />
              </div>
              <span className="font-medium text-sm text-[var(--text-muted)]">{org}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
