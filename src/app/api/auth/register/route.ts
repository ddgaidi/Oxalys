import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RegisterPayload = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  fablabId?: string | null;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterPayload;
  const email = cleanString(body.email).toLowerCase();
  const password = cleanString(body.password);
  const firstName = cleanString(body.firstName);
  const lastName = cleanString(body.lastName);
  const gender = cleanString(body.gender) || "non-precise";
  const phone = cleanString(body.phone);
  const fablabId = cleanString(body.fablabId) || null;

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ error: "supabase_config" }, { status: 500 });
  }

  const authClient = createClient(supabaseUrl, anonKey);
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

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? "signup_failed" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const userId = data.user.id;

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

  const { data: existingMember, error: existingMemberError } = await admin
    .from("membre")
    .select("id")
    .eq("auth_id", userId)
    .maybeSingle();

  if (existingMemberError) {
    return NextResponse.json({ error: existingMemberError.message }, { status: 500 });
  }

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

  if (memberWrite.error || !memberWrite.data) {
    return NextResponse.json({ error: memberWrite.error?.message ?? "member_write_failed" }, { status: 500 });
  }

  const memberId = memberWrite.data.id as string;

  if (fablabId) {
    const { error: requestError } = await admin.from("membre_certification_requete").insert({
      membre_id: memberId,
      fablab_id: fablabId,
      status: "en_attente",
      message: "Demande creee depuis Oxalys.",
    });

    if (requestError && requestError.code !== "23505") {
      return NextResponse.json({ error: requestError.message }, { status: 500 });
    }

    await admin.from("fablab_log").insert({
      fablab_id: fablabId,
      actor_membre_id: memberId,
      actor_role: "etudiant",
      action: "creation",
      details: { email, firstName, lastName },
    });
  }

  return NextResponse.json({
    ok: true,
    needsEmailConfirmation: !data.session,
    certificationStatus: fablabId ? "en_attente" : "none",
  });
}
