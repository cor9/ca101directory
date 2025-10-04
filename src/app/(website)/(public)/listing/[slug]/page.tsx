import { auth } from "@/auth";
import { ClaimButton } from "@/components/claim/claim-button";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ClaimedListingActions } from "@/components/listing/claimed-listing-actions";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewsDisplay } from "@/components/reviews/ReviewsDisplay";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { isFavoritesEnabled, isReviewsEnabled } from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getListingBySlug } from "@/data/listings";
import { getListingAverageRating } from "@/data/reviews";
import { constructMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  EditIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
  StarIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Force dynamic rendering to avoid static/dynamic conflicts
export const dynamic = "force-dynamic";

/**
 * Generate static params for all listing pages
 * This tells Next.js which listing pages to pre-build
 */
export async function generateStaticParams() {
  try {
    const { getPublicListings } = await import("@/data/listings");
    const listings = await getPublicListings();

    // Convert listing names to slugs
    return listings.map((listing) => ({
      slug:
        listing.listing_name
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") || listing.id,
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    // Return empty array if Supabase is not configured
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  try {
    const listing = await getListingBySlug(params.slug);

    if (!listing) {
      console.warn(
        `generateMetadata, listing not found for slug: ${params.slug}`,
      );
      return;
    }

    return constructMetadata({
      title: `${listing.listing_name} - Child Actor 101 Directory`,
      description:
        listing.what_you_offer ||
        "Professional acting services for young actors",
      canonicalUrl: `${siteConfig.url}/listing/${params.slug}`,
      image: listing.profile_image,
    });
  } catch (error) {
    console.error("generateMetadata error:", error);
    return constructMetadata({
      title: "Listing - Child Actor 101 Directory",
      description: "Professional acting services for young actors",
      canonicalUrl: `${siteConfig.url}/listing/${params.slug}`,
    });
  }
}

interface ListingPageProps {
  params: { slug: string };
}

export default async function ListingPage({ params }: ListingPageProps) {
  try {
    console.log(
      "ListingPage: Attempting to load listing for slug:",
      params.slug,
    );
    const listing = await getListingBySlug(params.slug);
    const session = await auth();

    if (!listing) {
      console.error("ListingPage: Listing not found for slug:", params.slug);
      return notFound();
    }

    console.log("ListingPage: Successfully found listing:", {
      id: listing.id,
      name: listing.listing_name,
      slug: params.slug,
    });

    // Check if current user owns this listing
    const isOwner = session?.user?.id === listing.owner_id;

    // Check if current user is admin
    const isAdmin = session?.user?.role === "admin";

    // Get average rating if reviews are enabled
    let averageRating = { average: 0, count: 0 };
    if (isReviewsEnabled()) {
      try {
        averageRating = await getListingAverageRating(listing.id);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    }

    // Debug listing data
    console.log("Listing data:", {
      id: listing.id,
      name: listing.listing_name,
      owner_id: listing.owner_id,
      claimed: listing.is_claimed === true,
      plan: listing.plan,
      approved_101_badge: listing.is_approved_101 === true,
    });

    return (
      <div className="listing-page">
        {/* Header Card */}
        <div className="listing-card">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-2 text-sm mb-6"
            style={{ color: "#666" }}
          >
            <Link href="/" className="hover:text-primary-orange">
              Directory
            </Link>
            <span>/</span>
            <span>{listing.listing_name}</span>
          </div>

          {/* Vendor Header */}
          <div className="flex items-start gap-8 mb-6">
            {listing.profile_image && (
              <Image
                src={listing.profile_image}
                alt={`Logo of ${listing.listing_name}`}
                title={`Logo of ${listing.listing_name}`}
                width={120}
                height={120}
                className="object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1 max-w-2xl">
              <h1
                className="text-3xl font-bold mb-3 line-clamp-2"
                style={{ color: "#0C1A2B" }}
              >
                {listing.listing_name}
              </h1>

              {/* Rating */}
              {isReviewsEnabled() && averageRating.count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating
                    value={Math.round(averageRating.average)}
                    readonly
                    size="md"
                  />
                  <span className="text-sm" style={{ color: "#666" }}>
                    {averageRating.average.toFixed(1)} ({averageRating.count}{" "}
                    review
                    {averageRating.count !== 1 ? "s" : ""})
                  </span>
                </div>
              )}

              {/* Badges - Only show 101 Approved, remove plan highlighting */}
              <div className="flex items-center gap-2 mb-4">
                {listing.is_approved_101 === true && (
                  <span className="badge green">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    101 Approved
                  </span>
                )}
                {isAdmin && listing.comped && (
                  <span className="badge mustard">Comped</span>
                )}
              </div>

              {/* Description */}
              <p
                className="text-lg leading-relaxed mb-6 line-clamp-4"
                style={{ color: "#0C1A2B" }}
              >
                {listing["What You Offer?"]}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {listing.website && (
                  <Button size="lg" asChild className="btn-primary">
                    <Link
                      href={listing.website}
                      target="_blank"
                      prefetch={false}
                      className="flex items-center justify-center space-x-2"
                    >
                      <GlobeIcon className="w-4 h-4" />
                      <span>Visit Website</span>
                    </Link>
                  </Button>
                )}
                {isOwner && (
                  <Button size="lg" asChild className="btn-secondary">
                    <Link
                      href="/dashboard/vendor"
                      className="flex items-center justify-center space-x-2"
                    >
                      <EditIcon className="w-4 h-4" />
                      <span>Edit Listing</span>
                    </Link>
                  </Button>
                )}
                {isFavoritesEnabled() && !isOwner && (
                  <FavoriteButton
                    listingId={listing.id}
                    listingName={listing.listing_name}
                    listingOwnerId={listing.owner_id}
                    size="lg"
                    variant="outline"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="listing-container">
          {/* Left Column - Story Cards */}
          <div className="space-y-6">
            {/* About Card */}
            <div className="listing-card">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "#0C1A2B" }}
              >
                About This Professional
              </h2>
              <p
                className="text-base leading-relaxed mb-6 line-clamp-6"
                style={{ color: "#0C1A2B" }}
              >
                {listing["What You Offer?"]}
              </p>

              {listing.who_is_it_for && (
                <div className="mb-6">
                  <h3>Who Is It For</h3>
                  <p
                    className="text-base leading-relaxed line-clamp-4"
                    style={{ color: "#0C1A2B" }}
                  >
                    {listing.who_is_it_for}
                  </p>
                </div>
              )}

              {listing.why_is_it_unique && (
                <div className="mb-6">
                  <h3>What Makes This Unique</h3>
                  <p
                    className="text-base leading-relaxed line-clamp-4"
                    style={{ color: "#0C1A2B" }}
                  >
                    {listing.why_is_it_unique}
                  </p>
                </div>
              )}

              {listing.format && (
                <div className="mb-6">
                  <h3>Service Format</h3>
                  <p
                    className="text-base leading-relaxed line-clamp-2"
                    style={{ color: "#0C1A2B" }}
                  >
                    {listing.format}
                  </p>
                </div>
              )}

              {listing.extras_notes && (
                <div>
                  <h3>Additional Notes</h3>
                  <p
                    className="text-base leading-relaxed line-clamp-4"
                    style={{ color: "#0C1A2B" }}
                  >
                    {listing.extras_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Review Form */}
            {isReviewsEnabled() && (
              <div className="listing-card">
                <ReviewForm
                  listingId={listing.id}
                  listingName={listing.listing_name || "Listing"}
                  listingOwnerId={listing.owner_id}
                />
              </div>
            )}

            {/* Back Link */}
            <div className="flex items-center justify-start">
              <Link
                href="/"
                className="text-sm hover:text-primary-orange"
                style={{ color: "#666" }}
              >
                ← Back to Directory
              </Link>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Gallery - Show for Pro listings or if gallery exists */}
            {(listing.gallery || listing.plan === "pro" || listing.comped) && (
              <div className="listing-card">
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#0C1A2B" }}
                >
                  Gallery
                </h2>
                {listing.gallery ? (
                  <div className="relative group overflow-hidden rounded-lg aspect-[4/3]">
                    <Image
                      src={listing.gallery}
                      alt={`Gallery image for ${listing.listing_name}`}
                      title={`Gallery image for ${listing.listing_name}`}
                      loading="eager"
                      fill
                      className="border w-full shadow-lg object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm">
                      No gallery images yet
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Contact Information */}
            <div className="listing-card">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "#0C1A2B" }}
              >
                Contact Information
              </h2>
              <ul className="space-y-4 text-base">
                {(listing.city || listing.state || listing.region) && (
                  <li className="flex items-start gap-3">
                    <MapPinIcon className="w-4 h-4 text-primary-orange mt-1 flex-shrink-0" />
                    <span style={{ color: "#0C1A2B" }}>
                      {[listing.city, listing.state]
                        .filter(Boolean)
                        .join(", ")}
                      {listing.region && listing.region !== listing.city && (
                        <span className="text-sm text-gray-600 ml-1">
                          ({listing.region})
                        </span>
                      )}
                    </span>
                  </li>
                )}
                {listing.phone && (
                  <li className="flex items-start gap-3">
                    <PhoneIcon className="w-4 h-4 text-primary-orange mt-1 flex-shrink-0" />
                    <a
                      href={`tel:${listing.phone}`}
                      className="hover:text-primary-orange"
                      style={{ color: "#0C1A2B" }}
                    >
                      {listing.phone}
                    </a>
                  </li>
                )}
                {listing.email && (
                  <li className="flex items-start gap-3">
                    <MailIcon className="w-4 h-4 text-primary-orange mt-1 flex-shrink-0" />
                    <a
                      href={`mailto:${listing.email}`}
                      className="hover:text-primary-orange"
                      style={{ color: "#0C1A2B" }}
                    >
                      {listing.email}
                    </a>
                  </li>
                )}
                {listing.format?.toLowerCase().includes("online") && (
                  <li className="flex items-start gap-3">
                    <GlobeIcon className="w-4 h-4 text-primary-orange mt-1 flex-shrink-0" />
                    <span style={{ color: "#0C1A2B" }}>
                      Virtual services available
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Claim Listing Section */}
            {!listing.is_claimed && !isOwner && (
              <div
                className="listing-card"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFDD0 0%, #F8F4E6 100%)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <ShieldIcon className="w-8 h-8 text-primary-orange" />
                  </div>
                  <div className="flex-1">
                    <h2
                      className="text-lg font-semibold mb-2"
                      style={{ color: "#0C1A2B" }}
                    >
                      Own This Business?
                    </h2>
                    <p className="mb-4" style={{ color: "#666" }}>
                      Claim your listing to gain full control, edit details, and
                      upgrade to premium plans.
                    </p>
                    <ClaimButton
                      listingId={listing.id}
                      listingName={listing.listing_name || "Listing"}
                      claimed={listing.is_claimed === true}
                      ownerId={listing.owner_id}
                      className="btn-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Claim Status Section */}
            {listing.is_claimed === true && (
              <div
                className="listing-card"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFDD0 0%, #E8F4FD 100%)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="w-8 h-8 text-secondary-denim" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary-denim mb-2">
                      Listing Claimed
                    </h3>
                    <p className="text-sm mb-3" style={{ color: "#666" }}>
                      This listing has been claimed by the business owner.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium"
                          style={{ color: "#0C1A2B" }}
                        >
                          Claimed by:
                        </span>
                        <span style={{ color: "#666" }}>
                          {listing["Claimed by? (Email)"]}
                        </span>
                      </div>
                      {listing.date_claimed && (
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "#0C1A2B" }}
                          >
                            Claimed on:
                          </span>
                          <span style={{ color: "#666" }}>
                            {new Date(
                              listing.date_claimed,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium"
                          style={{ color: "#0C1A2B" }}
                        >
                          Verification Status:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.verification_status === "Verified"
                              ? "bg-green-100 text-green-800"
                              : listing.verification_status === "Denied"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {listing.verification_status || "Pending"}
                        </span>
                      </div>
                      {listing.is_approved_101 === true && (
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "#0C1A2B" }}
                          >
                            101 Badge:
                          </span>
                          <span className="px-2 py-1 bg-primary-orange text-white rounded-full text-xs font-medium">
                            ✓ Verified Professional
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="listing-card">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "#0C1A2B" }}
              >
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {listing.categories && listing.categories.length > 0 ? (
                  listing.categories
                    .filter(category => category && category.trim() && !category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i))
                    .map((category, index) => {
                      const colors = ["orange", "blue", "mustard", "green"];
                      const colorClass = colors[index % colors.length];
                      return (
                        <span
                          key={category.trim()}
                          className={`badge ${colorClass}`}
                        >
                          {category.trim()}
                        </span>
                      );
                    })
                ) : (
                  <span className="text-sm" style={{ color: "#666" }}>
                    No categories listed
                  </span>
                )}
              </div>
            </div>

            {/* Age Range */}
            <div className="listing-card">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "#0C1A2B" }}
              >
                Age Range
              </h2>
              <div className="flex flex-wrap gap-2">
                {listing.age_range && listing.age_range.length > 0 ? (
                  listing.age_range
                    .filter(age => age && age.trim() && !age.includes("Age Range") && !age.includes("los-angeles") && !age.includes("hybrid"))
                    .map((age) => (
                      <span key={age.trim()} className="badge blue">
                        {age.trim()}
                      </span>
                    ))
                ) : (
                  <span className="text-sm" style={{ color: "#666" }}>
                    No age range specified
                  </span>
                )}
              </div>
            </div>

            {/* Reviews Display */}
            {isReviewsEnabled() && (
              <div className="listing-card">
                <ReviewsDisplay listingId={listing.id} />
              </div>
            )}

            {/* Certifications & Compliance */}
            {(listing.ca_permit_required === true ||
              listing.is_bonded === true) && (
              <div className="listing-card">
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#0C1A2B" }}
                >
                  Certifications & Compliance
                </h2>
                <ul className="space-y-2 text-sm">
                  {listing.ca_permit_required === true && (
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span style={{ color: "#0C1A2B" }}>
                        California Child Performer Services Permit
                      </span>
                    </li>
                  )}
                  {listing.is_bonded === true && (
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span style={{ color: "#0C1A2B" }}>
                        Bonded for Advanced Fees
                      </span>
                      {listing.bond_number && (
                        <span style={{ color: "#666" }}>
                          (Bond #{listing.bond_number})
                        </span>
                      )}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("ListingPage error:", error);
    return notFound();
  }
}
