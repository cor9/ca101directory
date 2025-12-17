"use client";

import { BadgeStack } from "@/components/badges/StatusBadge";
import { urlForIcon, urlForImage } from "@/lib/image";
import { getListingImageUrl } from "@/lib/image-urls";
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

  // Determine max badges based on tier
  const getMaxBadges = (): number => {
    if (tier === "pro" || tier === "premium") return 2; // Max 2 badges (Verified + Pro)
    if (tier === "standard") return 2;
    return 1; // Free: max 1 badge
  };

  const maxBadges = getMaxBadges();

  return (
    <article className="bg-bg-2 rounded-xl p-5 shadow-card border border-border-subtle hover:shadow-cardHover transition relative">
      {heroImage && (
        <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-bg-3 relative">
          <Image
            src={heroImage}
            alt={`${item.name} logo`}
            fill
            className="object-cover"
          />

          {/* Badges Overlay - Top-left placement */}
          <div className="absolute left-3 top-3 flex gap-2">
            <BadgeStack
              verified={isVerified}
              featured={isFeatured}
              pro={isPro}
              maxBadges={maxBadges}
            />
          </div>
        </div>
      )}

      {/* Badges for listings without images (shown in content area) */}
      {!heroImage && (isVerified || isFeatured || isPro) && (
        <div className="mb-3">
          <BadgeStack
            verified={isVerified}
            featured={isFeatured}
            pro={isPro}
            maxBadges={maxBadges}
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-orange-600 mb-1">
            {firstCategory || "Featured Provider"}
          </p>
          <h3 className="font-bold text-text-primary text-lg leading-tight line-clamp-2">
            {item.name}
          </h3>
          {locationLabel ? (
            <p className="text-sm text-text-muted mt-1">{locationLabel}</p>
          ) : null}
        </div>

        {/* Legacy 101 Approved badge - keep for now but will be replaced by BadgeStack */}
        {is101Approved && (
          <div className="flex flex-wrap gap-1">
            <span className="rounded-full bg-[#CC5A47] px-2 py-0.5 text-[11px] font-semibold text-white">
              101 Approved
            </span>
          </div>
        )}
      </div>

      {item.description && (
        <p className="mt-3 line-clamp-3 text-sm text-text-secondary leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Service Modality Pill */}
      {(item as any).serviceModality && (item as any).serviceModality !== 'unknown' && (
        <div className="mt-3">
          <span className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            (item as any).serviceModality === 'virtual' && "bg-emerald-100 text-emerald-700",
            (item as any).serviceModality === 'in_person' && "bg-blue-100 text-blue-700",
            (item as any).serviceModality === 'hybrid' && "bg-purple-100 text-purple-700"
          )}>
            {(item as any).serviceModality === 'virtual' && "Virtual"}
            {(item as any).serviceModality === 'in_person' && "In-Person"}
            {(item as any).serviceModality === 'hybrid' && "Hybrid"}
          </span>
        </div>
      )}

      {ageRanges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {ageRanges.slice(0, 4).map((age) => (
            <span
              key={age}
              className="rounded-full bg-accent-aqua/20 px-2 py-0.5 text-[11px] font-semibold text-text-secondary"
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
              className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-text-secondary"
            >
              {c.name}
            </span>
          ))}
          {item.categories.length > 4 && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-text-muted">
              +{item.categories.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <Link
          href={`/listing/${slug}`}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-medium bg-accent-blue text-white hover:opacity-90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
