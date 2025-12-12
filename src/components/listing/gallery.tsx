"use client";

import { ImageModal } from "@/components/shared/image-modal";
import { getListingImageUrl, parseGalleryImages } from "@/lib/image-urls";
import Image from "next/image";
import { useState } from "react";

interface GalleryProps {
  listing: {
    listing_name: string;
    gallery?: string | string[] | null;
    plan?: string;
    comped?: boolean;
  };
}

export function Gallery({ listing }: GalleryProps) {
  const [modalImage, setModalImage] = useState<{
    url: string;
    alt: string;
    caption?: string;
  } | null>(null);

  const openModal = (url: string, alt: string, caption?: string) => {
    setModalImage({ url, alt, caption });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  // Parse gallery images and optional captions (backward compatible)
  type GalleryItem = { url: string; caption?: string };
  const galleryItems: GalleryItem[] = (() => {
    // If gallery is a string, try to parse JSON first (may be array of strings or objects)
    if (typeof listing.gallery === "string" && listing.gallery.trim() !== "") {
      try {
        const parsed = JSON.parse(listing.gallery);
        if (Array.isArray(parsed)) {
          return parsed
            .map((entry: any) => {
              // Support objects { url, caption } or { src, caption }
              if (entry && typeof entry === "object") {
                const rawUrl = entry.url || entry.src || "";
                if (!rawUrl || typeof rawUrl !== "string") return null;
                return {
                  url: getListingImageUrl(rawUrl),
                  caption:
                    typeof entry.caption === "string"
                      ? entry.caption
                      : undefined,
                } as GalleryItem;
              }
              // Support legacy string entries
              if (typeof entry === "string") {
                return { url: getListingImageUrl(entry) } as GalleryItem;
              }
              return null;
            })
            .filter(Boolean) as GalleryItem[];
        }
      } catch {
        // Fallback to previous parser that expects a comma-delimited or JSON-like string of filenames/urls
        const urls = parseGalleryImages(listing.gallery);
        return urls.map((u) => ({ url: u }));
      }
    }
    // If gallery is already an array
    if (Array.isArray(listing.gallery)) {
      return (listing.gallery as any[])
        .map((entry) => {
          if (typeof entry === "string") {
            return { url: getListingImageUrl(entry) } as GalleryItem;
          }
          if (entry && typeof entry === "object") {
            const rawUrl = (entry as any).url || (entry as any).src || "";
            if (!rawUrl || typeof rawUrl !== "string") return null;
            return {
              url: getListingImageUrl(rawUrl),
              caption:
                typeof (entry as any).caption === "string"
                  ? (entry as any).caption
                  : undefined,
            } as GalleryItem;
          }
          return null;
        })
        .filter(Boolean) as GalleryItem[];
    }
    return [];
  })();

  if (!listing.gallery && listing.plan !== "pro" && !listing.comped) {
    return null;
  }

  return (
    <>
      <div className="listing-card-transparent">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#fafadc" }}>
          Gallery
        </h2>
        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryItems.map((item, index) => (
              <button
                key={`gallery-${index}-${item.url}`}
                className="relative group overflow-hidden rounded-lg h-44 md:h-48 lg:h-56 cursor-pointer hover:opacity-90 transition-opacity"
                type="button"
                onClick={() =>
                  openModal(
                    item.url,
                    `Gallery image ${index + 1} for ${listing.listing_name}`,
                    item.caption,
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openModal(
                      item.url,
                      `Gallery image ${index + 1} for ${listing.listing_name}`,
                      item.caption,
                    );
                  }
                }}
              >
                <Image
                  src={item.url}
                  alt={`Gallery image ${index + 1} for ${listing.listing_name}`}
                  title="Click to view larger image"
                  loading="lazy"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  fill
                  className="border w-full shadow-lg object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
                    <span className="text-sm font-semibold text-black">
                      Click to enlarge
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-100">
            <p className="text-paper text-sm">No gallery images yet</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={closeModal}
        imageUrl={modalImage?.url || ""}
        alt={modalImage?.alt || ""}
        caption={modalImage?.caption}
      />
    </>
  );
}
