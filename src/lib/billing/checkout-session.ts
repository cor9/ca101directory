import type Stripe from "stripe";

export interface ProCheckoutArgs {
  priceId: string;
  /** Existing Stripe customer ID, if one was found. */
  customerId?: string;
  /** Used only when there is no existing Stripe customer. */
  email?: string | null;
  successUrl: string;
  cancelUrl: string;
  listingId: string;
  vendorId: string;
  flow?: string;
  token?: string;
  repCode?: string;
}

/**
 * Create the Pro subscription Checkout Session.
 *
 * Stripe rejects a session that specifies both `customer` and
 * `customer_email`, so exactly one is sent: `customer` when we already have a
 * Stripe customer, otherwise `customer_email`. Promotion codes (e.g. TOP3CITY)
 * are always enabled.
 */
export function createProCheckoutSession(
  stripe: Pick<Stripe, "checkout">,
  args: ProCheckoutArgs,
) {
  const { customerId, email } = args;
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    ...(customerId
      ? { customer: customerId }
      : email
        ? { customer_email: email }
        : {}),
    line_items: [{ price: args.priceId, quantity: 1 }],
    mode: "subscription",
    allow_promotion_codes: true,
    success_url: args.successUrl,
    cancel_url: args.cancelUrl,
    client_reference_id: args.listingId,
    metadata: {
      vendor_id: args.vendorId,
      listing_id: args.listingId,
      plan: "pro",
      ...(args.flow ? { flow: args.flow } : {}),
      ...(args.token ? { claim_token: args.token } : {}),
      ...(args.repCode ? { rep_code: args.repCode } : {}),
    },
  });
}
