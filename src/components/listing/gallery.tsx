"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageModal } from "@/components/shared/image-modal";
import { getListingImageUrl, parseGalleryImages } from "@/lib/image-urls";

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
  } | null>(null);

  const openModal = (url: string, alt: string) => {
    setModalImage({ url, alt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  // Parse gallery images
  const galleryImages = typeof listing.gallery === 'string' 
    ? parseGalleryImages(listing.gallery)
    : Array.isArray(listing.gallery) 
      ? (listing.gallery as string[]).map(img => getListingImageUrl(img))
      : [];

  if (!listing.gallery && listing.plan !== "pro" && !listing.comped) {
    return null;
  }

  return (
    <>
      <div className="listing-card">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "#0C1A2B" }}
        >
          Gallery
        </h2>
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {galleryImages.map((imageUrl, index) => (
              <div 
                key={`gallery-${index}-${imageUrl}`} 
                className="relative group overflow-hidden rounded-lg aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openModal(
                  imageUrl, 
                  `Gallery image ${index + 1} for ${listing.listing_name}`
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openModal(
                      imageUrl, 
                      `Gallery image ${index + 1} for ${listing.listing_name}`
                    );
                  }
                }}
                tabIndex={0}
                role="button"
                // biome-ignore lint/a11y/preferButtonElement: div needed for image layout
              >
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index + 1} for ${listing.listing_name}`}
                  title="Click to view larger image"
                  loading="eager"
                  fill
                  className="border w-full shadow-lg object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-800">Click to enlarge</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">
              No gallery images yet
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={closeModal}
        imageUrl={modalImage?.url || ""}
        alt={modalImage?.alt || ""}
      />
    </>
  );
}
