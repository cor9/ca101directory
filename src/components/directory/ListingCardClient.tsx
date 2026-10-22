"use client";

import { CategoryPlaceholder } from "@/components/listing/CategoryPlaceholder";
import { urlForIcon, urlForImage } from "@/lib/image";
import { getListingImageUrl } from "@/lib/image-urls";
import { isIndustryPro } from "@/lib/listings/listingType";
import { dedupeLabels } from "@/lib/labels";
import { generateSlugFromItem } from "@/lib/slug-utils";
import type { ItemInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";

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

interface ListingCardClientProps {
  item: ItemInfo;
}

export default function ListingCardClient({ item }: ListingCardClientProps) {
  const imageProps = item?.image
    ? urlForImage(item.image)
    : item?.icon
      ? urlForIcon(item.icon)
      : null;

  const iconRef = item?.icon?.asset?._ref;
  const profileSrc =
    item.profileImageUrl ||
    (iconRef ? getListingImageUrl(iconRef) : null) ||
    imageProps?.src ||
    null;
  const logoSrc = item.logoUrl || null;
  const gallery = (item.galleryUrls || []).filter(Boolean);

  const tier = getTierFromItem(item);
  const industryPro = isIndustryPro(item.listingType);
  const slug =
    item.slug?.current ||
    generateSlugFromItem({ name: item.name, _id: item._id });
  const firstCategory = item.categories?.[0]?.name || "";

  const is101Approved = Array.isArray(item.tags)
    ? item.tags.some(
        (t) =>
          (t?.name && String(t.name).toLowerCase().includes("101")) ||
          (t?.slug?.current &&
            String(t.slug.current).toLowerCase().includes("101")) ||
          (t?.name && String(t.name).toLowerCase().includes("approved")),
      )
    : false;

  const ageRanges = (item.tags || [])
    .filter((t) => t?.name && /^\d+-\d+|^\d+\+|^under|^over/i.test(t.name))
    .map((t) => t.name);

  const online =
    item.serviceModality === "virtual" || item.serviceModality === "hybrid";
  const locationLabel = [item.city, item.state].filter(Boolean).join(", ");

  // Paid placement badge: Featured wins over Pro; INDUSTRY_PRO never shows paid badges
  const isFeatured = Boolean(item.featured) && !industryPro;
  const isPro = (tier === "pro" || tier === "premium") && !industryPro;

  // 2-3 pills: specialties first, then ages, then other categories
  const pills = dedupeLabels(
    [
      ...(item.specialties || []),
      ...ageRanges,
      ...(item.categories || []).slice(1).map((c) => c.name),
    ],
    [firstCategory],
  ).slice(0, 3);

  // Photography-led layouts: portfolio strip (with avatar) > single full-bleed photo
  const strip = gallery.length >= 2 ? gallery.slice(0, 3) : null;
  const photoLed =
    Boolean(strip) ||
    gallery.length === 1 ||
    /photograph|headshot|portrait|video|reel/i.test(firstCategory);
  const singleSrc = gallery[0] || profileSrc || logoSrc;
  const showAvatar = Boolean(strip && profileSrc);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      {/* Media: edge-to-edge photography, faces anchored to the top */}
      <Link
        href={`/listing/${slug}`}
        aria-label={`View ${item.name}`}
        className="relative block aspect-[5/4] w-full shrink-0 overflow-hidden bg-zinc-100"
      >
        {strip ? (
          <div
            className={`grid h-full w-full gap-px bg-white ${strip.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
          >
            {strip.map((src, i) => (
              <div
                key={`${i}-${src}`}
                className="relative h-full overflow-hidden"
              >
                <Image
                  src={src}
                  alt={i === 0 ? `${item.name} portfolio preview` : ""}
                  fill
                  sizes="(min-width: 1280px) 9vw, (min-width: 1024px) 11vw, (min-width: 640px) 17vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : singleSrc ? (
          <Image
            src={singleSrc}
            alt={`${item.name}`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={
              photoLed
                ? "object-cover object-top transition-transform duration-500 group-hover:scale-105"
                : "object-contain p-6"
            }
          />
        ) : (
          <CategoryPlaceholder
            category={firstCategory}
            size="md"
            className="h-full w-full rounded-none"
          />
        )}

        {(isFeatured || isPro || is101Approved) && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {isFeatured && (
              <span
                title="Paid featured placement"
                className="rounded-full bg-[#E4A72E] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-zinc-900 shadow"
              >
                Featured
              </span>
            )}
            {!isFeatured && isPro && (
              <span
                title="Pro subscription (a paid plan)"
                className="rounded-full bg-zinc-900/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow"
              >
                Pro
              </span>
            )}
            {is101Approved && (
              <span
                title="Awarded by Child Actor 101 after an application review"
                className="rounded-full bg-[#CC5A47] px-2.5 py-1 text-xs font-bold text-white shadow"
              >
                101 Approved
              </span>
            )}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-6 pb-6">
        {showAvatar && (
          <div className="relative -mt-10 mb-3 h-20 w-20 shrink-0 overflow-hidden rounded-full bg-zinc-100 ring-4 ring-white shadow-md">
            <Image
              src={profileSrc as string}
              alt=""
              fill
              sizes="80px"
              className="object-cover object-top"
            />
          </div>
        )}

        <div className={showAvatar ? "" : "pt-4"}>
          {firstCategory && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#B8431F]">
              {firstCategory}
            </p>
          )}
          <h3 className="line-clamp-2 text-xl font-bold leading-snug text-zinc-900">
            {item.name}
          </h3>
          {(locationLabel || online) && (
            <p className="mt-1.5 text-[15px] text-zinc-600">
              {locationLabel}
              {locationLabel && online ? " · " : ""}
              {online ? "Online available" : ""}
            </p>
          )}
        </div>

        {pills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pills.map((p) => (
              <span
                key={p}
                className="rounded-full bg-zinc-100 px-3 py-1 text-[13px] font-medium text-zinc-700"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* mt-auto pins the action to the bottom edge of every card */}
        <div className="mt-auto pt-5">
          <Link
            href={`/listing/${slug}`}
            className="inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-3 text-[15px] font-semibold !text-white transition-colors hover:bg-[#C2441F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}
