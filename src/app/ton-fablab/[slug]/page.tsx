import { notFound } from "next/navigation";
import { fetchFabLabByIdServer } from "@/lib/supabase/fablabs.server";
import FabLabDetailContent from "./FabLabDetailContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FabLabDetailPage({ params }: Props) {
  const { slug } = await params;
  const fablab = await fetchFabLabByIdServer(slug);
  if (!fablab) notFound();

  return <FabLabDetailContent fablab={fablab} />;
}
