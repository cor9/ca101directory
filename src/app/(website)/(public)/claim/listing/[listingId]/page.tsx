import { auth } from "@/auth";
import { ClaimForm } from "@/components/claim/claim-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getListingById } from "@/data/listings";
import { getRole } from "@/lib/auth/roles";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Claim Listing - Child Actor 101 Directory",
  description: "Claim ownership of your business listing",
};

/**
 * Dedicated claim page - clear UX showing "You're claiming..." messaging
 * Fixes Bug #3: Confusing claim flow
 */
export default async function ClaimListingPage({
  params,
}: {
  params: { listingId: string };
}) {
  // Require authentication to claim
  const session = await auth();
  if (!session?.user) {
    const callbackUrl = encodeURIComponent(
      `/claim/listing/${params.listingId}`
    );
    redirect(`/auth/register?callbackUrl=${callbackUrl}`);
  }

  const userRole = getRole(session.user as any);

  // Fetch the listing being claimed
  const listing = await getListingById(params.listingId);

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">
              Listing Not Found
            </h1>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              The listing you're trying to claim doesn't exist or has been
              removed.
            </p>
            <Button asChild>
              <Link href="/directory">Browse Directory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === "parent") {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">
              Switch to a Vendor Account First
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              This claim flow is for professionals managing listings. Update
              your account type to <strong>Professional/Vendor</strong> before
              continuing so you can edit and publish this listing.
            </p>
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              <p className="font-semibold">How to switch:</p>
              <p>
                Go to <em>Settings → Account</em> and use the role switcher to
                change to a vendor profile. Then return to this page to submit
                your claim.
              </p>
            </div>
            <Button asChild className="bauhaus-btn-primary">
              <Link href="/settings?showRoleSwitcher=1">Open Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if already claimed
  if (listing.is_claimed && listing.owner_id) {
    if (listing.owner_id === session.user.id) {
      // User already owns this listing
      redirect("/dashboard/vendor/listing");
    }
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">
              Already Claimed
            </h1>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              This listing has already been claimed by another user. If you
              believe this is your business, please contact support.
            </p>
            <Button asChild>
              <Link href="/directory">Browse Directory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/listing/${listing.slug || listing.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listing
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-paper mb-2">
            Claim Your Listing
          </h1>
          <p className="text-paper/80">
            You're claiming ownership of this business listing
          </p>
        </div>

        {/* Listing preview card */}
        <Card className="mb-8 bg-surface">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 bg-bauhaus-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="h-8 w-8 text-ink" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-ink mb-1">
                  {listing.listing_name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-ink/70">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {listing.city}, {listing.state}
                  </span>
                </div>
                {listing.plan && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-bauhaus-mustard rounded-full text-ink font-medium">
                      {listing.plan} Plan
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            ✅ What happens after you claim?
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • You'll instantly own this listing and can edit it immediately
            </li>
            <li>
              • Your changes will be reviewed by our team before going live
            </li>
            <li>• You can upgrade your plan for more features anytime</li>
            <li>
              • You'll get access to your vendor dashboard to manage everything
            </li>
          </ul>
        </div>

        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">Next steps after you submit</p>
          <p className="mt-1">
            We&apos;ll send you straight to <strong>Dashboard → My Listings</strong>.
            Look for the <em>Edit</em> button next to this listing to start
            updating details right away.
          </p>
        </div>

        {/* Claim form */}
        <ClaimForm
          listingId={listing.id}
          listingName={listing.listing_name}
          onSuccess={() => {
            // Redirect handled by ClaimForm action
          }}
        />
      </div>
    </div>
  );
}
