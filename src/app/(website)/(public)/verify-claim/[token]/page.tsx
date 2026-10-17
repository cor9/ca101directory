import { redirect } from "next/navigation";

interface VerifyClaimPageProps {
  params: { token: string };
}

/**
 * SECURITY FIX (recovery audit, Phase 1A/1B): this route used to call
 * `verifyClaim()`, which treated `token` as a raw listing ID/slug with no
 * signature check and no real "already claimed" guard — anyone who knew
 * or guessed a listing ID could hijack it by visiting this URL directly,
 * with no login required. That action and its `data/claims.ts` helpers
 * have been removed.
 *
 * Nothing in the app currently links here (the one email template that
 * would have sent this link was never wired up), so this redirect exists
 * only to keep any already-sent link from 404ing: `token` here is a
 * listing ID, so we forward to the real, authenticated/role-checked claim
 * flow at `/claim/listing/[listingId]` (see `actions/claim-listing.ts`),
 * which performs the actual ownership verification.
 */
export default function VerifyClaimPage({ params }: VerifyClaimPageProps) {
  redirect(`/claim/listing/${encodeURIComponent(params.token)}`);
}
