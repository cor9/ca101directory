import { auth } from "@/auth";
import { ClaimButton } from "@/components/claim/claim-button";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ClaimedListingActions } from "@/components/listing/claimed-listing-actions";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewsDisplay } from "@/components/reviews/ReviewsDisplay";
import { Button } from "@/components/ui/button";
import { isFavoritesEnabled, isReviewsEnabled } from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getListingBySlug } from "@/data/listings";
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
    const listing = await getListingBySlug(params.slug);
    const session = await auth();

    if (!listing) {
      console.error("ListingPage, listing not found");
      return notFound();
    }

    // Check if current user owns this listing
    const isOwner = session?.user?.id === listing.owner_id;

    // Debug listing data
    console.log("Listing data:", {
      id: listing.id,
      name: listing.listing_name,
      owner_id: listing.owner_id,
      claimed: listing.claimed,
      plan: listing.plan,
      approved_101_badge: listing.approved_101_badge,
    });

    return (
      <div className="flex flex-col gap-8">
        {/* Header section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3 gap-8 flex flex-col">
            {/* Basic information */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Directory
              </Link>
              <span>/</span>
              <span>{listing.listing_name}</span>
            </div>

            {/* logo + name + description */}
            <div className="flex flex-1 items-center">
              <div className="flex flex-col gap-8">
                <div className="flex w-full items-center gap-4">
                  {listing.profile_image && (
                    <Image
                      src={listing.profile_image}
                      alt={`Logo of ${listing.listing_name}`}
                      title={`Logo of ${listing.listing_name}`}
                      width={64}
                      height={64}
                      className="object-cover rounded-lg"
                    />
                  )}
                  <div className="flex flex-col gap-2">
                    <h1
                      className={cn(
                        "text-4xl tracking-wider font-bold flex items-center gap-2 text-foreground",
                        listing.plan === "Premium" &&
                          "text-gradient_blue-orange font-semibold",
                      )}
                    >
                      {listing.listing_name}
                    </h1>
                    <div className="flex items-center gap-2">
                      {listing.plan === "Premium" && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <StarIcon className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                      {listing.approved_101_badge && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircleIcon className="h-3 w-3" />
                          101 Approved
                        </span>
                      )}
                      {listing.plan && (
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            listing.plan === "Premium" &&
                              "bg-brand-orange text-white",
                            listing.plan === "Pro" &&
                              "bg-brand-blue text-white",
                            listing.plan === "Basic" &&
                              "bg-gray-100 text-gray-800",
                            listing.plan === "Free" &&
                              "bg-gray-100 text-gray-600",
                          )}
                        >
                          {listing.plan}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-foreground text-balance leading-relaxed">
                  {listing.what_you_offer}
                </p>
              </div>
            </div>

            {/* action buttons */}
            <div className="flex gap-4">
              {listing.website && (
                <Button size="lg" variant="default" asChild className="group">
                  <Link
                    href={listing.website}
                    target="_blank"
                    prefetch={false}
                    className="flex items-center justify-center space-x-2"
                  >
                    <GlobeIcon className="w-4 h-4 icon-scale" />
                    <span>Visit Website</span>
                  </Link>
                </Button>
              )}
              {isOwner && (
                <Button size="lg" variant="outline" asChild>
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
                  size="lg"
                  variant="outline"
                />
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            {listing.gallery && (
              <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
                <Image
                  src={listing.gallery}
                  alt={`Gallery image for ${listing.listing_name}`}
                  title={`Gallery image for ${listing.listing_name}`}
                  loading="eager"
                  fill
                  className="border w-full shadow-lg object-cover image-scale"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Detailed content */}
            <div className="bg-muted/50 rounded-lg p-6 mr-0 lg:mr-8">
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                About This Professional
              </h2>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-base leading-relaxed mb-4">
                  {listing.what_you_offer}
                </p>
                {listing.who_is_it_for && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Who Is It For:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing.who_is_it_for}
                    </p>
                  </div>
                )}
                {listing.why_is_it_unique && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      What Makes This Unique:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing.why_is_it_unique}
                    </p>
                  </div>
                )}
                {listing.format && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Service Format:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing.format}
                    </p>
                  </div>
                )}
                {listing.extras_notes && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Additional Notes:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing.extras_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Review Form */}
            {isReviewsEnabled() && (
              <div className="mt-8">
                <ReviewForm
                  listingId={listing.id}
                  listingName={listing.listing_name || "Listing"}
                />
              </div>
            )}

            <div className="flex items-center justify-start mt-16">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Directory
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-4">
                {/* Contact Information */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">
                    Contact Information
                  </h2>
                  <ul className="space-y-4 text-base">
                    {(listing.city || listing.state || listing.region) && (
                      <li className="flex items-start gap-3">
                        <MapPinIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <span className="text-foreground">
                          {[listing.city, listing.state, listing.region]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </li>
                    )}
                    {listing.phone && (
                      <li className="flex items-start gap-3">
                        <PhoneIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <a
                          href={`tel:${listing.phone}`}
                          className="hover:text-primary text-foreground"
                        >
                          {listing.phone}
                        </a>
                      </li>
                    )}
                    {listing.email && (
                      <li className="flex items-start gap-3">
                        <MailIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <a
                          href={`mailto:${listing.email}`}
                          className="hover:text-primary text-foreground"
                        >
                          {listing.email}
                        </a>
                      </li>
                    )}
                    {listing.format?.toLowerCase().includes("online") && (
                      <li className="flex items-start gap-3">
                        <GlobeIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <span className="text-foreground">
                          Virtual services available
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Claim Listing Section */}
                {!listing.claimed && !isOwner && (
                  <div className="bg-gradient-to-r from-brand-orange/5 to-brand-blue/5 rounded-lg p-6 border border-brand-orange/20">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <ShieldIcon className="w-8 h-8 text-brand-orange" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-2 text-foreground">
                          Own This Business?
                        </h2>
                        <p className="text-muted-foreground mb-4">
                          Claim your listing to gain full control, edit details,
                          and upgrade to premium plans.
                        </p>
                        <ClaimButton
                          listingId={listing.id}
                          listingName={listing.listing_name || "Listing"}
                          claimed={listing.claimed || false}
                          ownerId={listing.owner_id}
                          className="bg-brand-orange hover:bg-brand-orange-dark"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Claim Status Section */}
                {listing.claimed && (
                  <div className="bg-gradient-to-r from-brand-blue/5 to-brand-green/5 rounded-lg p-6 border border-brand-blue/20">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="w-8 h-8 text-brand-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-brand-blue mb-2">
                          Listing Claimed
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          This listing has been claimed by the business owner.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Claimed by:</span>
                            <span className="text-muted-foreground">
                              {listing.claimed_by_email}
                            </span>
                          </div>
                          {listing.date_claimed && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Claimed on:</span>
                              <span className="text-muted-foreground">
                                {new Date(
                                  listing.date_claimed,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
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
                          {listing.approved_101_badge && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">101 Badge:</span>
                              <span className="px-2 py-1 bg-brand-orange text-white rounded-full text-xs font-medium">
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
                <div className="bg-muted/50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">
                    Categories
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {listing.categories ? (
                      listing.categories.split(",").map((category) => (
                        <li key={category.trim()}>
                          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                            {category.trim()}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">
                        No categories listed
                      </li>
                    )}
                  </ul>
                </div>

                {/* Age Range */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">
                    Age Range
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {listing.age_range ? (
                      listing.age_range.split(",").map((age) => (
                        <li key={age.trim()}>
                          <span className="text-sm bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full">
                            {age.trim()}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">
                        No age range specified
                      </li>
                    )}
                  </ul>
                </div>

                {/* Reviews Display */}
                {isReviewsEnabled() && (
                  <ReviewsDisplay listingId={listing.id} />
                )}

                {/* Certifications & Compliance */}
                {(listing.ca_performer_permit ||
                  listing.bonded_for_advanced_fees) && (
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 text-foreground">
                      Certifications & Compliance
                    </h2>
                    <ul className="space-y-2 text-sm">
                      {listing.ca_performer_permit && (
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          <span>
                            California Child Performer Services Permit
                          </span>
                        </li>
                      )}
                      {listing.bonded_for_advanced_fees && (
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          <span>Bonded for Advanced Fees</span>
                          {listing.bond_number && (
                            <span className="text-muted-foreground">
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

          {/* Review Form - Show for non-owners when reviews are enabled */}
          {isReviewsEnabled() && !isOwner && (
            <div className="mt-8">
              <ReviewForm
                listingId={listing.id}
                listingName={listing.listing_name || "this listing"}
              />
            </div>
          )}

          {/* Claimed Listing Actions - Show for owners */}
          {/* TODO: Add claimedBy field to Listing interface and fix type compatibility */}
          {/* 
          {listing.claimed && (
            <div className="mt-8">
              <ClaimedListingActions listing={listing} isOwner={true} />
            </div>
          )}
          */}
        </div>
      </div>
    );
  } catch (error) {
    console.error("ListingPage error:", error);
    return notFound();
  }
}
