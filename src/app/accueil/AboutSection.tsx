import { Target, Telescope, Lightbulb, Users2 } from "lucide-react";

const ABOUT_CARDS = [
  {
    icon: Target,
    title: "Notre mission",
    desc: "Rendre les espaces de fabrication accessibles à tous les makers, où qu'ils soient.",
  },
  {
    icon: Telescope,
    title: "Notre vision",
    desc: "Un réseau national de FabLabs connectés, transparent et centré sur l'humain.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Des outils modernes pour trouver, comparer et réserver les espaces les mieux adaptés.",
  },
  {
    icon: Users2,
    title: "Communauté",
    desc: "Plus de 15 000 makers partagent leurs projets et s'entraident sur notre plateforme.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Text block */}
        <div>
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-[0.18em] mb-4">
            Qui sommes-nous ?
          </p>
          <h2 className="font-display font-bold text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-tight mb-6">
            Une équipe passionnée au service{" "}
            <span className="text-gradient">des makers</span>
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed mb-5 text-[0.9375rem]">
            Oxalys est né de la frustration de makers n&apos;arrivant pas à trouver
            facilement un espace de fabrication adapté à leurs besoins. Notre
            mission&nbsp;: rendre l&apos;innovation accessible à tous.
          </p>
          <p className="text-[var(--text-muted)] leading-relaxed text-[0.9375rem]">
            Fondée en 2024 dans les Hauts-de-France, notre équipe de passionnés
            de technologie et de fabrication numérique a construit la première
            plateforme française dédiée aux FabLabs.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-4">
          {ABOUT_CARDS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card p-5 flex flex-col gap-3 hover:border-blue-500/25 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Icon size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-[var(--text)] mb-1">{title}</p>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
