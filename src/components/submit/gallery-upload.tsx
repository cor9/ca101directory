"use client";

import { cn } from "@/lib/utils";
import { ImageUpIcon, Loader2Icon, XIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface GalleryUploadProps {
  maxImages: number;
  currentImages: string[];
  onImagesChange: (images: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export function GalleryUpload({
  maxImages,
  currentImages,
  onImagesChange,
  onUploadingChange,
}: GalleryUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<Set<number>>(new Set());

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const availableSlots =
        maxImages - currentImages.filter((img) => img).length;
      const filesToUpload = acceptedFiles.slice(0, availableSlots);

      if (filesToUpload.length < acceptedFiles.length) {
        toast.error(`Only ${availableSlots} image slots available`);
      }

      onUploadingChange(true);

      // Find available slots
      const availableIndexes: number[] = [];
      const newImages = [...currentImages];

      for (let i = 0; i < maxImages; i++) {
        if (!newImages[i] || newImages[i] === "") {
          availableIndexes.push(i);
        }
      }

      for (
        let i = 0;
        i < filesToUpload.length && i < availableIndexes.length;
        i++
      ) {
        const file = filesToUpload[i];
        const index = availableIndexes[i];
        setUploadingFiles((prev) => new Set([...Array.from(prev), index]));

        // Upload image inline (center-crop to 3:2, 1200x800)
        try {
          const cropped = await cropToAspect(file, 1200, 800);
          const formData = new FormData();
          formData.append("file", cropped);
          formData.append("businessSlug", "gallery");

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (result.success && result.url) {
            newImages[index] = result.url;
          } else {
            throw new Error(result.error || "Upload failed");
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast.error(
            `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }

        setUploadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }

      onImagesChange(newImages);
      onUploadingChange(false);
    },
    [currentImages, maxImages, onImagesChange, onUploadingChange],
  );

  // Helpers: center-crop an image file to target aspect and size
  async function cropToAspect(
    file: File,
    targetWidth: number,
    targetHeight: number,
  ): Promise<File> {
    const img = await fileToImage(file);
    const sourceW = img.naturalWidth || img.width;
    const sourceH = img.naturalHeight || img.height;

    const targetAspect = targetWidth / targetHeight;
    const sourceAspect = sourceW / sourceH;

    let sx = 0;
    let sy = 0;
    let sw = sourceW;
    let sh = sourceH;

    if (sourceAspect > targetAspect) {
      sw = Math.round(sourceH * targetAspect);
      sx = Math.round((sourceW - sw) / 2);
    } else if (sourceAspect < targetAspect) {
      sh = Math.round(sourceW / targetAspect);
      sy = Math.round((sourceH - sh) / 2);
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", 0.9);
    });

    const nameNoExt = (file.name || "image").replace(/\.[^.]+$/, "");
    return new File([blob], `${nameNoExt}-cropped.jpg`, { type: "image/jpeg" });
  }

  async function fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      img.src = url;
    });
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
    maxFiles: maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = [...currentImages];
    newImages[index] = "";
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-brand-blue bg-brand-blue/10"
            : "border-gray-300 hover:border-gray-400",
          maxImages === 0 && "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} disabled={maxImages === 0} />
        <div className="space-y-2">
          <ImageUpIcon
            className={cn(
              "w-8 h-8 mx-auto",
              isDragActive ? "text-brand-blue" : "text-gray-900",
            )}
          />
          <div className="space-y-1">
            {maxImages === 0 ? (
              <p className="text-sm text-gray-900">
                Gallery images not included with Free plan
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-900">
                  {isDragActive
                    ? "Drop images here"
                    : "Drag & drop images here, or click to select"}
                </p>
                <p className="text-xs text-gray-900">
                  Up to {maxImages} images • JPG, PNG, WebP up to 5MB each
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {maxImages > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: maxImages }).map((_, index) => {
            const image = currentImages[index];
            const isUploading = uploadingFiles.has(index);

            return (
              <div
                key={`gallery-slot-${index}-${maxImages}`}
                className="relative h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2Icon className="w-6 h-6 animate-spin text-brand-blue" />
                  </div>
                ) : image ? (
                  <>
                    <Image
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-900">
                    <span className="text-sm">Slot {index + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
