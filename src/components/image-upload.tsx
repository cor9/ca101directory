"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { ImageUpIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl?: string;
  onUploadChange: (status: { isUploading: boolean; imageId?: string }) => void;
}

export default function ImageUpload({ currentImageUrl, onUploadChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl);

  const uploadImage = async (file: File) => {
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      console.error('uploadImage, image size should be less than 1MB.');
      toast.error('Image size should be less than 1MB.');
      return null;
    }

    try {
      const asset = await sanityClient.assets.upload('image', file);
      return asset;
    } catch (error) {
      console.error('uploadImage, error uploading image:', error);
      toast.error('Upload Image failed, please try again.');
      return null;
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
      }
    } catch (error) {
      console.error("handleImageUpload, error uploading image:", error);
    } finally {
      setUploading(false);
      onUploadChange({ isUploading: false });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0];
      handleImageUpload(image);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        handleImageUpload(file);
      } else {
        toast.error('Only PNG and JPEG images are allowed.');
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="h-full">
      <label
        htmlFor="dropzone-file"
        className={cn(
          "w-full h-full visually-hidden-focusable rounded-lg cursor-pointer",
          "relative flex flex-col items-center justify-center",
          "border-2 border-dashed",
          "hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        )}>

        {/* initial state */}
        {!uploading && !imageUrl && (
          <div className="flex flex-col items-center justify-center gap-4">
            <ImageUpIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Select an image or drag here to upload directly
            </p>
          </div>
        )}

        {/* uploading state */}
        {uploading && (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">
              Please wait while the image is being uploaded
            </p>
          </div>
        )}

        {/* uploaded state */}
        {imageUrl && !uploading && (
          <div className="py-4 flex flex-col items-center justify-center gap-4 w-full h-full">
            <div className="relative w-full h-[80%] flex items-center justify-center">
              <Image
                src={imageUrl}
                alt="uploaded image"
                layout="fill"
                objectFit="contain"
                className="rounded-lg transition-opacity duration-300 hover:opacity-90"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Click here to upload another image
            </p>
          </div>
        )}
      </label>

      {/* input to upload image */}
      <Input
        {...getInputProps()}
        id="dropzone-file"
        accept="image/png, image/jpeg"
        type="file"
        className="hidden"
        disabled={uploading || imageUrl !== null}
        onChange={handleImageChange}
      />
    </div>
  );
}
