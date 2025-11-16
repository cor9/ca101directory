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
import {
  type Listing,
  getListingBySlug,
  getPublicListings,
} from "@/data/listings";
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

    // Prefer database slug; fall back to generated
    return listings
      .filter((listing) => !!(listing.slug || listing.listing_name))
      .map((listing) => ({
        slug:
          listing.slug || generateSlug(listing.listing_name || "", listing.id),
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

    // Prefer canonical SEO slug if this is a UUID-based visit
    const needsRedirect = (listing as unknown as { _needsRedirect?: boolean })
      ? (listing as unknown as { _needsRedirect?: boolean })._needsRedirect ===
        true
      : false;
    const canonicalSlug = needsRedirect
      ? generateSlugFromListing(listing)
      : params.slug;
    const url = `${siteConfig.url}/listing/${canonicalSlug}`;
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
    console.log("ListingPage: getListingBySlug completed");

    const session = await auth();
    console.log("ListingPage: auth completed");

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

    console.log("ListingPage: About to fetch categories and icons");
    const [categoryRecords, categoryIconMap] = await Promise.all([
      getCategories(),
      getCategoryIconsMap(),
    ]);
    console.log("ListingPage: Categories and icons fetched");
    // Simple helper to transform a YouTube/Vimeo link into an embeddable URL
    const toEmbedUrl = (url?: string): string | null => {
      if (!url) return null;
      try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();
        // YouTube
        if (host.includes("youtube.com")) {
          const id = u.searchParams.get("v");
          return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        if (host === "youtu.be") {
          const id = u.pathname.replace("/", "");
          return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        // Vimeo
        if (host.includes("vimeo.com")) {
          const id = u.pathname.split("/").filter(Boolean).pop();
          return id ? `https://player.vimeo.com/video/${id}` : null;
        }
        return null;
      } catch {
        return null;
      }
    };

    const normalizeCategory = (value: string) =>
      value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Helper function to check if a value looks like a UUID
    const isUuidLike = (value: string | undefined): boolean => {
      if (!value) return false;
      return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
        value.trim(),
      );
    };

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
    console.log("ListingPage: About to fetch category names by IDs");
    const categoryNames = await getCategoriesByIds(listing.categories || []);
    console.log("ListingPage: Category names by IDs fetched");

    // Display categories - handle both UUIDs and names
    const displayCategoriesRaw = (listing.categories || [])
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
          // New resolution order: exact bucket name, derived, mapped, local
          const exactNameUrl = getCategoryIconUrl(`${categoryName}.png`);
          const derivedNameUrl = getCategoryIconUrl(
            `${categoryName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "_")
              .replace(/^_+|_+$/g, "")}.png`,
          );
          return {
            original: categoryName,
            displayName,
            iconUrl:
              (iconFilename ? getCategoryIconUrl(iconFilename) : null) ||
              exactNameUrl ||
              derivedNameUrl ||
              localIcon ||
              null,
            key: `${categoryName}-${iconFilename || localIcon || ""}`,
          };
        }

        // If catId is already a readable category name (not a UUID), use it directly
        if (!isUuidLike(catId)) {
          const key = normalizeCategory(catId);
          const iconFilename = iconLookup.get(key);
          const localIconEntry = Object.entries(localIconMap).find(
            ([n]) => normalizeCategory(n) === key,
          );
          const localIcon = localIconEntry?.[1];
          const exactNameUrl = getCategoryIconUrl(`${catId}.png`);
          const derivedNameUrl = getCategoryIconUrl(
            `${String(catId)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "_")
              .replace(/^_+|_+$/g, "")}.png`,
          );
          return {
            original: catId,
            displayName: catId,
            iconUrl:
              (iconFilename ? getCategoryIconUrl(iconFilename) : null) ||
              exactNameUrl ||
              derivedNameUrl ||
              localIcon ||
              null,
            key: `${catId}-${iconFilename || localIcon || ""}`,
          };
        }

        // If no database match and it's a UUID, use default fallback
        return {
          original: catId,
          displayName: "Acting Classes & Coaches", // Default fallback
          iconUrl: null,
          key: `fallback-${catId}`,
        };
      })
      .filter(
        (cat) => cat.displayName && cat.key && !cat.key.startsWith("fallback-"),
      );

    // Properly dedupe by normalized display name
    const seenCategoryNames = new Set<string>();
    const normalizeName = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    const displayCategories = displayCategoriesRaw.filter((cat) => {
      const k = normalizeName(cat.displayName);
      if (seenCategoryNames.has(k)) return false;
      seenCategoryNames.add(k);
      return true;
    });

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
        console.log("ListingPage: About to fetch average rating");
        averageRating = await getListingAverageRating(listing.id);
        console.log("ListingPage: Average rating fetched");
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    }

    // Get related listings (same category, different listing)
    console.log("ListingPage: About to fetch public listings for related");
    // Temporarily disable related listings fetch to debug hanging issue
    // const relatedListings = await getPublicListings();
    const relatedListings: Listing[] = [];
    console.log("ListingPage: Public listings fetch skipped (debugging)");
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
        <div className="listing-card-transparent">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 text-ink">
            <Link href="/" className="hover:text-primary-orange">
              Directory
            </Link>
            <span>/</span>
            <span>{listing.listing_name}</span>
          </div>

          {/* Vendor Header - Compact Layout */}
          <div className="flex items-start gap-6">
            <ProfileImage listing={listing} />
            <div className="flex-1">
              <h1
                className="bauhaus-heading text-3xl font-bold mb-3"
                style={{ color: "#fafaf4" }}
              >
                {listing.listing_name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-paper">
                {/* Rating */}
                {isReviewsEnabled() && averageRating.count > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating
                      value={Math.round(averageRating.average)}
                      readonly
                      size="md"
                    />
                    <span className="text-paper text-sm">
                      {averageRating.average.toFixed(1)} ({averageRating.count}{" "}
                      review
                      {averageRating.count !== 1 ? "s" : ""})
                    </span>
                  </div>
                )}

                {/* 101 Approved Icon (transparent, larger) */}
                {listing.badge_approved === true && (
                  <Image
                    src="/101approvedbadge.png"
                    alt="101 Approved"
                    width={64}
                    height={64}
                    className="object-contain"
                    priority
                  />
                )}

                {/* Last Updated */}
                {listing.updated_at && (
                  <p className="text-xs text-gray-200">
                    Last updated:{" "}
                    {new Date(listing.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {listing.website && (
                  <Button size="default" asChild className="btn-primary-cta">
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
                  <Button size="default" asChild className="btn-secondary">
                    <Link
                      href="/dashboard/vendor"
                      className="flex items-center justify-center space-x-2 hover:!bg-[#2f95ba] hover:!text-white hover:[&_svg]:!text-white hover:opacity-90"
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
                    size="default"
                    variant="outline"
                  />
                )}
              </div>

              {/* Quick Facts in header - clean layout, no pills */}
              <div className="mt-4 space-y-2 text-paper">
                <div className="text-sm font-semibold opacity-90">Contact Information</div>
                <div className="flex flex-wrap items-center gap-4 text-base">
                  {(listing.city || listing.state) && (
                    <span className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-[#3A76A6]" />
                      {[listing.city, listing.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {listing.region && (
                    <span className="flex items-center gap-2">
                      <ShieldIcon className="w-4 h-4 text-[#3A76A6]" />
                      {Array.isArray(listing.region)
                        ? listing.region.join(", ")
                        : String(listing.region)}
                    </span>
                  )}
                  {listing.phone && (
                    <span className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-[#3A76A6]" />
                      {listing.phone}
                    </span>
                  )}
                  {listing.email && (
                    <span className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 text-[#3A76A6]" />
                      {listing.email}
                    </span>
                  )}
                </div>
                {(() => {
                  // Virtual services note if formats include online/hybrid
                  const raw = (listing.age_range || []).map((v) => (v || "").trim().toLowerCase());
                  const hasVirtual = raw.includes("online") || raw.includes("hybrid");
                  return hasVirtual ? (
                    <div className="text-sm opacity-90">Virtual services available</div>
                  ) : null;
                })()}

                {/* Categories - mustard chips without icons */}
                {displayCategories.length > 0 && (
                  <div className="flex flex-wrap gap-6 mt-2">
                    {displayCategories.slice(0, 6).map(({ key, displayName }) => {
                      const cls = "chip-mustard"; // exact mustard for header
                      return (
                        <span key={`cat-${key}`} className={`badge ${cls}`}>
                          {displayName}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Ages - light grey chips with bold black text */}
                {(() => {
                  const raw = (listing.age_range || []).map((v) => (v || "").trim()).filter(Boolean);
                  const serviceTags = new Set(["online", "in-person", "in person", "hybrid"]);
                  const isUuid = (s: string) =>
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
                  const isAgeToken = (s: string) =>
                    /^\d+\s*-\s*\d+$/.test(s) || /^\d+\+$/.test(s) || /^\d+$/.test(s);
                  const ages = raw.filter((s) => !serviceTags.has(s.toLowerCase()) && !isUuid(s) && isAgeToken(s));
                  if (ages.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ages.slice(0, 6).map((a, i) => (
                        <span key={`age-chip-${i}-${a}`} className="badge chip-age">
                          {a}
                        </span>
                      ))}
                    </div>
                  );
                })()}
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
            <SocialMediaIcons listing={listing} className="listing-card-orange-rust" />

            {/* Review Form */}
            {isReviewsEnabled() && (
              <div
                className="listing-card-transparent text-paper border"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#f8f4e6",
                }}
              >
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
                className="text-sm hover:text-bauhaus-blue text-paper transition-colors"
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
            <div
              className="listing-card-blue"
              style={{ backgroundColor: "rgb(63, 174, 214)" }}
            >
              <h2
                className="bauhaus-heading text-lg font-semibold mb-4"
                style={{ color: "#0C1A2B" }}
              >
                Contact Information
              </h2>
              <ul className="space-y-4 text-base">
                {(listing.city || listing.state || listing.region) && (
                  <li className="flex items-start gap-3">
                    <MapPinIcon className="w-4 h-4 mt-1 flex-shrink-0 text-[#e4572e]" />
                    <span style={{ color: "#0C1A2B" }}>
                      {[listing.city, listing.state].filter(Boolean).join(", ")}
                    </span>
                  </li>
                )}
                {listing.region && listing.region.length > 0 && (
                  <li className="flex items-start gap-3">
                    <span className="sr-only">Regions</span>
                    <div className="text-sm text-paper ml-7 -mt-2">
                      {listing.region.join(", ")}
                    </div>
                  </li>
                )}
                {listing.phone && (
                  <li className="flex items-start gap-3">
                    <PhoneIcon className="w-4 h-4 mt-1 flex-shrink-0 text-[#e4572e]" />
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
                    <MailIcon className="w-4 h-4 mt-1 flex-shrink-0 text-[#e4572e]" />
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
                    <GlobeIcon className="w-4 h-4 mt-1 flex-shrink-0 text-[#e4572e]" />
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
                style={{ background: "rgb(228, 167, 46)" }}
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
                    <p style={{ color: "#1e1f23" }}>
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

            {/* Promo Video (if provided) */}
            {listing.custom_link_url && toEmbedUrl(listing.custom_link_url) && (
              <div className="listing-card-green">
                <h2 className="text-lg font-semibold text-paper"}}>
                  Promo Video
                </h2>
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-[color:var(--card-border)] bg-black">
                  <iframe
                    src={toEmbedUrl(listing.custom_link_url) as string}
                    title="Promo video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs mt-2 text-paper">
                  Suggested length under 3 minutes.
                </p>
              </div>
            )}

            {/* Quick Facts moved to header */}

            {/* Age Range card removed in favor of Quick Facts */}

            {/* Reviews Display */}
            {isReviewsEnabled() && (
              <div className="listing-card-grey">
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
                        <span className="text-paper">
                          (Bond #{listing.bond_number})
                        </span>
                      )}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Internal Linking for SEO */}
            <RelatedLinks
              listing={listing}
              relatedListings={related}
              categoryNames={displayCategories.map((c) => c.displayName)}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    const err = error as { digest?: string };
    // Allow Next.js redirects to bubble up instead of being converted to 404
    if (err?.digest === "NEXT_REDIRECT") throw error;
    console.error("ListingPage: Error loading listing:", error);
    return notFound();
  }
}
