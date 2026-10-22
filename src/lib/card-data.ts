import type { Listing } from "@/data/listings";
import {
  primariesForListing,
  primaryCategoryOf,
  specialtiesForListing,
} from "@/lib/category-taxonomy";
import { parseGalleryItems } from "@/lib/gallery";
import { getListingImageUrl } from "@/lib/image-urls";
import { dedupeLabels } from "@/lib/labels";
import { isUuid } from "@/lib/directory-search";
import { normalizeListingTier } from "@/lib/listingCapabilities";
import { generateSlugFromListing } from "@/lib/slug-utils";
import type { ItemInfo } from "@/types";

/**
 * Everything a listing card needs, in one plain (serializable) shape, so the
 * directory, category pages, related vendors, Featured Professionals and search
 * all render the same card for the same vendor.
 */
export type CardData = {
  id: string;
  name: string;
  href: string;
  external?: boolean;
  category: string;
  location: string;
  online: boolean;
  /** ONE image per card; null -> category placeholder */
  imageUrl: string | null;
  /** Source is a logo/graphic: always shown contained, never cropped */
  imageIsLogo: boolean;
  /** Category suggests photography (photographers, headshots, ...) */
  photoLed: boolean;
  pills: string[];
  /** Paid promotional placement. The only public badge on cards. */
  featured: boolean;
};

const PHOTO_CATEGORY = /photograph|headshot|portrait|video|reel/i;
const GRAPHIC_FILENAME =
  /\.svg(\?|$)|logo|banner|poster|flyer|graphic|wordmark/i;

export function isPhotoCategory(category: string): boolean {
  return PHOTO_CATEGORY.test(category);
}

/**
 * Choose the single card image.
 *   1. primary/cover image (profile_image)
 *   2. first gallery image (gallery is a Pro entitlement, so only for Pro)
 *   3. logo_url (shown contained)
 *   4. none -> placeholder
 * Never combines images.
 */
export function pickCardImage(src: {
  profileImageUrl?: string | null;
  galleryUrls?: string[] | null;
  logoUrl?: string | null;
  isPro: boolean;
}): { url: string | null; isLogo: boolean } {
  const profile = src.profileImageUrl?.trim();
  if (profile) return { url: profile, isLogo: GRAPHIC_FILENAME.test(profile) };
  const firstGallery = src.isPro
    ? (src.galleryUrls || []).find((u) => u?.trim())
    : undefined;
  if (firstGallery) return { url: firstGallery, isLogo: false };
  const logo = src.logoUrl?.trim();
  if (logo) return { url: logo, isLogo: true };
  return { url: null, isLogo: false };
}

/**
 * Decide, once the image's real size is known, whether to crop (photograph)
 * or contain (logo / graphic / poster / small or extreme-aspect image).
 */
export function classifyImage(
  natural: { width: number; height: number },
  hint: { isLogo: boolean; photoLed: boolean },
): { kind: "photo" | "graphic"; portrait: boolean } {
  const { width: w, height: h } = natural;
  const portrait = h >= w;
  if (hint.isLogo) return { kind: "graphic", portrait };
  if (!w || !h) return { kind: hint.photoLed ? "photo" : "graphic", portrait };
  const ratio = w / h;
  const extreme = ratio > 2.2 || ratio < 0.5;
  if (extreme) return { kind: "graphic", portrait };
  if (hint.photoLed) return { kind: "photo", portrait };
  // Other vendors: only treat as a photograph when it is clearly a real photo
  const photoSized = Math.min(w, h) >= 600;
  return { kind: photoSized ? "photo" : "graphic", portrait };
}

const resolveCategories = (
  raw: ReadonlyArray<unknown> | null | undefined,
  names?: Map<string, string>,
): string[] =>
  (raw || [])
    .filter((c): c is string => typeof c === "string")
    .map((c) =>
      isUuid(c as unknown) ? names?.get(c.toLowerCase()) || "" : c.trim(),
    )
    .filter(Boolean);

const tags = (
  category: string,
  specialties: ReadonlyArray<string | null | undefined> | null | undefined,
  ages: ReadonlyArray<string> | null | undefined,
  moreCategories: string[],
) =>
  dedupeLabels(
    [...(specialties || []), ...(ages || []), ...moreCategories],
    [category],
  ).slice(0, 2);

const isProPlan = (plan?: string | null, comped?: boolean | null) => {
  const t = normalizeListingTier(plan ?? null, comped);
  return t === "pro" || t === "premium";
};

/** Raw Supabase listing -> card (homepage Featured, Featured block, search). */
export function listingToCardData(
  listing: Listing,
  categoryNames?: Map<string, string>,
): CardData {
  const cats = resolveCategories(listing.categories, categoryNames);
  // Same rule as directory cards: the taxonomy's primary category first, then
  // (only if the listing maps to none) whatever legacy value it is filed under.
  const primaries = primariesForListing(listing).map((p) => p.name);
  const category = primaries[0] || cats[0] || "";
  const pro = isProPlan(listing.plan, listing.comped);
  const industryPro = listing.listing_type === "INDUSTRY_PRO";
  const img = pickCardImage({
    profileImageUrl: listing.profile_image
      ? getListingImageUrl(listing.profile_image)
      : null,
    galleryUrls: parseGalleryItems(listing.gallery)
      .slice(0, 1)
      .map((g) => g.url),
    logoUrl: listing.logo_url ? getListingImageUrl(listing.logo_url) : null,
    isPro: pro,
  });
  const slug = listing.slug || generateSlugFromListing(listing);
  return {
    id: listing.id,
    name: listing.listing_name || "Untitled Listing",
    href: `/listing/${slug}`,
    category,
    location: [listing.city, listing.state].filter(Boolean).join(", "),
    online:
      listing.service_modality === "virtual" ||
      listing.service_modality === "hybrid",
    imageUrl: img.url,
    imageIsLogo: img.isLogo,
    photoLed: isPhotoCategory(category),
    pills: tags(
      category,
      specialtiesForListing(listing, primaryCategoryOf(listing)?.slug),
      listing.age_range,
      cats.slice(1),
    ),
    featured: Boolean(listing.featured) && !industryPro,
  };
}

/** Directory item (ItemInfo) -> card (directory, category, related). */
export function itemToCardData(
  item: ItemInfo,
  slug: string,
  ageRanges: string[],
  iconRefUrl?: string | null,
): CardData {
  const plan = (item.pricePlan || "free").toLowerCase();
  const pro = plan.includes("pro") || plan.includes("premium");
  const industryPro = item.listingType === "INDUSTRY_PRO";
  const category = item.categories?.[0]?.name || "";
  const img = pickCardImage({
    profileImageUrl: item.profileImageUrl || iconRefUrl || null,
    galleryUrls: item.galleryUrls,
    logoUrl: item.logoUrl,
    isPro: pro,
  });
  return {
    id: item._id,
    name: item.name,
    href: `/listing/${slug}`,
    category,
    location: [item.city, item.state].filter(Boolean).join(", "),
    online:
      item.serviceModality === "virtual" || item.serviceModality === "hybrid",
    imageUrl: img.url,
    imageIsLogo: img.isLogo,
    photoLed: isPhotoCategory(category),
    pills: tags(
      category,
      item.specialties,
      ageRanges,
      (item.categories || []).slice(1).map((c) => c.name),
    ),
    featured: Boolean(item.featured) && !industryPro,
  };
}
