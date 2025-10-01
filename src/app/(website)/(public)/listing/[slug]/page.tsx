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
        listing["Listing Name"]
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
      title: `${listing["Listing Name"]} - Child Actor 101 Directory`,
      description:
        listing["What You Offer?"] ||
        "Professional acting services for young actors",
      canonicalUrl: `${siteConfig.url}/listing/${params.slug}`,
      image: listing["Profile Image"],
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
      name: listing["Listing Name"],
      owner_id: listing.owner_id,
      claimed: listing["Claimed?"] === "checked",
      plan: listing.Plan,
      approved_101_badge: listing["Approved 101 Badge"] === "checked",
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
              <span>{listing["Listing Name"]}</span>
            </div>

            {/* logo + name + description */}
            <div className="flex flex-1 items-center">
              <div className="flex flex-col gap-8">
                <div className="flex w-full items-center gap-4">
                  {listing["Profile Image"] && (
                    <Image
                      src={listing["Profile Image"]}
                      alt={`Logo of ${listing["Listing Name"]}`}
                      title={`Logo of ${listing["Listing Name"]}`}
                      width={64}
                      height={64}
                      className="object-cover rounded-lg"
                    />
                  )}
                  <div className="flex flex-col gap-2">
                    <h1
                      className={cn(
                        "text-4xl tracking-wider font-bold flex items-center gap-2 text-foreground",
                        listing.Plan === "Premium" &&
                          "text-gradient_blue-orange font-semibold",
                      )}
                    >
                      {listing["Listing Name"]}
                    </h1>
                    <div className="flex items-center gap-2">
                      {listing.Plan === "Premium" && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <StarIcon className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                      {listing["Approved 101 Badge"] === "checked" && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircleIcon className="h-3 w-3" />
                          101 Approved
                        </span>
                      )}
                      {listing.Plan && (
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            listing.Plan === "Premium" &&
                              "bg-brand-orange text-white",
                            listing.Plan === "Pro" &&
                              "bg-brand-blue text-white",
                            listing.Plan === "Basic" &&
                              "bg-gray-100 text-gray-800",
                            listing.Plan === "Free" &&
                              "bg-gray-100 text-gray-600",
                          )}
                        >
                          {listing.Plan}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-foreground text-balance leading-relaxed">
                  {listing["What You Offer?"]}
                </p>
              </div>
            </div>

            {/* action buttons */}
            <div className="flex gap-4">
              {listing.Website && (
                <Button size="lg" variant="default" asChild className="group">
                  <Link
                    href={listing.Website}
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
            {listing.Gallery && (
              <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
                <Image
                  src={listing.Gallery}
                  alt={`Gallery image for ${listing["Listing Name"]}`}
                  title={`Gallery image for ${listing["Listing Name"]}`}
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
                  {listing["What You Offer?"]}
                </p>
                {listing["Who Is It For?"] && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Who Is It For:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing["Who Is It For?"]}
                    </p>
                  </div>
                )}
                {listing["Why Is It Unique?"] && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      What Makes This Unique:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing["Why Is It Unique?"]}
                    </p>
                  </div>
                )}
                {listing["Format (In-person/Online/Hybrid)"] && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Service Format:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing["Format (In-person/Online/Hybrid)"]}
                    </p>
                  </div>
                )}
                {listing["Extras/Notes"] && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Additional Notes:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing["Extras/Notes"]}
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
                  listingName={listing["Listing Name"] || "Listing"}
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
                    {(listing.City || listing.State || listing.Region) && (
                      <li className="flex items-start gap-3">
                        <MapPinIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <span className="text-foreground">
                          {[listing.City, listing.State, listing.Region]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </li>
                    )}
                    {listing.Phone && (
                      <li className="flex items-start gap-3">
                        <PhoneIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <a
                          href={`tel:${listing.Phone}`}
                          className="hover:text-primary text-foreground"
                        >
                          {listing.Phone}
                        </a>
                      </li>
                    )}
                    {listing.Email && (
                      <li className="flex items-start gap-3">
                        <MailIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <a
                          href={`mailto:${listing.Email}`}
                          className="hover:text-primary text-foreground"
                        >
                          {listing.Email}
                        </a>
                      </li>
                    )}
                    {listing["Format (In-person/Online/Hybrid)"]
                      ?.toLowerCase()
                      .includes("online") && (
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
                {!listing["Claimed?"] && !isOwner && (
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
                          listingName={listing["Listing Name"] || "Listing"}
                          claimed={listing["Claimed?"] === "checked"}
                          ownerId={listing.owner_id}
                          className="bg-brand-orange hover:bg-brand-orange-dark"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Claim Status Section */}
                {listing["Claimed?"] === "checked" && (
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
                              {listing["Claimed by? (Email)"]}
                            </span>
                          </div>
                          {listing["Date Claimed"] && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Claimed on:</span>
                              <span className="text-muted-foreground">
                                {new Date(
                                  listing["Date Claimed"],
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
                                listing["Verification Status"] === "Verified"
                                  ? "bg-green-100 text-green-800"
                                  : listing["Verification Status"] === "Denied"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {listing["Verification Status"] || "Pending"}
                            </span>
                          </div>
                          {listing["Approved 101 Badge"] === "checked" && (
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
                    {listing.Categories ? (
                      listing.Categories.split(",").map((category) => (
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
                    {listing["Age Range"] ? (
                      listing["Age Range"].split(",").map((age) => (
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
                {(listing["California Child Performer Services Permit "] ===
                  "checked" ||
                  listing["Bonded For Advanced Fees"] === "checked") && (
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 text-foreground">
                      Certifications & Compliance
                    </h2>
                    <ul className="space-y-2 text-sm">
                      {listing[
                        "California Child Performer Services Permit "
                      ] === "checked" && (
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          <span>
                            California Child Performer Services Permit
                          </span>
                        </li>
                      )}
                      {listing["Bonded For Advanced Fees"] === "checked" && (
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          <span>Bonded for Advanced Fees</span>
                          {listing["Bond#"] && (
                            <span className="text-muted-foreground">
                              (Bond #{listing["Bond#"]})
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
                listingName={listing["Listing Name"] || "this listing"}
              />
            </div>
          )}

          {/* Claimed Listing Actions - Show for owners */}
          {/* TODO: Add claimedBy field to Listing interface and fix type compatibility */}
          {/* 
          {listing["Claimed?"] === "checked" && (
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
