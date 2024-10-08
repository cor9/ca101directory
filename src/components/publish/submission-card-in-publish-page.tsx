"use client";

import { PublishNowButton } from "@/components/publish/publish-now-button";
import { Button } from "@/components/ui/button";
import { urlForImage } from "@/lib/image";
import { ItemInfo } from "@/types";
import { CalendarDaysIcon, HashIcon, PartyPopperIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SubmissionCardInPublishPageProps = {
  item: ItemInfo;
};

export default function SubmissionCardInPublishPage({ item }: SubmissionCardInPublishPageProps) {
  console.log('SubmissionCardInPublishPage, item:', item);
  const imageProps = item?.image ? urlForImage(item.image) : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  // console.log(`SubmissionCard, imageBlurDataURL:${imageBlurDataURL}`);

  return (
    <Card className="flex flex-col items-center w-full p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">
        {/* Left column */}
        <div className="md:col-span-2 flex flex-col">
          {/* image */}
          <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
            {imageProps && (
              <div className="relative w-full h-full">
                <Image
                  src={imageProps.src}
                  alt={item.image?.alt || `image for ${item.name}`}
                  loading="eager"
                  fill
                  className="border w-full image-scale"
                  {...(imageBlurDataURL && {
                    placeholder: "blur",
                    blurDataURL: imageBlurDataURL
                  })}
                />
                <div className="absolute left-2 bottom-2 opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col gap-2">
                    {item.categories && item.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.categories.map((category, index) => (
                          <span key={`cat-${index}`} className="text-xs font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded-md">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <div key={`tag-${index}`} className="flex items-center justify-center space-x-0.5 group
                            text-sm font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded-md">
                            <HashIcon className="w-3 h-3" />
                            <span> {tag.name} </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-3 flex items-center">
          <div className="flex flex-col w-full space-y-8">
            {/* name and description */}
            <h1 className="text-4xl font-medium text-start">
              {item.name}
            </h1>
            <p className="text-muted-foreground line-clamp-2 text-balance leading-relaxed">
              {item.description}
            </p>

            {/* action buttons */}
            <div className="pt-4">
              {item.publishDate ? (
                <div className="flex flex-row gap-4">
                  <div className="">
                    <Button size="lg" variant="default" asChild
                      className="group overflow-hidden">
                      <Link href={`/item/${item.slug.current}`}
                        className="flex items-center justify-center space-x-2">
                        <PartyPopperIcon className="w-4 h-6 icon-scale" />
                        <span className="">View on site</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-4">
                  <div className="">
                    <PublishNowButton item={item} />
                  </div>

                  <div className="">
                    <Button size="lg" variant="outline" asChild
                      className="group overflow-hidden flex-1 w-full">
                      <Link href='/dashboard' className="flex items-center justify-center space-x-2">
                        <CalendarDaysIcon className="w-4 h-6 icon-scale" />
                        <span className="">Publish Later</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SubmissionCardInPublishPageSkeleton() {
  return (
    <Card className="flex flex-col items-center w-full p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">
        {/* Left column - Image skeleton */}
        <div className="md:col-span-2 flex flex-col">
          <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
            <Skeleton className="w-full h-full" />
          </div>
          {/* Category and tag skeletons */}
          <div className="absolute left-2 bottom-2 flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-8 w-14 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-18 rounded-md" />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-3 flex flex-col justify-center">
          <div className="flex flex-col w-full space-y-8">
            {/* Title skeleton */}
            <Skeleton className="h-12 w-1/2" />

            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
            </div>

            {/* Action button skeleton */}
            <div className="pt-4">
              <div className="flex flex-row gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
