"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
  caption?: string;
}

export function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  alt,
  caption,
}: ImageModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Close modal"
      />

      {/* Modal content */}
      <div className="relative w-full max-w-4xl p-4">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-paper" />
        </button>

        {/* Scrollable content (image + caption) */}
        <div className="max-h-[85vh] overflow-y-auto pr-1">
          {/* Image */}
          <div className="relative">
            <Image
              src={imageUrl}
              alt={alt}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-2xl"
              priority
            />
          </div>

          {/* Caption (visible only in modal) */}
          {caption && caption.trim() !== "" && (
            <div className="mt-4 bg-black/50 rounded-lg p-4">
              <p className="text-paper text-sm whitespace-pre-wrap">
                {caption}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
