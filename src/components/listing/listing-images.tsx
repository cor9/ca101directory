"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageModal } from "@/components/shared/image-modal";
import { getListingImageUrl } from "@/lib/image-urls";

interface ProfileImageProps {
  listing: {
    listing_name: string;
    profile_image?: string | null;
  };
}

export function ProfileImage({ listing }: ProfileImageProps) {
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

  return (
    <>
      {/* Profile Image */}
      {listing.profile_image && (
        <div 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openModal(
            getListingImageUrl(listing.profile_image || ""), 
            `Logo of ${listing.listing_name}`
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              openModal(
                getListingImageUrl(listing.profile_image || ""), 
                `Logo of ${listing.listing_name}`
              );
            }
          }}
          tabIndex={0}
          role="button"
          // biome-ignore lint/a11y/preferButtonElement: Need div for image layout
        >
          <Image
            src={getListingImageUrl(listing.profile_image)}
            alt={`Logo of ${listing.listing_name}`}
            title="Click to view larger image"
            width={120}
            height={120}
            className="object-cover rounded-lg flex-shrink-0"
          />
        </div>
      )}

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
