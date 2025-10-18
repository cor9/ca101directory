"use client";

import { ImageModal } from "@/components/shared/image-modal";
import { getCategoryIconsMap } from "@/data/categories";
import { getCategoryIconUrl, getListingImageUrl } from "@/lib/image-urls";
import Image from "next/image";
import { useState } from "react";

interface ProfileImageProps {
  listing: {
    listing_name: string;
    profile_image?: string | null;
    categories?: string[] | null;
    is_claimed?: boolean | null;
    plan?: string | null;
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

  // Fallback: derive category icon when no profile image and listing is free/unclaimed
  const needsCategoryFallback =
    !listing.profile_image && (!listing.is_claimed || listing.plan === "Free");

  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  // Resolve category icon if needed
  useState(() => {
    if (!needsCategoryFallback) return;
    (async () => {
      try {
        const iconMap = await getCategoryIconsMap();
        const categories = listing.categories || [];
        const normalize = (v: string) =>
          v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        for (const cat of categories) {
          if (!cat) continue;
          const key = normalize(cat);
          for (const [name, filename] of Object.entries(iconMap || {})) {
            if (normalize(name) === key && filename) {
              setFallbackUrl(getCategoryIconUrl(filename));
              return;
            }
          }
        }
      } catch (e) {
        // ignore
      }
    })();
  });

  return (
    <>
      {/* Profile Image */}
      {(listing.profile_image || fallbackUrl) && (
        <button
          type="button"
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() =>
            openModal(
              listing.profile_image
                ? getListingImageUrl(listing.profile_image || "")
                : fallbackUrl || "",
              `Logo of ${listing.listing_name}`,
            )
          }
        >
          <Image
            src={
              listing.profile_image
                ? getListingImageUrl(listing.profile_image)
                : fallbackUrl || ""
            }
            alt={`Logo of ${listing.listing_name}`}
            title="Click to view larger image"
            width={160}
            height={160}
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
