"use client";

import { PublishButton } from "@/components/dashboard/publish-button";
import { UnpublishButton } from "@/components/dashboard/unpublish-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { urlForImage } from "@/lib/image";
import { getPublishable } from "@/lib/submission";
import { getLocaleDate } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { EditIcon, HashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SubmissionStatus from "./submission-status";

type SubmissionCardProps = {
  item: ItemInfo;
};

export default function SubmissionCard({ item }: SubmissionCardProps) {
  // console.log('SubmissionCard, item:', item);
  const imageProps = item?.image ? urlForImage(item.image) : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  // console.log(`SubmissionCard, imageBlurDataURL:${imageBlurDataURL}`);

  const publishable = getPublishable(item);

  return (
    <Card className="flex-grow flex items-center p-4">
      {/* Content section */}
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
                  className="border w-full shadow-lg image-scale"
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

            {item.publishDate ? (
              <Link href={`/item/${item.slug.current}`} className="absolute inset-0 flex items-center justify-center bg-black 
                    bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View on site
                </span>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-3 flex flex-col justify-between">
          <div className="space-y-4">
            {publishable && item.publishDate ? (
              <Link href={`/item/${item.slug.current}`}>
                <h3 className="text-2xl inline-block">{item.name}</h3>
              </Link>
            ) : (
              <h3 className="text-2xl inline-block">{item.name}</h3>
            )}

            <p className="text-muted-foreground line-clamp-2 text-balance leading-relaxed">
              {item.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Plan:</span>
                <span className="capitalize">{item.pricePlan}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <SubmissionStatus item={item} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Publish Date:</span>
                {item.publishDate ? (
                  <span className="font-medium">
                    {getLocaleDate(item.publishDate)}
                  </span>
                ) : (
                  <span className="font-semibold">
                    Not published
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Created Date:</span>
                <span className="">{getLocaleDate(item._createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            {/* publish or unpublish button */}
            {publishable && item.publishDate && (
              <UnpublishButton item={item} />
            )}
            {!item.publishDate && (
              <PublishButton item={item} />
            )}

            {/* edit button */}
            <Button asChild variant="outline" className="group overflow-hidden">
              <Link href={`/edit/${item._id}`}>
                <EditIcon className="w-4 h-6 mr-2 icon-scale" />
                Edit
              </Link>
            </Button>

            {/* view button */}
            {/* {publishable && item.publishDate && (
                <Button asChild variant="outline" className="group overflow-hidden">
                  <Link href={`/item/${item.slug.current}`}>
                    <GlobeIcon className="w-4 h-6 mr-2 icon-scale" />
                    View
                  </Link>
                </Button>
              )} */}
          </div>
        </div>

      </div>
    </Card>
  );
}

export function SubmissionCardSkeleton() {
  return (
    <Card className="flex-grow flex items-center p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">
        {/* Left column */}
        <div className="md:col-span-2 flex flex-col">
          <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
            <Skeleton className="w-full h-full" />
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-3 flex flex-col justify-between">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" /> {/* Title */}
            <Skeleton className="h-6 w-full" /> {/* Description */}

            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-12" /> {/* Plan label */}
                <Skeleton className="h-6 w-20" /> {/* Plan value */}
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16" /> {/* Status label */}
                <Skeleton className="h-6 w-24" /> {/* Status value */}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24" /> {/* Publish Date label */}
                <Skeleton className="h-6 w-32" /> {/* Publish Date value */}
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24" /> {/* Created Date label */}
                <Skeleton className="h-6 w-32" /> {/* Created Date value */}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </Card>
  );
}