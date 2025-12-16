import { getCategoriesByIds } from "@/actions/categories";
import { auth } from "@/auth";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import ListingLayout from "@/components/listing/ListingLayout";
import { ListingCarousel } from "@/components/listing/listing-carousel";
import { ListingContactSection } from "@/components/listing/listing-contact-section";
import type { DisplayCategory } from "@/components/listing/types";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  BreadcrumbSchema,
  ListingSchema,
} from "@/components/seo/listing-schema";
import { RelatedLinks } from "@/components/seo/related-links";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import { isFavoritesEnabled, isReviewsEnabled } from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getCategories, getCategoryIconsMap } from "@/data/categories";
import { listingToItem } from "@/data/item-service";
import {
  type Listing,
  getListingBySlug,
  getPublicListings,
} from "@/data/listings";
import { getListingAverageRating, getListingReviews } from "@/data/reviews";
import { getCategoryIconUrl } from "@/lib/image-urls";
import { constructMetadata } from "@/lib/metadata";
import { generateSlugFromListing } from "@/lib/slug-utils";
import { createServerClient } from "@/lib/supabase";
import type { Metadata } from "next";
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
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  try {
    const decodedSlug = decodeURIComponent(params.slug);
    console.log(
      "ListingPage: Attempting to load listing for slug:",
      params.slug,
      "Decoded:",
      decodedSlug,
    );

    let listing: Listing | null = null;
    try {
      listing = await getListingBySlug(decodedSlug);
    } catch (err) {
      console.error("ListingPage: getListingBySlug failed", err);
    }
    console.log("ListingPage: getListingBySlug completed");

    const session = await auth();
    console.log("ListingPage: auth completed");

    if (!listing) {
      console.error("ListingPage: Listing not found for slug:", params.slug);
      return (
        <div className="min-h-screen bg-[#0C1A2B] text-white flex items-center justify-center px-4">
          <div className="max-w-lg text-center space-y-4">
            <h1 className="text-3xl font-bold">We can’t find this listing</h1>
            <p className="text-sm text-slate-200">
              The profile might be unpublished or the slug changed. Try
              returning to the directory.
            </p>
            <a
              href="/directory"
              className="inline-flex items-center justify-center rounded-full bg-[#FF6B35] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#E55F2F]"
            >
              Back to Directory
            </a>
          </div>
        </div>
      );
    }

    // Handle UUID redirect - redirect to proper SEO-friendly URL
    if ("_needsRedirect" in listing && listing._needsRedirect) {
      const properSlug = generateSlugFromListing(listing);
      console.log("ListingPage: Redirecting UUID to proper slug:", properSlug);
      redirect(`/listing/${properSlug}`);
    }

    console.log("ListingPage: About to fetch categories and icons");
    const [categoryRecords, categoryIconMap] = await Promise.all([
      (async () => {
        try {
          return await getCategories();
        } catch (err) {
          console.error("ListingPage: getCategories failed", err);
          return [];
        }
      })(),
      (async () => {
        try {
          return await getCategoryIconsMap();
        } catch (err) {
          console.error("ListingPage: getCategoryIconsMap failed", err);
          return {};
        }
      })(),
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
    let categoryNames: Record<string, string> = {};
    try {
      categoryNames = await getCategoriesByIds(listing.categories || []);
    } catch (err) {
      console.error("ListingPage: getCategoriesByIds failed", err);
      categoryNames = {};
    }
    console.log("ListingPage: Category names by IDs fetched");

    // Display categories - handle both UUIDs and names
    const displayCategories: DisplayCategory[] = [];
    const seenCategoryNames = new Set<string>();
    for (const rawCategory of listing.categories || []) {
      const storedName = categoryNames[rawCategory];
      const readableName =
        !storedName && !isUuidLike(rawCategory)
          ? String(rawCategory)
          : storedName;

      if (!readableName) continue;

      const trimmedName = readableName.trim();
      if (!trimmedName) continue;

      const key = normalizeCategory(trimmedName);
      const displayName = categoryNameLookup.get(key) || trimmedName;
      const normalizedDisplayName = normalizeCategory(displayName);

      if (!normalizedDisplayName) {
        continue;
      }

      if (seenCategoryNames.has(normalizedDisplayName)) {
        continue;
      }

      seenCategoryNames.add(normalizedDisplayName);
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
      displayCategories.push({
        key: normalizedDisplayName,
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
    let recommendedItems: Awaited<ReturnType<typeof listingToItem>>[] = [];
    let related: Listing[] = [];
    let allPublicListingsForComparison: Listing[] = [];
    try {
      allPublicListingsForComparison = await getPublicListings({
        state: listing.state ?? undefined,
        category: listing.categories?.[0],
      });

      // Sort by Trust Score logic (simplified here as we don't have all ratings)
      // We prioritize Featured > Plan Tier > Trust Level
      const recommendedListings = allPublicListingsForComparison
        .filter((l) => l.id !== listing.id)
        .sort((a, b) => {
          // 1. Featured
          if (a.featured !== b.featured)
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);

          // 2. Plan Tier
          const getTierScore = (plan: string | null) => {
            const p = (plan || "free").toLowerCase();
            if (p.includes("premium")) return 3;
            if (p.includes("pro")) return 2;
            if (p.includes("standard")) return 1;
            return 0;
          };
          const tierA = getTierScore(a.plan);
          const tierB = getTierScore(b.plan);
          if (tierA !== tierB) return tierB - tierA;

          // 3. Trust Level
          const getTrustScore = (l: Listing) => {
            if ((l as any).trust_level === "background_checked") return 2;
            if ((l as any).trust_level === "verified") return 1;
            return 0;
          };
          return getTrustScore(b) - getTrustScore(a);
        })
        .slice(0, 6);

      recommendedItems = await Promise.all(
        recommendedListings.map((l) => listingToItem(l)),
      );
      related = recommendedListings.slice(0, 3);
    } catch (err) {
      console.warn("ListingPage: recommended listings fetch failed", err);
    }

    const showFavorite = isFavoritesEnabled() && !isOwner;
    const hasPremiumAccess = (listing.plan || "").toLowerCase() !== "free";
    const showUpgradePrompt = !hasPremiumAccess;
    const showClaimCallout =
      !listing.is_claimed && !isOwner && !listing.owner_id;
    const displayPrimaryCategory =
      displayCategories[0]?.displayName ||
      listing.categories?.[0] ||
      "Acting Professional";
    const locationLabel = [listing.city, listing.state]
      .filter(Boolean)
      .join(", ");
    const ageRanges = (listing.age_range || [])
      .map((age) => (age || "").trim())
      .filter((age) => {
        if (!age) return false;
        if (age.includes("Age Range")) return false;
        if (age.includes("los-angeles")) return false;
        if (age.includes("hybrid")) return false;
        const uuidLike =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return !uuidLike.test(age);
      });
    const services = Array.isArray(listing.tags)
      ? listing.tags.filter(Boolean)
      : [];
    let reviews: Awaited<ReturnType<typeof getListingReviews>> = [];
    if (reviewsEnabled) {
      try {
        reviews = await getListingReviews(listing.id);
      } catch (err) {
        console.error("ListingPage: getListingReviews failed", err);
        reviews = [];
      }
    }

    // Increment views_count if column exists (Phase 3 feature)
    try {
      const currentViews = (listing as any).views_count ?? 0;
      await createServerClient()
        .from("listings")
        .update({
          views_count: currentViews + 1,
          last_active_at: new Date().toISOString(),
        })
        .eq("id", listing.id);
    } catch (error) {
      // Silently ignore if columns don't exist yet
      console.warn(
        "ListingPage: views_count update skipped (column may not exist)",
      );
    }

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

    // Prepare data for canonical layout
    const regions = Array.isArray(listing.region) ? listing.region : [];

    return (
      <>
        <div className="pb-20 sm:pb-0">
          {/* Schema.org Structured Data for SEO */}
          <ListingSchema listing={listing} averageRating={averageRating} />
          <BreadcrumbSchema
            items={[
              { name: "Directory", url: `${siteConfig.url}/directory` },
              {
                name: displayPrimaryCategory,
                url: `${siteConfig.url}/directory?category=${encodeURIComponent(displayPrimaryCategory)}`,
              },
              {
                name: listing.listing_name || "Listing",
                url: `${siteConfig.url}/listing/${params.slug}`,
              },
            ]}
          />

          {/* Breadcrumb Navigation */}
          <div className="bg-[#0C1A2B] text-white py-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="text-xs text-slate-300">
                <Link href="/directory" className="hover:underline">
                  Directory
                </Link>
                {" / "}
                <Link
                  href={`/directory?category=${encodeURIComponent(displayPrimaryCategory)}`}
                  className="hover:underline"
                >
                  {displayPrimaryCategory}
                </Link>
                {" / "}
                <span className="text-slate-400">
                  {listing.listing_name || "Listing"}
                </span>
              </nav>
            </div>
          </div>

          {/* Canonical Listing Layout */}
          <ListingLayout
            listing={listing}
            slug={params.slug}
            category={displayPrimaryCategory}
            location={locationLabel}
            ageRanges={ageRanges}
            services={services}
            regions={regions}
            hasVirtualOption={hasVirtualOption}
            averageRating={averageRating}
          />

          {/* Additional Content: Reviews and Sidebar */}
          <div className="bg-bg-dark py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start">
                {/* Left column: Reviews */}
                {reviewsEnabled && (
                  <section
                    id="reviews"
                    className="bg-bg-panel/60 backdrop-blur-sm border border-white/5 rounded-xl p-6"
                  >
                    <h2 className="text-xl font-bold mb-4 text-text-primary">
                      Reviews from Parents
                    </h2>

                    {/* 17F: Review Gating Message */}
                    {averageRating.count === 0 && reviews.length === 0 && (
                      <div className="mb-4 p-4 bg-bg-dark-2 border border-border-subtle rounded-lg">
                        <p className="text-sm text-text-secondary mb-2">
                          This provider does not have reviews yet.
                        </p>
                        <p className="text-xs text-text-muted italic">
                          Profiles with reviews get 4× more contact requests.
                        </p>
                      </div>
                    )}

                    {reviews.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">★</span>
                          <span className="text-xl font-semibold text-text-primary">
                            {averageRating.average.toFixed(1)}
                          </span>
                          <span className="text-sm text-text-muted">
                            based on {averageRating.count} review
                            {averageRating.count === 1 ? "" : "s"}
                          </span>
                        </div>

                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="rounded-lg border border-white/10 p-4 bg-bg-dark-2"
                          >
                            <p className="text-sm leading-relaxed text-text-secondary">
                              {review.text}
                            </p>
                            <p className="mt-2 text-xs text-text-muted">
                              —{" "}
                              {review.user?.name ||
                                review.user?.email ||
                                "Anonymous"}
                              , {formatDate(review.created_at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6">
                      <RelatedLinks
                        listing={listing}
                        relatedListings={related}
                        categoryNames={Array.from(
                          new Set(
                            displayCategories.map((c) => c.displayName.trim()),
                          ),
                        )}
                      />
                    </div>
                  </section>
                )}

                {/* Right column: Sticky sidebar with Contact Info */}
                <aside className="lg:sticky lg:top-24">
                  {showFavorite && (
                    <div className="mb-6">
                      <FavoriteButton
                        listingId={listing.id}
                        listingName={listing.listing_name}
                        listingOwnerId={listing.owner_id}
                        size="default"
                        variant="outline"
                      />
                    </div>
                  )}
                  <ListingContactSection
                    listing={listing}
                    showClaimCallout={showClaimCallout}
                    showUpgradePrompt={showUpgradePrompt}
                  />
                </aside>
              </div>

              {/* ZONE 3: EXPLORATION - Related listings (full width, always last) */}
              <div className="mt-16 space-y-12">

                {/* 16C: Competitive Context for Free listings */}
                {(!listing.plan ||
                  listing.plan === "Free" ||
                  listing.plan === null) && (
                  <section className="pt-10 border-t border-white/10">
                    <p className="text-sm text-text-secondary mb-6">
                      Families typically contact 2–3 providers before deciding.
                    </p>
                    {/* 18G: The One Sentence */}
                    <p className="text-xs text-text-muted italic mb-4">
                      Providers with Pro features receive 3–5× more parent
                      contact.
                    </p>
                    <h2 className="text-xl font-bold mb-6 text-text-primary">
                      Similar providers families also viewed
                    </h2>
                    {allPublicListingsForComparison.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {allPublicListingsForComparison
                          .filter((l) => {
                            // Show only Standard/Pro listings with images, different from current
                            return (
                              l.id !== listing.id &&
                              l.plan &&
                              l.plan !== "Free" &&
                              l.profile_image
                            );
                          })
                          .slice(0, 2)
                          .map((itemListing) => (
                            <ListingCard
                              key={itemListing.id}
                              listing={itemListing}
                            />
                          ))}
                      </div>
                    ) : recommendedItems.length > 0 ? (
                      <ListingCarousel listings={recommendedItems.slice(0, 2)} />
                    ) : null}
                  </section>
                )}

                {/* Recommended Providers Module - for paid listings */}
                {listing.plan &&
                  listing.plan !== "Free" &&
                  listing.plan !== null &&
                  recommendedItems.length > 0 && (
                    <section className="pt-10 border-t border-white/10">
                      <h2 className="text-xl font-bold mb-6 text-text-primary">
                        Other Trusted Providers in {listing.state || "Your Area"}
                      </h2>
                      <ListingCarousel listings={recommendedItems} />
                    </section>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky contact bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-[#0C1A2B] px-4 py-2 sm:hidden">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <span className="text-xs text-slate-200">Ready to contact?</span>

            <ContactActions
              listingId={listing.id}
              website={listing.website}
              email={listing.email}
              variant="mobile"
              className="flex gap-2"
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    const err = error as { digest?: string };
    // Allow Next.js redirects to bubble up instead of being converted to 404
    if (err?.digest === "NEXT_REDIRECT") throw error;
    console.error("ListingPage: Error loading listing:", error);
    return (
      <div className="min-h-screen bg-[#0C1A2B] text-white flex items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="text-3xl font-bold">We’re loading this listing</h1>
          <p className="text-sm text-slate-200">
            Something went wrong while fetching this profile. Please refresh or
            try again in a moment.
          </p>
          <a
            href="/directory"
            className="inline-flex items-center justify-center rounded-full bg-[#FF6B35] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#E55F2F]"
          >
            Back to Directory
          </a>
        </div>
      </div>
    );
  }
}
