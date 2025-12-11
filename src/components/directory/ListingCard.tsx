import { getCategoryIconsMap } from "@/data/categories";
import { urlForIcon, urlForImage } from "@/lib/image";
import { getCategoryIconUrl, getListingImageUrl } from "@/lib/image-urls";
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

export default async function ListingCard({ item }: { item: ItemInfo }) {
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

  // Category icon fallback using Supabase-backed map, with filename fallbacks
  const firstCategory = item.categories?.[0]?.name || "";
  const normalize = (v: string) =>
    (v || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const iconMap = await getCategoryIconsMap();

  let categoryIconUrl = "";
  if (firstCategory) {
    // Try direct lookup first
    categoryIconUrl = iconMap[firstCategory] || "";

    // Try normalized lookup
    if (!categoryIconUrl) {
      const match = Object.entries(iconMap).find(
        ([name]) => normalize(name) === normalize(firstCategory),
      );
      if (match?.[1]) categoryIconUrl = match[1];
    }

    // If the map value is just a filename, build the full URL
    if (categoryIconUrl && !categoryIconUrl.startsWith("http")) {
      categoryIconUrl = getCategoryIconUrl(categoryIconUrl);
    }

    // Derive common filename patterns as fallback
    if (!categoryIconUrl) {
      const exactEncodedFilename = encodeURIComponent(`${firstCategory}.png`);
      categoryIconUrl = getCategoryIconUrl(exactEncodedFilename);
      if (!categoryIconUrl) {
        const derivedFilename = `${firstCategory
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "")}.png`;
        categoryIconUrl = getCategoryIconUrl(derivedFilename);
      }
    }
  }
  if (!categoryIconUrl) {
    categoryIconUrl = getCategoryIconUrl("clapperboard.png");
  }

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

  // Extract age ranges from tags
  const ageRanges = (item.tags || [])
    .filter((t) => t?.name && /^\d+-\d+|^\d+\+|^under|^over/i.test(t.name))
    .map((t) => t.name);

  const locationLabel = [(item as any).city, (item as any).state]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="bg-white rounded-xl p-5 shadow-md border hover:shadow-lg transition relative">
      {tier !== "free" && (
        <span className="absolute top-3 right-3 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white">
          {tier === "pro" || tier === "premium" ? "Pro" : "Standard"}
        </span>
      )}

      {/* Hero image / logo */}
      {heroImage && (
        <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-slate-100 relative">
          <Image
            src={heroImage}
            alt={`${item.name} logo`}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Name + badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-orange-600 mb-1">
            {firstCategory || "Featured Provider"}
          </p>
          <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-2">
            {item.name}
          </h3>
          {locationLabel ? (
            <p className="text-sm text-gray-600 mt-1">{locationLabel}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1">
          {is101Approved && (
            <span className="rounded-full bg-[#CC5A47] px-2 py-0.5 text-[11px] font-semibold text-white">
              101 Approved
            </span>
          )}
          {item.paid && (
            <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[11px] font-semibold text-white">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="mt-3 line-clamp-3 text-sm text-slate-700">
          {item.description}
        </p>
      )}

      {/* Age tags */}
      {ageRanges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {ageRanges.slice(0, 4).map((age) => (
            <span
              key={age}
              className="rounded-full bg-[#7AB8CC]/20 px-2 py-0.5 text-[11px] font-semibold text-slate-800"
            >
              {age}
            </span>
          ))}
        </div>
      )}

      {/* Secondary categories */}
      {item.categories && item.categories.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
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

      {/* CTAs */}
      <div className="mt-5 flex items-center gap-3">
        <Link
          href={`/listing/${slug}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          View Profile
        </Link>
        <Link
          href={`/listing/${slug}#contact`}
          className="inline-block text-orange-500 font-semibold hover:underline"
        >
          Contact →
        </Link>
      </div>
    </article>
  );
}
