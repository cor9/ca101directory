"use client";

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
function getTierFromItem(item: ItemInfo): "free" | "standard" | "pro" | "premium" {
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
  const slug = item.slug?.current || generateSlugFromItem({ name: item.name, _id: item._id });
  const firstCategory = item.categories?.[0]?.name || "";

  // Extract age ranges from tags
  const ageRanges = (item.tags || [])
    .filter((t) => t?.name && /^\d+-\d+|^\d+\+|^under|^over/i.test(t.name))
    .map((t) => t.name);

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-xl bg-[#FFFBEA] p-4 sm:p-5 transition-shadow hover:shadow-xl",
        tierClasses(tier)
      )}
    >
      {/* Logo / Initials */}
      <div className="flex items-start gap-4">
        {resolvedSrc ? (
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-[#EDE6C8]">
            <Image
              src={resolvedSrc}
              alt={item.image?.alt || item.name}
              fill
              className="object-contain p-1"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#CC5A47] text-white text-xl font-bold">
            {initialsFromName(item.name)}
          </div>
        )}

        {/* Name + Badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 line-clamp-2 text-base leading-tight">
              {item.name}
            </h3>
            <div className="flex gap-1 flex-shrink-0">
              {tier === "pro" && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white whitespace-nowrap">
                  Pro
                </span>
              )}
              {tier === "standard" && (
                <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-semibold text-white whitespace-nowrap">
                  Standard
                </span>
              )}
            </div>
          </div>

          {/* Badges row */}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {is101Approved && (
              <span className="rounded-full bg-[#CC5A47] px-2 py-0.5 text-[10px] font-semibold text-white">
                101 Approved
              </span>
            )}
            {item.paid && (
              <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category + Location */}
      <p className="mt-3 text-xs text-slate-700">
        {firstCategory}
      </p>

      {/* Description */}
      {item.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-800">
          {item.description}
        </p>
      )}

      {/* Categories as services */}
      {item.categories && item.categories.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.categories.slice(1, 4).map((c) => (
            <span
              key={c._id}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
            >
              {c.name}
            </span>
          ))}
          {item.categories.length > 4 && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              +{item.categories.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Age Range Tags */}
      {ageRanges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {ageRanges.slice(0, 4).map((age) => (
            <span
              key={age}
              className="rounded-full bg-[#7AB8CC]/20 px-2 py-0.5 text-[11px] font-medium text-slate-800"
            >
              {age}
            </span>
          ))}
        </div>
      )}

      {/* CTAs */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
        <Link
          href={`/listing/${slug}`}
          className="text-xs font-semibold text-slate-700 underline-offset-2 hover:underline"
        >
          View Profile
        </Link>
        <Link
          href={`/listing/${slug}#contact`}
          className="rounded-full bg-[#FF6B35] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#E55F2F] transition-colors"
        >
          Contact
        </Link>
      </div>
    </article>
  );
}

