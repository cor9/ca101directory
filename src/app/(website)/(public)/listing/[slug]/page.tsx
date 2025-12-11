import { getCategoriesByIds } from "@/actions/categories";
import { auth } from "@/auth";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ContactActions } from "@/components/listing/contact-actions";
import { Gallery } from "@/components/listing/gallery";
import { ListingContactSection } from "@/components/listing/listing-contact-section";
import type { DisplayCategory } from "@/components/listing/types";
import {
  BreadcrumbSchema,
  ListingSchema,
} from "@/components/seo/listing-schema";
import { RelatedLinks } from "@/components/seo/related-links";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import { isFavoritesEnabled, isReviewsEnabled } from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getCategories, getCategoryIconsMap } from "@/data/categories";
import {
  type Listing,
  getListingBySlug,
  getPublicListings,
} from "@/data/listings";
import { getListingAverageRating, getListingReviews } from "@/data/reviews";
import { getCategoryIconUrl, getListingImageUrl } from "@/lib/image-urls";
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
  const initialsFromName = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "CA";

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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
    // Temporarily disable related listings fetch to debug hanging issue
    // const relatedListings = await getPublicListings();
    const relatedListings: Listing[] = [];
    console.log("ListingPage: Public listings fetch skipped (debugging)");
    const relatedPrimaryCategory = listing.categories?.[0];
    const related = relatedListings
      .filter(
        (l) =>
          l.id !== listing.id &&
          l.status === "Live" &&
          l.is_active &&
          l.categories?.includes(relatedPrimaryCategory || ""),
      )
      .slice(0, 3);

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
    const heroImageUrl = listing.profile_image
      ? getListingImageUrl(listing.profile_image)
      : (listing as any).hero_image_url || (listing as any).logo_url || null;
    const isVerified =
      listing.verification_status?.toLowerCase() === "verified" ||
      (listing as any).is_verified === true;
    const is101Approved =
      listing.badge_approved === true || listing.is_approved_101 === true;
    const reviews = reviewsEnabled ? await getListingReviews(listing.id) : [];

    try {
      await createServerClient()
        .from("listings")
        .update({
          views_count: (listing.views_count ?? 0) + 1,
          last_active_at: new Date().toISOString(),
        })
        .eq("id", listing.id);
    } catch (error) {
      console.error("ListingPage: Error updating view analytics", error);
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

          <div className="bg-[#0C1A2B] text-white py-10 pb-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="text-xs text-slate-300 mb-4">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1 flex justify-center md:justify-start">
                  {heroImageUrl ? (
                    <img
                      src={heroImageUrl}
                      alt={listing.listing_name || "Listing image"}
                      className="w-full rounded-xl shadow-lg object-cover max-h-64"
                    />
                  ) : (
                    <div className="h-40 w-40 flex items-center justify-center rounded-full bg-[#CC5A47] text-white text-3xl font-bold shadow-lg">
                      {initialsFromName(listing.listing_name || "Listing")}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <h1 className="text-3xl font-bold mb-2">
                    {listing.listing_name || "Listing"}
                  </h1>

                  <p className="text-sm text-slate-200">
                    {displayPrimaryCategory}
                    {locationLabel ? ` • ${locationLabel}` : ""}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {isVerified && (
                      <span className="px-3 py-1 rounded-full bg-sky-600 text-xs font-semibold">
                        Verified
                      </span>
                    )}

                    {is101Approved && (
                      <span className="px-3 py-1 rounded-full bg-[#CC5A47] text-xs font-semibold text-white">
                        101 Approved
                      </span>
                    )}

                    {averageRating.count > 0 && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFFBEA] text-xs font-semibold text-slate-900">
                        ★ {averageRating.average.toFixed(1)} (
                        {averageRating.count})
                      </span>
                    )}
                  </div>

                  <ContactActions
                    listingId={listing.id}
                    website={listing.website}
                    email={listing.email}
                    className="mt-6"
                  />

                  {showFavorite && (
                    <div className="mt-4">
                      <FavoriteButton
                        listingId={listing.id}
                        listingName={listing.listing_name}
                        listingOwnerId={listing.owner_id}
                        size="default"
                        variant="outline"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFBEA] text-slate-900 py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <section>
                <h2 className="text-xl font-bold mb-3">About</h2>
                {listing.what_you_offer || listing.description ? (
                  <RichTextDisplay
                    content={
                      listing.what_you_offer || listing.description || ""
                    }
                    className="text-sm leading-relaxed text-slate-800"
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-slate-800">
                    No description provided yet.
                  </p>
                )}
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <dt className="font-semibold">Category</dt>
                    <dd>{displayPrimaryCategory}</dd>
                    <dd>{displayPrimaryCategory}</dd>
                  </div>

                  <div>
                    <dt className="font-semibold">Location</dt>
                    <dd>{locationLabel || "—"}</dd>
                  </div>

                  <div>
                    <dt className="font-semibold">Ages Served</dt>
                    <dd className="flex flex-wrap gap-2">
                      {ageRanges.length > 0 ? (
                        ageRanges.map((age) => (
                          <span
                            key={age}
                            className="px-2 py-0.5 rounded-full bg-[#7AB8CC1A]"
                          >
                            {age}
                          </span>
                        ))
                      ) : (
                        <span>—</span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold">Services</dt>
                    <dd>{services.length > 0 ? services.join(", ") : "—"}</dd>
                  </div>
                </dl>
              </section>

              {reviewsEnabled && (
                <section id="reviews">
                  <h2 className="text-xl font-bold mb-4">
                    Reviews from Parents
                  </h2>

                  {averageRating.count === 0 && reviews.length === 0 && (
                    <p className="text-sm text-slate-700">
                      This provider does not have reviews yet.
                    </p>
                  )}

                  {reviews.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">★</span>
                        <span className="text-xl font-semibold">
                          {averageRating.average.toFixed(1)}
                        </span>
                        <span className="text-sm text-slate-600">
                          based on {averageRating.count} review
                          {averageRating.count === 1 ? "" : "s"}
                        </span>
                      </div>

                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="rounded-lg border border-slate-300 p-4 bg-white shadow-sm"
                        >
                          <p className="text-sm leading-relaxed text-slate-800">
                            {review.text}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
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

              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Gallery listing={listing} />
                </div>
                <div>
                  <ListingContactSection
                    listing={listing}
                    showClaimCallout={showClaimCallout}
                    showUpgradePrompt={showUpgradePrompt}
                  />
                </div>
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
    return notFound();
  }
}
