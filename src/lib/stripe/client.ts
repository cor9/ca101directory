import type { PricePlan } from "@/types";

type CheckoutOptions = {
  pricePlan: PricePlan;
  listingId: string;
  flowOverride?: string;
  claimToken?: string;
};

export async function createCheckoutRedirectUrl({
  pricePlan,
  listingId,
  flowOverride,
  claimToken,
}: CheckoutOptions): Promise<string> {
  const checkoutConfig = pricePlan.checkout;
  if (!checkoutConfig) {
    throw new Error("Checkout configuration is missing for this plan.");
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const successUrl = `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=${checkoutConfig.planId}&lid=${encodeURIComponent(listingId)}`;
  const cancelUrl =
    typeof window !== "undefined" && window.location.href
      ? window.location.href
      : `${origin}/dashboard/vendor`;

  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listingId,
      planId: checkoutConfig.planId,
      billingCycle: checkoutConfig.billingCycle,
      successUrl,
      cancelUrl,
      flow: flowOverride ?? checkoutConfig.flow,
      ...(claimToken ? { token: claimToken } : {}),
    }),
  });

  const json = await response.json();
  if (!response.ok || !json?.url) {
    const message = json?.error || json?.details || "Failed to create checkout session.";
    throw new Error(message);
  }

  return json.url as string;
}
