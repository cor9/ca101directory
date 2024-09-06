"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sanityClient } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadChange: (status: { isUploading: boolean; imageId?: string }) => void;
}

export default function ImageUpload({ onUploadChange }: ImageUploadProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
      console.error("uploadImage, error uploading image:", error);
      toast.error('Upload Image failed, please try again.');
      return null;
    }
  };

  const handleImageUpload = async (image: File) => {
    if (!image) return;
    setLoading(true);
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
      setLoading(false);
      onUploadChange({ isUploading: false });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0];
      handleImageUpload(image);
    }
  };

  const removeUploadedImage = () => {
    setLoading(false);
    setImageUrl(null);
    onUploadChange({ isUploading: false });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const image = acceptedFiles[0];
      handleImageUpload(image);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="space-y-3 h-full">
      <div {...getRootProps()} className="h-full">
        <label
          htmlFor="dropzone-file"
          className="relative flex flex-col items-center justify-center p-6 border-2 
          border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 
          hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 
          w-full visually-hidden-focusable h-full"
        >
          {loading && (
            <div className="text-center max-w-md">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-sm font-semibold mt-2">Uploading Picture</p>
              <p className="text-xs text-gray-400">
                Please wait while the picture is being uploaded
              </p>
            </div>
          )}

          {!loading && !imageUrl && (
            <div className="text-center">
              <div className="border p-2 rounded-md max-w-min mx-auto">
                <IoCloudUploadOutline size="1.6em" />
              </div>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Drag an image</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400">
                Select an image or drag here to upload directly
              </p>
            </div>
          )}

          {imageUrl && !loading && (
            <div className="text-center space-y-2">
              <Image
                width={1000}
                height={1000}
                src={imageUrl}
                className="w-full object-contain max-h-16 opacity-70"
                alt="uploaded image"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Image Uploaded</p>
                <p className="text-xs text-gray-400">
                  Click here to upload another image
                </p>
              </div>
            </div>
          )}
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
          disabled={loading || imageUrl !== null}
          onChange={handleImageChange}
        />
      </div>

      {!!imageUrl && (
        <div className="flex items-center justify-between">
          <Link
            href={imageUrl}
            className="text-gray-500 text-xs hover:underline"
          >
            Click here to see uploaded image
          </Link>

          <Button
            onClick={removeUploadedImage}
            type="button"
            variant="secondary"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
