/*
 * Commentaires de structure : Charge un FabLab par identifiant et prepare la page detail.
 */
import { notFound } from "next/navigation";
import { fetchFabLabByIdServer } from "@/lib/supabase/fablabs.server";
import FabLabDetailContent from "./FabLabDetailContent";

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FabLabDetailPage({ params }: Props) {
  const { slug } = await params;
  const fablab = await fetchFabLabByIdServer(slug);
  if (!fablab) notFound();

  return <FabLabDetailContent fablab={fablab} />;
}
