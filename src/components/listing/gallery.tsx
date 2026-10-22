"use client";

import { parseGalleryItems } from "@/lib/gallery";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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
        );
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
          className="fixed inset-0 z-[90] flex touch-pan-y items-center justify-center overscroll-x-none bg-black/95 p-2 sm:p-6"
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
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => {
              if (!justSwiped.current) close();
            }}
            className="absolute inset-0 cursor-default"
          />
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close viewer"
            onClick={close}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-6 w-6" />
          </button>
          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => step(-1)}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => step(1)}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
          <figure className="pointer-events-none relative z-0 flex max-h-full max-w-full flex-col items-center">
            {/* Complete original: contained, never cropped */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.url}
              alt={
                active.caption ||
                `${listing.listing_name} portfolio image ${(openIndex ?? 0) + 1}`
              }
              className="max-h-[calc(100vh-6rem)] w-auto max-w-full rounded-md object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white/85">
              {active.caption ? `${active.caption} · ` : ""}
              {(openIndex ?? 0) + 1} / {items.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
