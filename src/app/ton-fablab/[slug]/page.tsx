import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Globe, Mail, Phone, MapPin, Wrench } from "lucide-react";
import SafetyBadge from "@/components/ui/SafetyBadge";
import { fetchFabLabByIdServer } from "@/lib/supabase/fablabs.server";
import FabLabFavoriteButton from "./FabLabFavoriteButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FabLabDetailPage({ params }: Props) {
  const { slug } = await params;
  const fablab = await fetchFabLabByIdServer(slug);
  if (!fablab) notFound();

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      {/* Back */}
      <Link
        href="/ton-fablab"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Retour aux FabLabs
      </Link>

      {/* Cover */}
      <div className="relative h-52 md:h-68 rounded-xl overflow-hidden mb-8 bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border)]">
        {fablab.cover_url ? (
          <Image
            src={fablab.cover_url}
            alt={fablab.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--text-subtle)]">
            <Wrench size={36} />
            <span className="text-sm">Pas d&apos;image disponible</span>
          </div>
        )}
      </div>

      {/* Title + favorite */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
        <div>
          <h1 className="font-display font-bold text-[clamp(1.4rem,3vw,2rem)] leading-tight tracking-tight mb-1.5">
            {fablab.name}
          </h1>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-sm">
            <MapPin size={13} />
            {fablab.city}
            {fablab.zip_code && ` · ${fablab.zip_code}`}
            {fablab.address && ` · ${fablab.address}`}
          </div>
        </div>
        <FabLabFavoriteButton fablabId={fablab.id} />
      </div>

      {/* Safety badge */}
      <div className="mb-8">
        <SafetyBadge level={fablab.safety} size="md" />
      </div>

      {/* Description */}
      <div className="card p-6 mb-4">
        <h2 className="font-display font-semibold text-base mb-3">Description</h2>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">{fablab.description}</p>
      </div>

      {/* Equipment */}
      {fablab.equipment && fablab.equipment.length > 0 && (
        <div className="card p-6 mb-4">
          <h2 className="font-display font-semibold text-base mb-4">Équipements disponibles</h2>
          <div className="flex flex-wrap gap-2">
            {fablab.equipment.map((eq) => (
              <span
                key={eq}
                className="text-xs font-medium bg-blue-500/8 text-blue-600 dark:text-blue-400 border border-blue-500/15 rounded-full px-3 py-1"
              >
                {eq}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-base mb-4">Contact &amp; Liens</h2>
        <div className="flex flex-col gap-3">
          {fablab.website && (
            <a
              href={fablab.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-blue-500 hover:underline"
            >
              <Globe size={15} className="shrink-0" />
              {fablab.website}
            </a>
          )}
          {fablab.email && (
            <a
              href={`mailto:${fablab.email}`}
              className="flex items-center gap-2.5 text-sm text-blue-500 hover:underline"
            >
              <Mail size={15} className="shrink-0" />
              {fablab.email}
            </a>
          )}
          {fablab.phone && (
            <a
              href={`tel:${fablab.phone}`}
              className="flex items-center gap-2.5 text-sm text-blue-500 hover:underline"
            >
              <Phone size={15} className="shrink-0" />
              {fablab.phone}
            </a>
          )}
          {!fablab.website && !fablab.email && !fablab.phone && (
            <p className="text-[var(--text-subtle)] text-sm">
              Aucune information de contact disponible.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
