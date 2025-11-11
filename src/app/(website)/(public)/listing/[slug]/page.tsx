import { getCategoriesByIds } from "@/actions/categories";
import { auth } from "@/auth";
import { Gallery } from "@/components/listing/gallery";
import { ListingDetailsSection } from "@/components/listing/listing-details-section";
import { ListingHero } from "@/components/listing/listing-hero";
import type { DisplayCategory } from "@/components/listing/types";
import { ListingContactSection } from "@/components/listing/listing-contact-section";
import { ListingReviewsSection } from "@/components/listing/listing-reviews-section";
import {
  BreadcrumbSchema,
  ListingSchema,
} from "@/components/seo/listing-schema";
import { RelatedLinks } from "@/components/seo/related-links";
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
import type { Metadata } from "next";
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
    const displayCategories: DisplayCategory[] = [];
    for (const rawCategory of listing.categories || []) {
      const storedName = categoryNames[rawCategory];
      const readableName = !storedName && !isUuidLike(rawCategory)
        ? String(rawCategory)
        : storedName;

      if (!readableName) continue;

      const trimmedName = readableName.trim();
      if (!trimmedName) continue;

      const key = normalizeCategory(trimmedName);
      const displayName = categoryNameLookup.get(key) || trimmedName;
      const iconFilename = iconLookup.get(key);
      const localIconEntry = Object.entries(localIconMap).find(
        ([name]) => normalizeCategory(name) === key,
      );
      const localIcon = localIconEntry?.[1];
      const exactNameUrl = getCategoryIconUrl(`${trimmedName}.png`);
      const derivedNameUrl = getCategoryIconUrl(
        `${trimmedName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "")}.png`,
      );
      const iconUrl =
        (iconFilename ? getCategoryIconUrl(iconFilename) : null) ||
        exactNameUrl ||
        derivedNameUrl ||
        localIcon ||
        null;
      const keyValue = `${displayName}-${iconFilename || localIcon || ""}`;

      if (displayCategories.some((category) => category.key === keyValue)) {
        continue;
      }

      displayCategories.push({
        key: keyValue,
        displayName,
        iconUrl,
      });
    }

    console.log("ListingPage: Successfully found listing:", {
      id: listing.id,
      name: listing.listing_name,
      slug: params.slug,
    });

    // Check if current user owns this listing
    const isOwner = session?.user?.id === listing.owner_id;

    const reviewsEnabled = isReviewsEnabled();

    // Get average rating if reviews are enabled
    let averageRating = { average: 0, count: 0 };
    if (reviewsEnabled) {
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

    const showFavorite = isFavoritesEnabled() && !isOwner;
    const hasPremiumAccess =
      (listing.plan || "").toLowerCase() !== "free";
    const showUpgradePrompt = !hasPremiumAccess;
    const showClaimCallout =
      !listing.is_claimed && !isOwner && !listing.owner_id;

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

        <ListingHero
          listing={listing}
          averageRating={averageRating}
          isOwner={isOwner}
          showFavorite={showFavorite}
          showReviews={reviewsEnabled}
          categories={displayCategories}
        />

        <div className="listing-layout">
          <div className="listing-layout__main">
            <ListingDetailsSection
              listing={listing}
              hasPremiumAccess={hasPremiumAccess}
            />
            <ListingReviewsSection
              listing={listing}
              isReviewsEnabled={reviewsEnabled}
            />
            <RelatedLinks
              listing={listing}
              relatedListings={related}
              categoryNames={displayCategories.map((c) => c.displayName)}
            />
          </div>
          <aside className="listing-layout__aside">
            <Gallery listing={listing} />
            <ListingContactSection
              listing={listing}
              showClaimCallout={showClaimCallout}
              showUpgradePrompt={showUpgradePrompt}
            />
          </aside>
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
