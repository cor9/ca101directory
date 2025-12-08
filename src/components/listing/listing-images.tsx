"use client";

import { ImageModal } from "@/components/shared/image-modal";
import { getListingImageUrl } from "@/lib/image-urls";
import Image from "next/image";
import { useMemo, useState } from "react";

interface ProfileImageProps {
  listing: {
    listing_name: string;
    profile_image?: string | null;
    is_claimed?: boolean | null;
    plan?: string | null;
  };
  fallbackIconUrl?: string | null;
}

export function ProfileImage({ listing, fallbackIconUrl }: ProfileImageProps) {
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

  const imageSource = useMemo(() => {
    if (listing.profile_image) {
      return getListingImageUrl(listing.profile_image || "");
    }

    const plan = listing.plan ? listing.plan.toLowerCase() : "";
    const canUseFallback =
      !listing.profile_image &&
      (!listing.is_claimed || plan.includes("free") || plan.includes("basic"));

    if (canUseFallback && fallbackIconUrl) {
      return fallbackIconUrl;
    }

    return null;
  }, [listing.profile_image, listing.is_claimed, listing.plan, fallbackIconUrl]);

  return (
    <>
      {/* Profile Image */}
      {imageSource && (
        <button
          type="button"
          className="flex-shrink-0 cursor-pointer transition-opacity hover:opacity-90"
          onClick={() =>
            openModal(
              imageSource,
              `Logo of ${listing.listing_name}`,
            )
          }
        >
          <Image
            src={imageSource}
            alt={`Logo of ${listing.listing_name}`}
            title="Click to view larger image"
            width={224}
            height={224}
            sizes="(min-width: 768px) 208px, 160px"
            className="h-40 w-40 rounded-xl bg-white/80 p-4 shadow-md object-contain md:h-52 md:w-52"
            width={400}
            height={267}
            className="object-contain rounded-lg flex-shrink-0 p-1"
          />
        </button>
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
