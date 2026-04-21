import { PARTNERS } from "@/lib/data";

export default function PartnersSection() {
  return (
    <section className="py-16 px-5">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-[0.2em] mb-10">
          Nos partenaires
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {PARTNERS.map((p) => (
            <span
              key={p}
              className="font-display font-semibold text-lg text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors duration-200 cursor-default tracking-tight"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
