import { ClaimButton } from "@/components/claim/claim-button";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewsDisplay } from "@/components/reviews/reviews-display";
import { isReviewsEnabled } from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getItemById } from "@/data/airtable-item";
import { constructMetadata } from "@/lib/metadata";
import { ShieldIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

// Force dynamic rendering to avoid static/dynamic conflicts
export const dynamic = "force-dynamic";

/**
 * Generate static params for all item pages
 * This tells Next.js which item pages to pre-build
 */
export async function generateStaticParams() {
  try {
    const { getListings } = await import("@/lib/airtable");
    const listings = await getListings();

    // Convert listing names to slugs
    return listings.map((listing) => ({
      slug: listing.businessName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    // Return empty array if Airtable is not configured
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  try {
    const { getListings } = await import("@/lib/airtable");
    const listings = await getListings();
    const listing = listings.find(
      (listing) =>
        listing.businessName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") === params.slug,
    );

    if (!listing) {
      return constructMetadata({
        title: "Listing Not Found - Child Actor 101 Directory",
        description: "The requested listing could not be found",
        canonicalUrl: `${siteConfig.url}/item/${params.slug}`,
      });
    }

    return constructMetadata({
      title: `${listing.businessName} - Child Actor 101 Directory`,
      description:
        listing.description ||
        `Professional ${listing.categories?.[0] || "acting"} services for young actors`,
      canonicalUrl: `${siteConfig.url}/item/${params.slug}`,
    });
  } catch (error) {
    console.error("generateMetadata error:", error);
    return constructMetadata({
      title: "Listing - Child Actor 101 Directory",
      description: "Professional acting services for young actors",
      canonicalUrl: `${siteConfig.url}/item/${params.slug}`,
    });
  }
}

export default async function ItemDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const { getListings } = await import("@/lib/airtable");
    const listings = await getListings();
    const listing = listings.find(
      (listing) =>
        listing.businessName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") === params.slug,
    );

    if (!listing) {
      console.log("ItemDetailPage: No Airtable listing found, checking Supabase listings");
      // Try to find this slug in Supabase listings and redirect to /listing/
      const { getListingBySlug } = await import("@/data/listings");
      const supabaseListing = await getListingBySlug(params.slug);
      
      if (supabaseListing) {
        console.log("ItemDetailPage: Found Supabase listing, redirecting to /listing/");
        redirect(`/listing/${params.slug}`);
      } else {
        console.error("ItemDetailPage, listing not found for slug:", params.slug);
        return notFound();
      }
    }

    // Debug claim fields
    console.log("Item page claim debug:", {
      businessName: listing.businessName,
      claimed: listing["Claimed?"] === "checked",
      _debugClaimed: listing._debugClaimed,
      _debugClaimedByEmail: listing._debugClaimedByEmail,
      _debugOwnerId: listing._debugOwnerId,
      _debugAllFields: listing._debugAllFields,
    });

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {listing.businessName}
          </h1>

          {listing.description && (
            <p className="text-lg text-foreground mb-4">
              {listing.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {listing.categories && (
              <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-sm">
                {listing.categories}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>

            {listing.website && (
              <div className="mb-4">
                <strong>Website:</strong>{" "}
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline"
                >
                  {listing.website}
                </a>
              </div>
            )}

            {listing.email && (
              <div className="mb-4">
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${listing.email}`}
                  className="text-brand-blue hover:underline"
                >
                  {listing.email}
                </a>
              </div>
            )}

            {listing.phone && (
              <div className="mb-4">
                <strong>Phone:</strong>{" "}
                <a
                  href={`tel:${listing.phone}`}
                  className="text-brand-blue hover:underline"
                >
                  {listing.phone}
                </a>
              </div>
            )}

            {listing.location && (
              <div className="mb-4">
                <strong>Location:</strong> {listing.location}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Services</h2>

            {listing.servicesOffered && (
              <p className="mb-4">{listing.servicesOffered}</p>
            )}

            {listing.tags && listing.tags.length > 0 && (
              <div className="mb-4">
                <strong>Age Range:</strong>{" "}
                <span>{listing.tags.join(", ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Review Form */}
        {isReviewsEnabled() && (
          <div className="mt-8">
            <ReviewForm
              vendorId={listing.id}
              vendorName={listing.businessName}
            />
          </div>
        )}

        {/* Reviews Display */}
        {isReviewsEnabled() && (
          <div className="mt-8">
            <ReviewsDisplay vendorId={listing.id} />
          </div>
        )}

        {/* Claim Listing Section */}
        {listing["Claimed?"] !== "checked" && (
          <div className="mt-8 bg-gradient-to-r from-brand-orange/5 to-brand-blue/5 rounded-lg p-6 border border-brand-orange/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <ShieldIcon className="w-8 h-8 text-brand-orange" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 text-foreground">
                  Own This Business?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Claim your listing to gain full control, edit details, and
                  upgrade to premium plans.
                </p>
                <ClaimButton
                  listingId={listing.id}
                  listingName={listing.businessName}
                  claimed={listing["Claimed?"] === "checked"}
                  ownerId={listing.owner_id}
                  className="bg-brand-orange hover:bg-brand-orange-dark"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("ItemDetailPage error:", error);
    return notFound();
  }
}
