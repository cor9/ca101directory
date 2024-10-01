"use client";

import { Badge } from "@/components/ui/badge";
import { urlForImage } from "@/lib/image";
import { getLocaleDate } from "@/lib/utils";
import { ItemInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";
import SubmissionStatus from "../../../../../../components/dashboard/submission-status";

type SubmissionCardInPlanPageProps = {
  item: ItemInfo;
};

export default function SubmissionCardInPlanPage({ item }: SubmissionCardInPlanPageProps) {
  const imageProps = item?.image
    ? urlForImage(item.image)
    : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  // console.log(`SubmissionCard, imageBlurDataURL:${imageBlurDataURL}`);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">

        {/* Left column */}
        <div className="md:col-span-2 flex flex-col">
          {/* image */}
          <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
            {imageProps && (
              <>
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
                          <span key={`tag-${index}`} className="text-xs font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded-md">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {
              item.publishDate ? (
                <Link href={`/item/${item.slug.current}`} className="absolute inset-0 flex items-center justify-center bg-black 
                    bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                  <span className="text-white text-lg font-semibold 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Visit Website
                  </span>
                </Link>
              ) : null
            }
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-3 flex flex-col justify-center">
          <div className="space-y-4">
            <h1 className="text-2xl font-medium">{item.name}</h1>

            <p className="text-muted-foreground line-clamp-2 text-balance leading-relaxed">
              {item.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Plan:</span>
                {/* <Badge variant="secondary" className="capitalize">
                    {item.pricePlan}
                  </Badge> */}
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
                {
                  item.publishDate ? (
                    <span className="font-medium">
                      {getLocaleDate(item.publishDate)}
                    </span>
                  ) : (
                    <span className="font-semibold">
                      Not published
                    </span>
                  )
                }
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Created Date:</span>
                <span className="">{getLocaleDate(item._createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}