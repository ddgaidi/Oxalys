import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripe, getStripePriceId } from "@/lib/stripe";

type CheckoutPayload = {
  planId?: string;
  billing?: "monthly" | "annual";
};

export async function POST(request: Request) {
  const { planId, billing = "monthly" } = (await request.json()) as CheckoutPayload;
  if (!planId) {
    return NextResponse.json({ error: "missing_plan" }, { status: 400 });
  }

  const priceId = getStripePriceId(planId, billing);
  if (!priceId) {
    return NextResponse.json({ error: "missing_price_id" }, { status: 500 });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const admin = createSupabaseAdminClient();
  const { data: member } = await admin
    .from("membre")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle();

  const stripe = getStripe();
  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/profil?stripe=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/tarifs?stripe=cancelled`,
    metadata: {
      auth_id: user.id,
      membre_id: member?.id ?? "",
      plan_id: planId,
      billing,
    },
    subscription_data: {
      metadata: {
        auth_id: user.id,
        membre_id: member?.id ?? "",
        plan_id: planId,
        billing,
      },
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
