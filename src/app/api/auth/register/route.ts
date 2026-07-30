// Import de NextResponse pour retourner des réponses JSON depuis une route API Next.js
import { NextResponse } from "next/server";

// Import du client Supabase classique, utilisé ici pour l'inscription Auth avec la clé anon
import { createClient } from "@supabase/supabase-js";

// Import du client Supabase admin, utilisé pour écrire directement dans les tables protégées
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Type attendu dans le body de la requête POST
type RegisterPayload = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  fablabId?: string | null;
};

// Fonction utilitaire pour nettoyer les chaînes de caractères
// Si la valeur est une string, on retire les espaces au début et à la fin
// Sinon, on retourne une chaîne vide
function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

// Fonction principale appelée quand la route reçoit une requête POST
export async function POST(request: Request) {
  // Lecture du body JSON envoyé par le formulaire d'inscription
  const body = (await request.json()) as RegisterPayload;

  // Nettoyage et normalisation des données reçues
  const email = cleanString(body.email).toLowerCase();
  const password = cleanString(body.password);
  const firstName = cleanString(body.firstName);
  const lastName = cleanString(body.lastName);
  const gender = cleanString(body.gender) || "non-precise";
  const phone = cleanString(body.phone);
  const fablabId = cleanString(body.fablabId) || null;

  // Vérification des champs obligatoires
  // Si un champ important est manquant, on retourne une erreur 400
  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json(
        { error: "missing_fields" },
        { status: 400 }
    );
  }

  // Récupération des variables d'environnement Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Vérification que la configuration Supabase est bien présente
  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
        { error: "supabase_config" },
        { status: 500 }
    );
  }

  // Création d'un client Supabase public pour gérer l'inscription Auth
  const authClient = createClient(supabaseUrl, anonKey);

  // Création du compte utilisateur dans Supabase Auth
  // Les informations supplémentaires sont stockées dans user_metadata
  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        gender,
        phone,
        fablab_id: fablabId,
      },
    },
  });

  // Si Supabase Auth retourne une erreur ou aucun utilisateur, on arrête l'inscription
  if (error || !data.user) {
    return NextResponse.json(
        { error: error?.message ?? "signup_failed" },
        { status: 400 }
    );
  }

  // Création du client admin pour écrire dans les tables Supabase
  // Ce client utilise la service role key côté serveur
  const admin = createSupabaseAdminClient();

  // Récupération de l'id Auth de l'utilisateur créé
  const userId = data.user.id;

  // Préparation des données à insérer ou mettre à jour dans la table membre
  const memberPayload = {
    auth_id: userId,
    prenom: firstName,
    nom: lastName,
    email,
    telephone: phone || null,
    role: "etudiant",
    fablab_ref: fablabId,
    notification_read: false,
  };

  // Vérification si un membre existe déjà avec cet auth_id
  // maybeSingle permet de récupérer soit une ligne, soit null sans erreur
  const { data: existingMember, error: existingMemberError } = await admin
      .from("membre")
      .select("id")
      .eq("auth_id", userId)
      .maybeSingle();

  // Si la recherche du membre existant échoue, on retourne une erreur serveur
  if (existingMemberError) {
    return NextResponse.json(
        { error: existingMemberError.message },
        { status: 500 }
    );
  }

  // Si le membre existe déjà, on le met à jour
  // Sinon, on crée une nouvelle ligne dans la table membre
  const memberWrite = existingMember
      ? await admin
          .from("membre")
          .update(memberPayload)
          .eq("id", existingMember.id)
          .select("id")
          .single()
      : await admin
          .from("membre")
          .insert(memberPayload)
          .select("id")
          .single();

  // Vérification que l'écriture dans la table membre s'est bien passée
  if (memberWrite.error || !memberWrite.data) {
    return NextResponse.json(
        { error: memberWrite.error?.message ?? "member_write_failed" },
        { status: 500 }
    );
  }

  // Récupération de l'id du membre créé ou mis à jour
  const memberId = memberWrite.data.id as string;

  // Si l'utilisateur a choisi un FabLab, on crée une demande de certification
  if (fablabId) {
    // Création d'une demande dans la table membre_certification_requete
    const { error: requestError } = await admin
        .from("membre_certification_requete")
        .insert({
          membre_id: memberId,
          fablab_id: fablabId,
          status: "en_attente",
          message: "Demande creee depuis Oxalys.",
        });

    // Si l'erreur n'est pas un doublon, on retourne une erreur serveur
    // Code 23505 = violation d'une contrainte unique PostgreSQL
    if (requestError && requestError.code !== "23505") {
      return NextResponse.json(
          { error: requestError.message },
          { status: 500 }
      );
    }

    // Ajout d'un log dans fablab_log pour garder une trace de la création
    await admin.from("fablab_log").insert({
      fablab_id: fablabId,
      actor_membre_id: memberId,
      actor_role: "etudiant",
      action: "creation",
      details: {
        email,
        firstName,
        lastName,
      },
    });
  }

  // Réponse finale envoyée au frontend
  // needsEmailConfirmation indique si l'utilisateur doit confirmer son email
  // certificationStatus indique si une demande de certification a été créée
  return NextResponse.json({
    ok: true,
    needsEmailConfirmation: !data.session,
    certificationStatus: fablabId ? "en_attente" : "none",
  });
}