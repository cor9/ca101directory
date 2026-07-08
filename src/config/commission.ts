export const ATTRIBUTION_WINDOW_DAYS = 90;

export const PRO_ANNUAL_PRICE_CENTS = 39900; // $399/year — reference only,
// never used as the ledger amount; sale_amount_cents always comes from the
// actual Stripe event. If they disagree, log a price-drift warning.

export const NEW_SALE_COMMISSION_RATE = 0.25; // 25% of $399 = $99.75

// Renewal rates: defined for forward reference only. NOT wired into any
// webhook handler this sprint. Renewal commissioning requires
// subscription-lifecycle events (invoice.payment_succeeded /
// billing_reason=subscription_cycle) plus a "rep still active" definition,
// neither of which exist yet — deferred to Sprint 2b.
export const FIRST_RENEWAL_COMMISSION_RATE = 0.1;
export const SUBSEQUENT_RENEWAL_COMMISSION_RATE = 0;

export const COMMISSION_RATES: Record<string, number> = {
  pro: NEW_SALE_COMMISSION_RATE,
};
// free plan: no commission (nothing was sold)
// comped listings / admin-initiated upgrades: excluded before rate lookup,
// see the attribution resolution algorithm in lib/commission.ts

export const HONOR_PENDING_ON_TERMINATION = true;
