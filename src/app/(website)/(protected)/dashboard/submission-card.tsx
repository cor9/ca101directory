"use client";

import { PublishButton } from "@/components/forms/publish-button";
import { UnpublishButton } from "@/components/forms/unpublish-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { urlForImage } from "@/lib/image";
import { cn, getLocaleDate } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { CalendarDaysIcon, EditIcon, PartyPopperIcon, RocketIcon } from "lucide-react";
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
  const publishDate = item.publishDate || item._createdAt;
  const date = getLocaleDate(publishDate);

  const publishable = (item.pricePlan === 'free'
    && item.freePlanStatus === 'approved')
    || (item.pricePlan === 'pro'
      && item.proPlanStatus === 'success');
  const getBadgeStatus = (plan: string, status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (plan === "free") {
      switch (status) {
        case "approved": return "default";
        case "rejected": return "destructive";
        case "pending": return "secondary";
        default: return "outline";
      }
    } else if (plan === "pro") {
      switch (status) {
        case "success": return "default";
        case "failed": return "destructive";
        case "pending": return "secondary";
        default: return "outline";
      }
    }
    return "outline";
  };

  const status = item.pricePlan === "free" ? item.freePlanStatus : item.proPlanStatus;
  const badgeStatus = getBadgeStatus(item.pricePlan, status);

  return (
    <>
      <Card className="flex-grow flex items-center p-4">
        {/* Content section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 lg:gap-8 w-full">

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
                    className="border w-full shadow-lg
                      transition-all duration-300 ease-in-out group-hover:scale-105"
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black 
                    bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                    <span className="text-white text-lg font-semibold 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Visit Website
                    </span>
                  </div>
                ) : null
              }
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{item.name}</h1>

              <p className="line-clamp-3">{item.description}</p>

              <span>{""}</span>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Plan:</span>
                  <Badge variant={item.pricePlan === "free" ? "secondary" : "default"} className="ml-2 capitalize">
                    {item.pricePlan}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Status:</span>
                  <Badge variant={getBadgeStatus(item.pricePlan, status)} className="ml-2 capitalize">
                    {status}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Publish Date:</span>
                  <span className="ml-2">{item.publishDate ? getLocaleDate(item.publishDate) : 'Not published'}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Created Date:</span>
                  <span className="ml-2">{getLocaleDate(item._createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {item.pricePlan === 'free' && (
                <Button asChild variant="default">
                  <Link href={`/submit/price/${item._id}`}>
                    <RocketIcon className="w-4 h-4 mr-2" />
                    Upgrade
                  </Link>
                </Button>
              )}
              {item.publishDate && (
                <Button asChild variant="outline">
                  <Link href={`/item/${item.slug.current}`} target="_blank">
                    View
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href={`/edit/${item._id}`}>
                  <EditIcon className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              {publishable && (
                item.publishDate ? <UnpublishButton item={item} /> : <PublishButton item={item} />
              )}
            </div>
          </div>

        </div>
      </Card>
    </>
  );
}