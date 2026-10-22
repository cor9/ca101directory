"use client";

import { parseGalleryItems } from "@/lib/gallery";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface GalleryProps {
  listing: {
    listing_name: string;
    gallery?: string | string[] | null;
    plan?: string | null;
    comped?: boolean | null;
  };
  /** Light surface (profile card) vs. dark surface */
  tone?: "light" | "dark";
}

export function Gallery({ listing, tone = "light" }: GalleryProps) {
  const items = parseGalleryItems(listing.gallery);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) =>
        i === null ? i : (i + dir + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIndex, close, step]);

  if (items.length === 0) return null;

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <h2
        className={
          tone === "light"
            ? "mb-4 text-xl font-bold text-zinc-900"
            : "mb-4 text-xl font-bold text-white"
        }
      >
        Portfolio
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={`${index}-${item.url}`}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`View portfolio image ${index + 1} of ${items.length} larger`}
            className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-lg bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]"
          >
            <Image
              src={item.url}
              alt={
                item.caption ||
                `${listing.listing_name} portfolio image ${index + 1}`
              }
              fill
              loading={index < 4 ? "eager" : "lazy"}
              sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 48vw"
              className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image viewer"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 cursor-default"
          />
          <button
            type="button"
            aria-label="Close viewer"
            onClick={close}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => step(-1)}
                className="absolute left-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => step(1)}
                className="absolute right-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
          <figure className="pointer-events-none relative z-0 flex max-h-full max-w-5xl flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.url}
              alt={`${listing.listing_name} portfolio image ${(openIndex ?? 0) + 1}`}
              className="max-h-[85vh] w-auto max-w-full rounded-md object-contain"
            />
            <figcaption className="mt-3 text-sm text-white/80">
              {active.caption ? `${active.caption} · ` : ""}
              {(openIndex ?? 0) + 1} / {items.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
