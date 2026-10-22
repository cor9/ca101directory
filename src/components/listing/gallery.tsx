"use client";

import { parseGalleryItems } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const navBtn = (extra: string) =>
  cn(
    "shrink-0 items-center justify-center self-center rounded-full border border-white/15 bg-white/10 p-3 text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
    extra.includes("hidden") ? extra : `flex ${extra}`,
  );

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

/**
 * Portfolio gallery.
 * - Grid: CSS-column masonry. Every photo is shown at its natural aspect
 *   ratio (no forced crop), so portrait, landscape and square images sit
 *   together without losing faces or composition.
 * - Lightbox: shows the complete original (object-contain, never cropped).
 * Images are only ever displayed; the uploaded files are never modified.
 */
export function Gallery({ listing, tone = "light" }: GalleryProps) {
  const items = parseGalleryItems(listing.gallery);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const justSwiped = useRef(false);

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
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        // Focus stays inside the viewer
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>("[data-lightbox] button"),
        ).filter((el) => el.offsetParent !== null); // skip breakpoint-hidden controls
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const prevOverscroll = document.body.style.overscrollBehaviorX;
    document.body.style.overscrollBehaviorX = "none";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehaviorX = prevOverscroll;
    };
  }, [openIndex === null, close, step]); // re-run only on open/close

  // Return focus to the thumbnail that opened the viewer
  useEffect(() => {
    if (openIndex === null && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [openIndex]);

  // Warm the neighbours so next/prev is instant
  useEffect(() => {
    if (openIndex === null) return;
    for (const d of [1, -1]) {
      const n = items[(openIndex + d + items.length) % items.length];
      if (n) new window.Image().src = n.url;
    }
  }, [openIndex, items]);

  if (items.length === 0) return null;

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <h2
        className={
          tone === "light"
            ? "mb-6 text-2xl font-bold text-zinc-900"
            : "mb-6 text-2xl font-bold text-white"
        }
      >
        Portfolio
      </h2>

      <div className="columns-2 gap-3 md:columns-3 md:gap-4">
        {items.map((item, index) => (
          <button
            key={`${index}-${item.url}`}
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setOpenIndex(index);
            }}
            aria-label={`View portfolio image ${index + 1} of ${items.length} full size`}
            className="group relative mb-3 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-lg bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 md:mb-4"
          >
            {/* Natural aspect ratio: width fills the column, height follows the photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={
                item.caption ||
                `${listing.listing_name} portfolio image ${index + 1}`
              }
              loading={index < 6 ? "eager" : "lazy"}
              decoding="async"
              className="block h-auto w-full min-h-[6rem] transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          data-lightbox
          className="fixed inset-0 z-[90] flex touch-pan-y flex-col overscroll-x-none bg-zinc-950"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image viewer"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50 && items.length > 1) {
              // A swipe must never be mistaken for a tap on the backdrop
              justSwiped.current = true;
              window.setTimeout(() => {
                justSwiped.current = false;
              }, 500);
              step(dx < 0 ? 1 : -1);
            }
          }}
        >
          {/* Top bar: quiet counter + close */}
          <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
            <p
              className="text-sm font-medium tabular-nums text-zinc-400"
              aria-live="polite"
            >
              {(openIndex ?? 0) + 1} of {items.length}
            </p>
            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Close viewer"
              onClick={close}
              className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Image row: arrows are siblings of the image, never overlaid on it */}
          <div className="flex min-h-0 flex-1 items-stretch gap-2 px-2 sm:gap-4 sm:px-6">
            {items.length > 1 && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => step(-1)}
                className={navBtn("hidden sm:flex")}
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            )}
            <div
              className="relative flex min-w-0 flex-1 items-center justify-center"
              onClick={(e) => {
                // Clicking the empty area around the photo closes the viewer
                if (e.target === e.currentTarget && !justSwiped.current)
                  close();
              }}
            >
              {/* Complete original: contained, never cropped */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.url}
                alt={
                  active.caption ||
                  `${listing.listing_name} portfolio image ${(openIndex ?? 0) + 1}`
                }
                className="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                aria-label="Next image"
                onClick={() => step(1)}
                className={navBtn("hidden sm:flex")}
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            )}
          </div>

          {/* Caption panel: its own defined area under the photo */}
          <div
            className={cn(
              "shrink-0 border-t border-white/10 bg-zinc-900 px-4 py-4 sm:px-8 sm:py-5",
              !active.caption && "sm:hidden",
            )}
          >
            <div className="mx-auto flex max-w-4xl items-start gap-3">
              {items.length > 1 && (
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => step(-1)}
                  className={navBtn("sm:hidden")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              <div className="min-w-0 flex-1 text-left">
                {active.caption ? (
                  <p
                    data-lightbox-caption
                    className="max-h-[22vh] overflow-y-auto whitespace-pre-line break-words pr-2 text-base leading-relaxed text-zinc-100 [scrollbar-color:#71717a_transparent] [scrollbar-width:thin]"
                  >
                    {active.caption}
                  </p>
                ) : (
                  <p className="text-sm text-zinc-400 sm:hidden">
                    {listing.listing_name}
                  </p>
                )}
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => step(1)}
                  className={navBtn("sm:hidden")}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
