import Stripe from "stripe";

export type OxalysPlanId = "starter" | "pro" | "institution";

export const STRIPE_PRICE_ENV: Record<OxalysPlanId, { monthly: string; annual: string }> = {
  starter: {
    monthly: "STRIPE_PRICE_STARTER_MONTHLY",
    annual: "STRIPE_PRICE_STARTER_ANNUAL",
  },
  pro: {
    monthly: "STRIPE_PRICE_PRO_MONTHLY",
    annual: "STRIPE_PRICE_PRO_ANNUAL",
  },
  institution: {
    monthly: "STRIPE_PRICE_INSTITUTION_MONTHLY",
    annual: "STRIPE_PRICE_INSTITUTION_ANNUAL",
  },
};

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key);
}

export function getStripePriceId(plan: string, billing: string) {
  if (!["starter", "pro", "institution"].includes(plan)) return null;
  const safePlan = plan as OxalysPlanId;
  const cadence = billing === "annual" ? "annual" : "monthly";
  return process.env[STRIPE_PRICE_ENV[safePlan][cadence]] ?? null;
}
