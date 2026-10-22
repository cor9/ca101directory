"use client";

import { BadgeStack } from "@/components/badges/StatusBadge";
import { CategoryPlaceholder } from "@/components/listing/CategoryPlaceholder";
import { urlForIcon, urlForImage } from "@/lib/image";
import { getListingImageUrl } from "@/lib/image-urls";
import { isIndustryPro } from "@/lib/listings/listingType";
import { generateSlugFromItem } from "@/lib/slug-utils";
import { cn } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";

/**
 * Get initials from a name (first letter of first two words)
 */
function initialsFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

/**
 * Determine tier from item pricePlan
 */
function getTierFromItem(
  item: ItemInfo,
): "free" | "standard" | "pro" | "premium" {
  const plan = (item.pricePlan || "free").toLowerCase();
  if (plan.includes("pro") || plan.includes("premium")) return "pro";
  if (plan.includes("standard") || plan.includes("basic")) return "standard";
  return "free";
}

/**
 * Get tier-based border classes
 */
function tierClasses(tier: "free" | "standard" | "pro" | "premium"): string {
  switch (tier) {
    case "premium":
    case "pro":
      return "border-2 border-amber-400 shadow-lg";
    case "standard":
      return "border border-sky-400 shadow-md";
    case "free":
    default:
      return "border border-slate-200 shadow-sm";
  }
}

interface ListingCardClientProps {
  item: ItemInfo;
}

