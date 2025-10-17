import { getCategoriesByIds } from "@/actions/categories";
import { auth } from "@/auth";
import { ClaimButton } from "@/components/claim/claim-button";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ClaimedListingActions } from "@/components/listing/claimed-listing-actions";
import { Gallery } from "@/components/listing/gallery";
import { ProfileImage } from "@/components/listing/listing-images";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewsDisplay } from "@/components/reviews/ReviewsDisplay";
import {
  BreadcrumbSchema,
  ListingSchema,
} from "@/components/seo/listing-schema";
import { RelatedLinks } from "@/components/seo/related-links";
import { Button } from "@/components/ui/button";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import SocialMediaIcons from "@/components/ui/social-media-icons";
import { StarRating } from "@/components/ui/star-rating";
import { isFavoritesEnabled, isReviewsEnabled } from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getCategories, getCategoryIconsMap } from "@/data/categories";
import { getListingBySlug, getPublicListings } from "@/data/listings";
import { getListingAverageRating } from "@/data/reviews";
import { getCategoryIconUrl, getListingImageUrl } from "@/lib/image-urls";
import { constructMetadata } from "@/lib/metadata";
import { generateSlugFromListing } from "@/lib/slug-utils";
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
import { notFound, redirect } from "next/navigation";

// Force dynamic rendering to avoid static/dynamic conflicts
export const dynamic = "force-dynamic";

/**
 * Generate a proper SEO-friendly slug from listing name
 */
