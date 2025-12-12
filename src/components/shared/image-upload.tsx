"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImageUpIcon, Loader2Icon } from "lucide-react";
import NextImage from "next/image";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl?: string;
  onUploadChange: (status: { isUploading: boolean; imageId?: string }) => void;
  type: "icon" | "image";
}

/**
 * image upload component
 */
export default function ImageUpload({
  currentImageUrl = null,
  onUploadChange,
  type = "image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl);

  // Add effect to watch currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl !== imageUrl) {
      setImageUrl(currentImageUrl);
    }
  }, [currentImageUrl, imageUrl]);

  const uploadImage = async (file: File) => {
    try {
      // Preserve original aspect ratio; resize only if very large (no hard crop)
      const processed = await resizeToMax(file, 1600);

      // Upload to Supabase Storage via API route
      const formData = new FormData();
      formData.append("file", processed);
      formData.append("businessSlug", "logo");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.url) {
        // Return full URL as ID for database storage
        return {
          url: result.url,
          _id: result.url, // Use full URL as ID
        };
      }
      throw new Error(result.error || "Upload failed");
    } catch (error) {
      console.error("uploadImage, error uploading image:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Upload failed, please try again.",
      );
      return null;
    }
  };

  // Helper: resize while preserving aspect ratio (no cropping)
  async function resizeToMax(file: File, maxDim: number): Promise<File> {
    const img = await fileToImage(file);
    const sourceW = img.naturalWidth || img.width;
    const sourceH = img.naturalHeight || img.height;
    const scale = Math.min(1, maxDim / Math.max(sourceW, sourceH));
    const targetWidth = Math.max(1, Math.round(sourceW * scale));
    const targetHeight = Math.max(1, Math.round(sourceH * scale));
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        "image/jpeg",
        0.9,
      );
    });

    const nameNoExt = (file.name || "image").replace(/\.[^.]+$/, "");
    return new File([blob], `${nameNoExt}-resized.jpg`, { type: "image/jpeg" });
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0];
      handleImageUpload(image);
    }
  };

  const handleImageUpload = async (image: File) => {
    if (!image) return;
    setUploading(true);
    onUploadChange({ isUploading: true });

    try {
      const asset = await uploadImage(image);
      if (asset) {
        setImageUrl(asset.url);
        onUploadChange({ isUploading: false, imageId: asset._id });
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("handleImageUpload, error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      onUploadChange({ isUploading: false });
    }
  };
  const handleImageUploadRef = useRef(handleImageUpload);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg"
      ) {
        handleImageUploadRef.current(file);
      } else {
        toast.error("Only PNG and JPEG images are allowed.");
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true, // disable click to upload, avoid show file input dialog twice
    maxFiles: 1,
    // maxSize: 1 * 1024 * 1024, // 1MB, no effect
  });

  return (
    <div {...getRootProps()} className="h-full">
      <label
        htmlFor={`dropzone-file-${type}`}
        className={cn(
          "w-full h-full visually-hidden-focusable rounded-lg cursor-pointer",
          "relative flex flex-col items-center justify-center",
          "border-2 border-dashed",
          "hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
        )}
      >
        {/* initial state */}
        {!uploading && !imageUrl && (
          <div className="flex flex-col items-center justify-center gap-4">
            <ImageUpIcon className="h-8 w-8 text-paper" />
            <p className="text-sm text-paper">
              Drag & drop or select image to upload
            </p>
          </div>
        )}

        {/* uploading state */}
        {uploading && (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2Icon className="h-8 w-8 text-paper animate-spin mx-auto" />
            <p className="text-sm text-paper">Image is uploading...</p>
          </div>
        )}

        {/* uploaded state */}
        {imageUrl && !uploading && (
          <div className="p-4 flex flex-col items-center justify-center gap-4 w-full h-full">
            <div
              className={cn(
                "relative group overflow-hidden rounded-lg",
                type === "icon"
                  ? "w-32 h-32" // icon mode
                  : "aspect-[16/9] h-[320px]", // image mode, fixed height
              )}
            >
              <NextImage
                src={imageUrl}
                alt="uploaded image"
                fill
                className={cn(
                  "shadow-lg rounded-lg transition-opacity duration-300 hover:opacity-50",
                )}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium text-white bg-black bg-opacity-50 px-3 py-2 rounded-md">
                  Click to upload another image
                </p>
              </div>
            </div>
          </div>
        )}
      </label>

      {/* input to upload image */}
      {/* disabled={uploading || imageUrl !== null} */}
      <Input
        {...getInputProps()}
        id={`dropzone-file-${type}`}
        accept="image/png, image/jpeg, image/jpg"
        type="file"
        className="hidden"
        disabled={uploading}
        onChange={handleImageChange}
      />
    </div>
  );
}
