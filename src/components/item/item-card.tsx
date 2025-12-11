"use client";

import { generateSlugFromItem } from "@/lib/slug-utils";
import { getUniversalItemImage } from "@/lib/universal-image";
import { cn, getItemTargetLinkInWebsite } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import { ArrowRightIcon, AwardIcon, HashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type ItemCardProps = {
  item: ItemInfo;
};

/**
 * ItemCard shows item cover image with universal fallback handling
 */
export default function ItemCard({ item }: ItemCardProps) {
  const [imageResult, setImageResult] = useState<{
    src: string;
    alt: string;
    isFallback: boolean;
  } | null>(null);

  // Get universal image with proper fallbacks
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getUniversalItemImage(item);
        setImageResult(result);
      } catch (error) {
        console.error("Error fetching universal image:", error);
        // Fallback to generic icon
        setImageResult({
          src: "/api/placeholder/400/300",
          alt: `Generic icon for ${item.name}`,
          isFallback: true,
        });
      }
    };

    fetchImage();
  }, [item]);

  const itemUrlPrefix = "/item";
  const itemLink = getItemTargetLinkInWebsite(item);

  return (
    <article className="bg-[color:var(--cream)] text-[color:var(--cream-ink)] rounded-2xl border border-[color:var(--card-border)] shadow-[var(--shadow-cream)] overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-cream-lg)]">
      <div className="aspect-[16/9] bg-[#EDE6C8] relative">
        {imageResult && (
          <Image
            src={imageResult.src}
            alt={imageResult.alt}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg md:text-xl font-bold line-clamp-2">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-sm opacity-85 line-clamp-2">{item.description}</p>
        )}

        {item.categories && item.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.categories.slice(0, 3).map((c) => (
              <span
                key={c._id}
                className="rounded-full bg-[color:var(--chip-bg)] border border-[color:var(--card-border)] px-2 py-1 text-xs"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2 flex items-center gap-3">
          <Link
            href={`/listing/${item.slug?.current || generateSlugFromItem({ name: item.name, _id: item._id })}`}
            className="rounded-full bg-[color:var(--orange)] text-white px-4 py-2 text-sm hover:bg-[#e25403]"
          >
            View Listing →
          </Link>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--card-border)] px-3 py-2 text-sm hover:text-[color:var(--orange)]"
            >
              Website
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full aspect-[16/9]" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
