import { redirect } from "next/navigation";

interface PaymentPageProps {
  params: { id: string };
}

/**
 * LEGACY PURCHASE PATH RETIRED (recovery audit, Phase 1C Task 8): this
 * page linked directly to Stripe Payment Links
 * (NEXT_PUBLIC_STRIPE_BASIC/PRO/PREMIUM — $25/mo, $50/mo, and older
 * $101/$199-for-6-months tiers), bypassing /api/create-checkout-session
 * entirely. A Payment Link checkout carries none of the
 * listing_id/vendor_id metadata the webhook's Pro-fulfillment logic
 * requires, so a purchase made here would never actually flip the
 * listing to Pro — it would just take the customer's money and leave
 * them on Free. It also displayed the listing's raw database UUID on
 * screen for no reason.
 *
 * Both call sites that used to send a vendor here
 * (components/submit/supabase-submit-form.tsx's isEdit=false branch and
 * components/dashboard/publish-button.tsx, the latter on the orphaned,
 * pre-Supabase-migration /dashboard/submissions page) were already
 * unreachable from any live, linked UI before this fix — new listings
 * are always created Free now (see submit-supabase.ts's trustedPlan),
 * and nothing links to /dashboard/submissions. This redirect exists
 * only so an old bookmarked/emailed /payment/<id> link lands on the
 * real, current checkout flow (/plan-selection -> real Stripe Checkout
 * Session -> /api/webhook) instead of a dead-end purchase that silently
 * doesn't work.
 */
export default function PaymentPage({ params }: PaymentPageProps) {
  redirect(`/plan-selection?listingId=${encodeURIComponent(params.id)}`);
}
