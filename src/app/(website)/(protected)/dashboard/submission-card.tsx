"use client";

import { PublishButton } from "@/components/forms/publish-button";
import { UnpublishButton } from "@/components/forms/unpublish-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { urlForImage } from "@/lib/image";
import { getBadgeStyle, getPublishable, PricePlan } from "@/lib/submission";
import { cn, getLocaleDate } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { EditIcon, GlobeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SubmissionCardProps = {
  item: ItemInfo;
};

export default function SubmissionCard({ item }: SubmissionCardProps) {
  const imageProps = item?.image
    ? urlForImage(item.image)
    : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  // console.log(`SubmissionCard, imageBlurDataURL:${imageBlurDataURL}`);

  const publishable = getPublishable(item);
  const badgeStyle = getBadgeStyle(item);
  const status = item.pricePlan === PricePlan.FREE ? item.freePlanStatus : item.proPlanStatus;
  // const badgeStatus = getBadgeStatus(item.pricePlan, status);

  return (
    <>
      <Card className="flex-grow flex items-center p-4">
        {/* Content section */}
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
                      View on site
                    </span>
                  </Link>
                ) : null
              }
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div className="space-y-4">
              {
                publishable && item.publishDate ?
                  (
                    <Link href={`/item/${item.slug.current}`}>
                      <h1 className="text-2xl font-bold">{item.name}</h1>
                    </Link>
                  ) : (
                    <h1 className="text-2xl font-bold">{item.name}</h1>
                  )
              }

              <p className="line-clamp-3">{item.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Plan:</span>
                  <Badge variant="secondary" className="capitalize">
                    {item.pricePlan}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Status:</span>
                  {
                    <Badge variant='outline' className={cn(
                      "capitalize",
                      badgeStyle === "success" && "bg-green-100 text-green-800",
                      badgeStyle === "danger" && "bg-red-100 text-red-800",
                      badgeStyle === "warning" && "bg-yellow-100 text-yellow-800",
                      badgeStyle === "normal" && "bg-gray-100 text-gray-800"
                    )}>
                      {status}
                    </Badge>
                  }
                </div>
                <div className="flex items-center gap-2 md:inline-block">
                  <span className="font-medium text-muted-foreground">Publish Date:</span>
                  <span className="font-semibold">
                    {item.publishDate ? getLocaleDate(item.publishDate) : 'Not published'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Created Date:</span>
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
                  <EditIcon className="w-4 h-4 mr-2 icon-scale" />
                  Edit
                </Link>
              </Button>

              {/* view button */}
              {/* {publishable && item.publishDate && (
                <Button asChild variant="outline" className="group overflow-hidden">
                  <Link href={`/item/${item.slug.current}`}>
                    <GlobeIcon className="w-4 h-4 mr-2 icon-scale" />
                    View
                  </Link>
                </Button>
              )} */}
            </div>
          </div>

        </div>
      </Card>
    </>
  );
}