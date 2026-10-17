import { auth } from "@/auth";
import { getListingById } from "@/data/listings";
import { notFound, redirect } from "next/navigation";

/**
 * Edit page - Edit existing listing
 *
 * CONSOLIDATION (recovery audit, Phase 1B Task 5): this page used to
 * render `EditForm` (components/submit/edit-form.tsx), a third,
 * less-complete vendor-edit implementation on the same submitToSupabase
 * write path as the main /submit form, duplicating a form that already
 * exists in VendorEditForm (video embed link, logo, plan-aware gallery
 * limits, Pro upsell messaging — see components/vendor/vendor-edit-form.tsx)
 * without having those fields. Several places in the app still link
 * here (claimed-listing-actions.tsx, free-plan-button.tsx,
 * submission-card.tsx, dashboard/submissions page, and the vendor
 * listing dashboard's own EDIT button), so rather than touching every
 * caller, this page keeps its existing auth + ownership check and then
 * forwards straight to the richer, already-hardened enhance route
 * (updateListing(), with the vendor-field allowlist from Phase 1A).
 * EditForm/submitToSupabase's edit branch are left in place, unused by
 * any live route now, until this redirect has been verified in
 * production — see the audit note on EditForm/submitToSupabase for why
 * they are not yet deleted outright.
 */
export default async function EditPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect(
      `/auth/login?callbackUrl=${encodeURIComponent(`/edit/${params.id}`)}`,
    );
  }

  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  // Check if user owns this listing
  if (listing.owner_id !== session.user.id) {
    redirect("/dashboard/vendor");
  }

  redirect(`/dashboard/vendor/listing/${params.id}/enhance`);
}
