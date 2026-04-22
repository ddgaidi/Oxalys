"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import FabLabCard from "@/components/ui/FabLabCard";
import type { FabLab } from "@/types";

const labs: FabLab[] = [
  {
    id: "1",
    name: "FabLab Strasbourg",
    slug: "fablab-strasbourg",
    description: "",
    city: "Strasbourg",
    zip_code: "67000",
    safety: "safe",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "FabLab Paris",
    slug: "fablab-paris",
    description: "",
    city: "Paris",
    zip_code: "75000",
    safety: "safe",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "FabLab Lyon",
    slug: "fablab-lyon",
    description: "",
    city: "Lyon",
    zip_code: "69000",
    safety: "caution",
    created_at: new Date().toISOString(),
  },
];

export default function FablabPage() {
  const [search, setSearch] = useState("");

  const filtered = labs.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl tracking-tight mb-2">FabLabs</h1>
        <p className="text-[var(--text-muted)] text-sm">{labs.length} établissements</p>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
        <input
          placeholder="Rechercher un établissement..."
          className="input-brand pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((lab) => (
          <FabLabCard
            key={lab.id}
            fablab={lab}
            isFavorite={false}
            onToggleFavorite={() => {}}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
