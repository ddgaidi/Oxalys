import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function resolveMemberId(admin: ReturnType<typeof createSupabaseAdminClient>, metadata?: Stripe.Metadata | null) {
  if (metadata?.membre_id) return metadata.membre_id;
  const authId = metadata?.auth_id ?? metadata?.user_id;
  if (!authId) return null;

  const { data } = await admin
    .from("membre")
    .select("id")
    .eq("auth_id", authId)
    .maybeSingle();

  return (data?.id as string | undefined) ?? null;
}

async function logStripeEvent(eventType: string, metadata: Stripe.Metadata | null | undefined, details: Record<string, unknown>) {
  const admin = createSupabaseAdminClient();
  const memberId = await resolveMemberId(admin, metadata);

  await admin.from("fablab_log").insert({
    actor_membre_id: memberId,
    actor_role: "systeme",
    action: "systeme",
    details: {
      source: "stripe",
      event_type: eventType,
      ...details,
    },
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

    await logStripeEvent(event.type, session.metadata, {
      event_id: event.id,
      session_id: session.id,
      customer_id: customerId,
      subscription_id: subscriptionId,
      plan_id: session.metadata?.plan_id,
    });
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const firstItem = subscription.items.data[0];
    const periodEnd = firstItem?.current_period_end
      ? new Date(firstItem.current_period_end * 1000).toISOString()
      : null;
    const customerId = typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

    await logStripeEvent(event.type, subscription.metadata, {
      event_id: event.id,
      customer_id: customerId,
      subscription_id: subscription.id,
      subscription_status: subscription.status,
      plan_id: subscription.metadata?.plan_id,
      current_period_end: periodEnd,
    });
  }

  return NextResponse.json({ received: true });
}
