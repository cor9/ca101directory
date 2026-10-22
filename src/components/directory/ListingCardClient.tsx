"use client";

import { CategoryPlaceholder } from "@/components/listing/CategoryPlaceholder";
import { type CardData, classifyImage, itemToCardData } from "@/lib/card-data";
import { getListingImageUrl } from "@/lib/image-urls";
import { generateSlugFromItem } from "@/lib/slug-utils";
import { cn } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * THE listing card. Used for directory results, category results, related
 * vendors, Featured Professionals and search, so one vendor looks like the
 * same product everywhere.
 *
 * One image per card (never a collage). Photographs are shown edge-to-edge
 * (cropped, face-friendly position); logos, graphics, posters and small or
 * extreme-aspect images are contained on a neutral background so nothing is
 * cut off. Uploaded files are never modified.
 */
export function ListingCardView({
  card,
  className,
}: {
  card: CardData;
  className?: string;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<"photo" | "graphic">(
    card.imageIsLogo ? "graphic" : card.photoLed ? "photo" : "graphic",
  );
  const [portrait, setPortrait] = useState(true);

  const classify = (img: HTMLImageElement) => {
    const r = classifyImage(
      { width: img.naturalWidth, height: img.naturalHeight },
      { isLogo: card.imageIsLogo, photoLed: card.photoLed },
    );
    setKind(r.kind);
    setPortrait(r.portrait);
  };

  // Images that finished loading before hydration never fire onLoad
  useEffect(() => {
    const img = mediaRef.current?.querySelector("img");
    if (img?.complete && img.naturalWidth > 0) classify(img);
    // biome-ignore lint/correctness/useExhaustiveDependencies: classify is stable per card
  }, [card.imageUrl]);

  const badge =
    "rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide shadow";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white text-zinc-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl",
        card.featured ? "border-[#E4A72E]" : "border-zinc-200",
        className,
      )}
    >
      <Link
        href={card.href}
        target={card.external ? "_blank" : undefined}
        rel={card.external ? "noopener noreferrer" : undefined}
        aria-label={`View ${card.name}`}
        className="block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]"
      >
        <div
          ref={mediaRef}
          className="relative aspect-[5/4] w-full overflow-hidden bg-zinc-100"
        >
          {card.imageUrl ? (
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              onLoad={(e) => classify(e.currentTarget)}
              className={
                kind === "photo"
                  ? cn(
                      "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                      portrait ? "object-[50%_15%]" : "object-center",
                    )
                  : "object-contain p-6"
              }
            />
          ) : (
            <CategoryPlaceholder
              category={card.category}
              size="md"
              className="h-full w-full rounded-none"
            />
          )}

          {card.featured && (
            <div className="absolute left-3 top-3">
              <span
                title="Paid promotional placement"
                className={cn(badge, "bg-[#E4A72E] text-zinc-900")}
              >
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        {card.category && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#B8431F]">
            {card.category}
          </p>
        )}
        <h3 className="line-clamp-2 text-xl font-bold leading-snug text-zinc-900">
          {card.name}
        </h3>
        {(card.location || card.online) && (
          <p className="mt-1.5 text-[15px] text-zinc-600">
            {card.location}
            {card.location && card.online ? " · " : ""}
            {card.online ? "Online available" : ""}
          </p>
        )}

        {card.pills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {card.pills.map((p) => (
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
            href={card.href}
            target={card.external ? "_blank" : undefined}
            rel={card.external ? "noopener noreferrer" : undefined}
            className="inline-flex w-full items-center justify-center rounded-md border border-zinc-900 bg-zinc-900 px-4 py-3 text-[15px] font-semibold !text-white transition-colors hover:border-[#C2441F] hover:bg-[#C2441F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Directory item -> shared card (directory, category, related vendors). */
export default function ListingCardClient({ item }: { item: ItemInfo }) {
  const slug =
    item.slug?.current ||
    generateSlugFromItem({ name: item.name, _id: item._id });

  const ageRanges = (item.tags || [])
    .filter((t) => t?.name && /^\d+-\d+|^\d+\+|^under|^over/i.test(t.name))
    .map((t) => t.name);

  const iconRef = item.icon?.asset?._ref;
  const card = itemToCardData(
    item,
    slug,
    ageRanges,
    iconRef ? getListingImageUrl(iconRef) : null,
  );
  return <ListingCardView card={card} />;
}
