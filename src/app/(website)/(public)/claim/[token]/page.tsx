import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { verifyClaimToken } from "@/lib/tokens";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Claim Your Listing - Child Actor 101 Directory",
  description: "Securely claim your listing and manage or upgrade.",
};

export default async function ClaimRedirectPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { lid?: string };
}) {
  const parsed = verifyClaimToken(params.token);
  if (!parsed) {
    redirect(`/claim/expired`);
  }

  const listingId = parsed.lid;

  // Fetch listing to derive slug for redirect to claim-upgrade flow
  const supabase = createServerClient();
  const { data: listing, error } = await supabase
    .from("listings")
    .select("id, listing_name, is_claimed")
    .eq("id", listingId)
    .single();

  if (error || !listing) {
    // If listing not found, redirect to expired page rather than dashboard
    // This provides a better user experience for vendors
    redirect("/claim/expired");
  }

  const slug = (listing.listing_name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const session = await auth();

  // If already claimed, redirect to vendor dashboard for management
  if (listing.is_claimed === true) {
    redirect(`/dashboard/vendor?lid=${encodeURIComponent(listingId)}`);
  }

  const currentPath = `/claim/${encodeURIComponent(params.token)}${searchParams?.lid ? `?lid=${encodeURIComponent(searchParams.lid)}` : ""}`;

  // If authenticated, proceed directly to claim-upgrade
  if (session?.user?.id) {
    redirect(
      `/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(listingId)}&token=${encodeURIComponent(params.token)}`,
    );
  }

  // Public landing with context before auth
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-ink mb-2">
        Claim “{listing.listing_name}”
      </h1>
      <p className="text-paper mb-6">
        To manage your listing and unlock upgrades, please log in or create an
        account.
      </p>
      <div className="flex gap-3">
        <Link
          href={`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`}
          className="inline-flex items-center rounded-md bg-brand-blue text-white px-4 py-2"
        >
          Log in to continue
        </Link>
        <Link
          href={`/auth/register?callbackUrl=${encodeURIComponent(currentPath)}`}
          className="inline-flex items-center rounded-md bg-ink text-white px-4 py-2"
        >
          Create account
        </Link>
      </div>
      <p className="text-sm text-paper mt-4">
        You’ll be redirected back to complete your claim for “
        {listing.listing_name}”.
      </p>
    </div>
  );
}