function generateSlug(listingName: string, id: string): string {
  if (!listingName || listingName.trim() === "") {
    // If no name, create a generic slug with ID suffix
    return `listing-${id.slice(-8)}`;
  }

  return listingName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate static params for all listing pages
 * This tells Next.js which listing pages to pre-build
 */
export async function generateStaticParams() {
  try {
    const { getPublicListings } = await import("@/data/listings");
    const listings = await getPublicListings();

    // Convert listing names to proper SEO-friendly slugs
    return listings
      .filter(
        (listing) => listing.listing_name && listing.listing_name.trim() !== "",
      )
      .map((listing) => ({
        slug: generateSlug(listing.listing_name || "", listing.id),
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

    // Build SEO-rich title and description
    const category = listing.categories?.[0] || "Acting Professional";
    const cityState = [listing.city, listing.state].filter(Boolean).join(", ");
    const location = cityState ? ` in ${cityState}` : "";

    const title = `${listing.listing_name} | ${category}${location}`;
    const description =
      listing.what_you_offer ||
      `Find ${listing.listing_name}${location} — a trusted ${category.toLowerCase()} for child actors on Child Actor 101 Directory.`;

    const url = `${siteConfig.url}/listing/${params.slug}`;
    const image = listing.profile_image
      ? getListingImageUrl(listing.profile_image)
      : `${siteConfig.url}/og-default.jpg`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [
          { url: image, width: 1200, height: 630, alt: listing.listing_name },
        ],
        type: "website",
        siteName: "Child Actor 101 Directory",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: url,
      },
    };
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

    // Handle UUID redirect - redirect to proper SEO-friendly URL
    if ("_needsRedirect" in listing && listing._needsRedirect) {
      const properSlug = generateSlugFromListing(listing);
      console.log("ListingPage: Redirecting UUID to proper slug:", properSlug);
      redirect(`/listing/${properSlug}`);
    }

    const [categoryRecords, categoryIconMap] = await Promise.all([
      getCategories(),
      getCategoryIconsMap(),
    ]);

    const normalizeCategory = (value: string) =>
      value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    const categoryNameLookup = new Map<string, string>();
    for (const cat of categoryRecords) {
      const key = normalizeCategory(cat.category_name || "");
      if (key) {
        categoryNameLookup.set(key, cat.category_name);
      }
    }

    const iconLookup = new Map<string, string>();
    for (const [name, filename] of Object.entries(categoryIconMap || {})) {
      const key = normalizeCategory(name);
      if (key) {
        iconLookup.set(key, filename);
      }
    }

    const localIconMap: Record<string, string> = {
      "Acting Classes & Coaches": "/categories/masks.png",
      "Headshot Photographers": "/categories/camera.png",
      "Self-Tape Studios": "/categories/selftape.png",
      "Demo Reel Creators": "/categories/reelcreator.png",
      "Vocal Coaches": "/categories/singer.png",
      "Talent Managers": "/categories/rep.png",
      "Casting Workshops": "/categories/handwriting.png",
      "Reels Editors": "/categories/reel_editor.png",
      "Social Media Consultants": "/categories/socialmedia.png",
      "Acting Camps": "/categories/theatre.png",
      "Acting Schools": "/categories/masks.png",
      "Audition Prep": "/categories/audprep.png",
      "Voiceover Studios": "/categories/mic.png",
      "Theatre Training": "/categories/kidstheatre.png",
      "Entertainment Lawyers": "/categories/legalfile.png",
      "Financial Advisors": "/categories/moneybag.png",
      Publicists: "/categories/publicist.png",
      "Hair/Makeup Artists": "/categories/makeup.png",
      "Wardrobe Stylists": "/categories/wardrobe.png",
      "Branding Coaches": "/categories/colowheel.png",
      "Mental Health for Performers": "/categories/mentalhealth.png",
      "On-Set Tutors": "/categories/tutor.png",
      "Reel Creator": "/categories/reelcreator.png",
      Feedback: "/categories/play1.png",
      "Career Consultation": "/categories/consult.png",
      "Dance Classes": "/categories/danceclass.png",
      Reel: "/categories/filmreel.png",
      "Scene Writing": "/categories/script.png",
    };

    // Fetch category names from database for UUIDs using server action
    const categoryNames = await getCategoriesByIds(listing.categories || []);

    // Display categories - handle both UUIDs and names
    const displayCategories = (listing.categories || [])
      .map((catId) => {
        // If we have a category name from database, use it
        if (categoryNames[catId]) {
          const categoryName = categoryNames[catId];
          const key = normalizeCategory(categoryName);
          const displayName = categoryNameLookup.get(key) || categoryName;
          const iconFilename = iconLookup.get(key);
          const localIconEntry = Object.entries(localIconMap).find(
            ([n]) => normalizeCategory(n) === key,
          );
          const localIcon = localIconEntry?.[1];
          return {
            original: categoryName,
            displayName,
            iconUrl: iconFilename
              ? getCategoryIconUrl(iconFilename)
              : localIcon || null,
            key: `${categoryName}-${iconFilename || localIcon || ""}`,
          };
        }

        // If no database match, try to use the UUID as a fallback category name
        // This handles cases where the category lookup fails
        return {
          original: catId,
          displayName: "Acting Classes & Coaches", // Default fallback
          iconUrl: null,
          key: `fallback-${catId}`,
        };
      })
      .filter((cat) => cat.displayName && cat.displayName !== cat.original);

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

    // Get related listings (same category, different listing)
    const relatedListings = await getPublicListings();
    const primaryCategory = listing.categories?.[0];
    const related = relatedListings
      .filter(
        (l) =>
          l.id !== listing.id &&
          l.status === "Live" &&
          l.is_active &&
          l.categories?.includes(primaryCategory || ""),
      )
      .slice(0, 3);

    // Debug listing data
    console.log("Listing data:", {
      id: listing.id,
      name: listing.listing_name,
      owner_id: listing.owner_id,
      claimed: listing.is_claimed === true,
      plan: listing.plan,
      badge_approved: listing.badge_approved === true,
      relatedCount: related.length,
    });

    return (
      <div className="listing-page">
        {/* Schema.org Structured Data for SEO */}
        <ListingSchema listing={listing} averageRating={averageRating} />
        <BreadcrumbSchema
          items={[
            { name: "Home", url: siteConfig.url },
            { name: "Directory", url: `${siteConfig.url}/directory` },
            {
              name: listing.listing_name || "Listing",
              url: `${siteConfig.url}/listing/${params.slug}`,
            },
          ]}
        />

        {/* Header Card */}
        <div className="listing-card">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 text-gray-900">
            <Link href="/" className="hover:text-primary-orange">
              Directory
            </Link>
            <span>/</span>
            <span>{listing.listing_name}</span>
          </div>

          {/* Vendor Header */}
          <div className="flex items-start gap-8 mb-6">
            <ProfileImage listing={listing} />
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
                  <span className="text-gray-900">
                    {averageRating.average.toFixed(1)} ({averageRating.count}{" "}
                    review
                    {averageRating.count !== 1 ? "s" : ""})
                  </span>
                </div>
              )}

              {/* Badges - Only show 101 Approved, remove plan highlighting */}
              <div className="flex items-center gap-2 mb-4">
                {listing.badge_approved === true && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-brand-orange rounded-lg px-4 py-2">
                    <Image
                      src="/101approvedbadge.png"
                      alt="101 Approved Badge"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <span className="font-bold text-brand-orange">
                      101 APPROVED
                    </span>
                  </div>
                )}
              </div>

              {/* Last Updated - Freshness Signal for SEO */}
              {listing.updated_at && (
                <p className="text-xs text-gray-900 mb-3">
                  Last updated:{" "}
                  {new Date(listing.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}

              {/* Description */}
              <div className="mb-6">
                <RichTextDisplay
                  content={listing.what_you_offer || ""}
                  className="text-lg leading-relaxed"
                />
              </div>

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
              <div className="mb-6">
                <RichTextDisplay
                  content={listing.what_you_offer || ""}
                  className="text-base leading-relaxed"
                />
              </div>

              {/* Premium content - only show for paid plans */}
              {listing.who_is_it_for &&
                listing.plan !== "Free" &&
                listing.plan !== "free" && (
                  <div className="mb-6">
                    <h3>Who Is It For</h3>
                    <RichTextDisplay
                      content={listing.who_is_it_for}
                      className="text-base leading-relaxed"
                    />
                  </div>
                )}

              {listing.why_is_it_unique &&
                listing.plan !== "Free" &&
                listing.plan !== "free" && (
                  <div className="mb-6">
                    <h3>What Makes This Unique</h3>
                    <RichTextDisplay
                      content={listing.why_is_it_unique}
                      className="text-base leading-relaxed"
                    />
                  </div>
                )}

              {/* Premium content - only show for paid plans */}
              {listing.format &&
                listing.plan !== "Free" &&
                listing.plan !== "free" && (
                  <div className="mb-6">
                    <h3>Service Format</h3>
                    <RichTextDisplay
                      content={listing.format}
                      className="text-base leading-relaxed"
                    />
                  </div>
                )}

              {listing.extras_notes &&
                listing.plan !== "Free" &&
                listing.plan !== "free" && (
                  <div>
                    <h3>Additional Notes</h3>
                    <RichTextDisplay
                      content={listing.extras_notes}
                      className="text-base leading-relaxed"
                    />
                  </div>
                )}

              {/* Free plan upgrade prompt */}
              {(listing.plan === "Free" || listing.plan === "free") && (
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📈</span>
                    <h3 className="font-semibold text-orange-800">
                      More Details Available
                    </h3>
                  </div>
                  <p className="text-sm text-orange-700 mb-3">
                    This professional has additional details about their
                    services, target audience, and unique approach available
                    with a premium listing.
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="/pricing"
                      className="inline-flex items-center px-3 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
                    >
                      View Pricing Plans
                    </a>
                    <a
                      href="/plan-selection"
                      className="inline-flex items-center px-3 py-2 bg-white text-orange-600 text-sm border border-orange-300 rounded-md hover:bg-orange-50 transition-colors"
                    >
                      Upgrade Listing
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Links - Pro Users Only */}
            <SocialMediaIcons listing={listing} className="listing-card" />

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
                className="text-sm hover:text-primary-orange text-gray-900"
              >
                ← Back to Directory
              </Link>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Gallery */}
            <Gallery listing={listing} />

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
                      {[listing.city, listing.state].filter(Boolean).join(", ")}
                      {listing.region && listing.region.length > 0 && (
                        <span className="text-sm text-gray-900 ml-1">
                          ({listing.region.join(", ")})
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
            {!listing.is_claimed && !isOwner && !listing.owner_id && (
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
                    <p className="text-gray-900">
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

            {/* Categories */}
            <div className="listing-card">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "#0C1A2B" }}
              >
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {displayCategories.length > 0 ? (
                  displayCategories.map(
                    ({ key, displayName, iconUrl }, index) => {
                      const colors = ["orange", "blue", "mustard", "green"];
                      const colorClass = colors[index % colors.length];
                      return (
                        <span
                          key={key}
                          className={`badge ${colorClass} flex items-center gap-2`}
                        >
                          {iconUrl && (
                            <Image
                              src={iconUrl}
                              alt={displayName}
                              width={20}
                              height={20}
                              className="h-5 w-5 rounded-full object-contain"
                            />
                          )}
                          {displayName}
                        </span>
                      );
                    },
                  )
                ) : (
                  <span className="text-gray-900">No categories listed</span>
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
                    .filter((age) => {
                      const val = age?.trim() || "";
                      if (!val) return false;
                      if (val.includes("Age Range")) return false;
                      if (val.includes("los-angeles")) return false;
                      if (val.includes("hybrid")) return false;
                      // Exclude UUID-like tokens
                      const uuidLike =
                        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                      if (uuidLike.test(val)) return false;
                      return true;
                    })
                    .map((age) => (
                      <span key={(age || "").trim()} className="badge blue">
                        {(age || "").trim()}
                      </span>
                    ))
                ) : (
                  <span className="text-gray-900">No age range specified</span>
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
                        <span className="text-gray-900">
                          (Bond #{listing.bond_number})
                        </span>
                      )}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Internal Linking for SEO */}
            <RelatedLinks listing={listing} relatedListings={related} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("ListingPage error:", error);
    return notFound();
  }
}