export default function ListingCardClient({ item }: ListingCardClientProps) {
  const imageProps = item?.image
    ? urlForImage(item.image)
    : item?.icon
      ? urlForIcon(item.icon)
      : null;

  // Prefer Supabase profile image URL when available
  const profileRef =
    (item as unknown as { icon?: unknown })?.icon &&
    typeof (item as unknown as { icon?: unknown }).icon === "object" &&
    ((item as unknown as { icon?: { asset?: { _ref?: string } } }).icon?.asset
      ? (item as unknown as { icon?: { asset?: { _ref?: string } } }).icon
          ?.asset?._ref
      : null);

  const resolvedSrc = profileRef
    ? getListingImageUrl(profileRef)
    : imageProps?.src || null;

  const heroImage = (item as any).logoUrl || resolvedSrc;

  // Check if 101 Approved (from tags)
  const is101Approved = Array.isArray(item.tags)
    ? item.tags.some(
        (t) =>
          (t?.name && String(t.name).toLowerCase().includes("101")) ||
          (t?.slug?.current &&
            String(t.slug.current).toLowerCase().includes("101")) ||
          (t?.name && String(t.name).toLowerCase().includes("approved")),
      )
    : false;

  // Extract tier and generate slug
  const tier = getTierFromItem(item);
  const industryPro = isIndustryPro(
    (item as any).listingType ?? (item as any).listing_type,
  );
  const slug =
    item.slug?.current ||
    generateSlugFromItem({ name: item.name, _id: item._id });
  const firstCategory = item.categories?.[0]?.name || "";

  // Extract age ranges from tags
  const ageRanges = (item.tags || [])
    .filter((t) => t?.name && /^\d+-\d+|^\d+\+|^under|^over/i.test(t.name))
    .map((t) => t.name);

  const locationLabel = [(item as any).city, (item as any).state]
    .filter(Boolean)
    .join(", ");

  // Normalize badge detection (handles missing/inconsistent fields)
  // Verified: Check paid status or trust_level from original listing data
  const isVerified = Boolean(
    item.paid ||
      (item as any).trust_level === "verified" ||
      (item as any).trust_level === "background_checked" ||
      (item as any).trust_level === "verified_safe" ||
      (item as any).is_verified,
  );

  // Featured: Check featured field or use pricePlan as proxy
  // Note: listingToItem hardcodes featured: false, so we check pricePlan for Pro/Premium
  const isFeatured = Boolean(
    item.featured ||
      (item as any).is_featured ||
      tier === "pro" ||
      tier === "premium",
  );

  // Pro: Check pricePlan for pro/premium tiers
  const isPro =
    typeof item.pricePlan === "string" &&
    (item.pricePlan.toLowerCase().includes("pro") ||
      item.pricePlan.toLowerCase().includes("premium"));

  // INDUSTRY_PRO should not show monetization badges (Pro/Featured)
  const showPaidBadges = !industryPro;

  // Determine max badges based on tier
  const getMaxBadges = (): number => {
    if (tier === "pro" || tier === "premium") return 2; // Max 2 badges (Verified + Pro)
    if (tier === "standard") return 2;
    return 1; // Free: max 1 badge
  };

  const maxBadges = getMaxBadges();

  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-[#E6DFC3] bg-[#FFFDD0] p-5 text-[#1F2327] shadow-sm transition hover:border-[#E4572E]/60 hover:shadow-lg">
      {/* Hero block: one fixed ratio so every card lines up, image never cropped */}
      <div className="relative mb-4 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-[#E6DFC3] bg-[#FAFAF4]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${item.name} logo`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-3"
          />
        ) : (
          <CategoryPlaceholder
            category={firstCategory}
            size="md"
            className="h-full w-full rounded-xl"
          />
        )}
      </div>

      {/* Badge row (never overlays image) */}
      {(isVerified || (showPaidBadges && (isFeatured || isPro))) && (
        <div className="mb-3 flex flex-wrap gap-2">
          <BadgeStack
            verified={isVerified}
            featured={showPaidBadges ? isFeatured : false}
            pro={showPaidBadges ? isPro : false}
            maxBadges={maxBadges}
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-sm font-semibold text-[#CC4E2A]">
            {firstCategory || "Featured Provider"}
          </p>
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[#0D1B2A]">
            {item.name}
          </h3>
          {locationLabel ? (
            <p className="mt-1 text-sm text-[#4A4F57]">{locationLabel}</p>
          ) : null}
        </div>

        {is101Approved && (
          <span className="shrink-0 rounded-full bg-[#CC5A47] px-2.5 py-0.5 text-xs font-semibold text-white">
            101 Approved
          </span>
        )}
      </div>

      {item.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#33383F]">
          {item.description}
        </p>
      )}

      {/* Service Modality Pill */}
      {(item as any).serviceModality &&
        (item as any).serviceModality !== "unknown" && (
          <div className="mt-3">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                (item as any).serviceModality === "virtual" &&
                  "bg-emerald-100 text-emerald-800",
                (item as any).serviceModality === "in_person" &&
                  "bg-[#3A76A6]/15 text-[#2E5E85]",
                (item as any).serviceModality === "hybrid" &&
                  "bg-purple-100 text-purple-800",
              )}
            >
              {(item as any).serviceModality === "virtual" && "Virtual"}
              {(item as any).serviceModality === "in_person" && "In-Person"}
              {(item as any).serviceModality === "hybrid" && "Hybrid"}
            </span>
          </div>
        )}

      {ageRanges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {ageRanges.slice(0, 4).map((age) => (
            <span
              key={age}
              className="rounded-full bg-[#3A76A6]/15 px-2.5 py-0.5 text-xs font-semibold text-[#2E5E85]"
            >
              {age}
            </span>
          ))}
        </div>
      )}

      {item.categories && item.categories.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.categories.slice(1, 4).map((c) => (
            <span
              key={c._id}
              className="rounded-full bg-[#F7F1D8] px-2.5 py-0.5 text-xs font-medium text-[#4A4F57]"
            >
              {c.name}
            </span>
          ))}
          {item.categories.length > 4 && (
            <span className="rounded-full bg-[#F7F1D8] px-2.5 py-0.5 text-xs font-medium text-[#4A4F57]">
              +{item.categories.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* mt-auto pins the button to the bottom edge of every card, never clipped */}
      <div className="mt-auto pt-5">
        <Link
          href={`/listing/${slug}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-[#E4572E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#CC4E2A]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
