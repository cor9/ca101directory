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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 w-full">

          {/* Left column */}
          <div className="lg:col-span-1 flex flex-col">
            {/* image */}
            <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
              {imageProps && (
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
          <div className="lg:col-span-1 flex py-4">
            <div className="flex flex-col w-full gap-4 justify-between">
              <div className="flex flex-col gap-4">
                {/* name and description */}
                <h1 className="text-4xl font-bold text-start">
                  {item.name}
                </h1>

                <p className="text-muted-foreground overflow-hidden text-ellipsis line-clamp-2">
                  {item.description}
                </p>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-4 justify-start items-center">
                    <span className="text-sm font-medium">Plan:</span>
                    <Badge variant={item.pricePlan === "free" ? "secondary" : "default"} className="capitalize">
                      {item.pricePlan}
                    </Badge>
                  </div>

                  <div className="flex gap-4 justify-start items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant='outline' className={cn(
                      "capitalize",
                      badgeStatus === "default" && "bg-green-100 text-green-800",
                      badgeStatus === "destructive" && "bg-red-100 text-red-800",
                      badgeStatus === "secondary" && "bg-yellow-100 text-yellow-800",
                      badgeStatus === "outline" && "bg-gray-100 text-gray-800"
                    )}>
                      {status}
                    </Badge>
                  </div>

                  <div className="flex gap-4 justify-start items-center">
                    <span className="text-sm font-medium">Publish Date:</span>
                    {item.publishDate ? (
                      <span>{getLocaleDate(item.publishDate)}</span>
                    ) : (
                      <span className='text-muted-foreground'>Not published</span>
                    )}
                  </div>

                  <div className="flex gap-4 justify-start items-center">
                    <span className="text-sm font-medium">Created Date:</span>
                    <span>{getLocaleDate(item._createdAt)}</span>
                  </div>
                </div>

              </div>

              {/* view button if published */}
              <div className='flex items-center gap-2'>

                {/* show upgrade plan button if in free plan */}
                {
                  item.pricePlan === 'free' ?
                    <Button asChild variant="default" size="default">
                      <Link href={`/submit/price/${item._id}`}
                        className="flex items-center justify-center space-x-2">
                        <RocketIcon className="w-4 h-4
                              transition-transform duration-300 ease-in-out group-hover:scale-125" />
                        <span className="">Upgrade</span>
                      </Link>
                    </Button> : null
                }

                {/* view button if published */}
                {
                  item.publishDate ?
                    <Button asChild variant="default" size="sm">
                      <Link target='_blank'
                        href={`/item/${item.slug.current}`}
                      >
                        View
                      </Link>
                    </Button> : null
                }

                {/* edit button always visible */}
                <Button asChild variant="outline" size="default">
                  <Link href={`/edit/${item._id}`}
                    className="flex items-center justify-center space-x-2">
                    <EditIcon className="w-4 h-4
                              transition-transform duration-300 ease-in-out group-hover:scale-125" />
                    <span className="">Edit</span>
                  </Link>
                </Button>

                {/* publish or unpublish button if publishable */}
                {
                  publishable ? (
                    item.publishDate ?
                      <UnpublishButton item={item} /> :
                      <PublishButton item={item} />
                  ) : null
                }

              </div>

              {/* action buttons */}
              {/* {
                item.publishDate ? (
                  <div className="flex flex-row gap-4">
                    <div className="group flex-1">
                      <Button size="lg" variant="default" asChild
                        className="group">
                        <Link href={`/item/${item.slug.current}`}
                          className="flex items-center justify-center space-x-2">
                          <PartyPopperIcon className="w-4 h-4
                              transition-transform duration-300 ease-in-out group-hover:scale-125" />
                          <span className="">View on site</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row gap-4">
                    <div className="group flex-1">
                      <Button size="lg" variant="default" asChild
                        className="group flex-1 w-full">
                        <Link href='/dashboard' className="flex items-center justify-center space-x-2">
                          <CalendarDaysIcon className="w-4 h-4
                          transition-transform duration-300 ease-in-out group-hover:scale-125" />
                          <span className="">Publish Now</span>
                        </Link>
                      </Button>
                    </div>

                    <div className="group flex-1">
                      <Button size="lg" variant="outline" asChild
                        className="group flex-1 w-full">
                        <Link href='/dashboard' className="flex items-center justify-center space-x-2">
                          <CalendarDaysIcon className="w-4 h-4
                          transition-transform duration-300 ease-in-out group-hover:scale-125" />
                          <span className="">Publish Later</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              } */}

            </div>
          </div>

        </div>
      </Card>

      {/* <Link
        href={`/item/${item.slug.current}`}
        className={cn(
          "border rounded-lg group flex flex-col justify-between gap-4",
          "hover:bg-accent transition-all"
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="h-64 w-full overflow-hidden relative rounded-t-md border-b flex items-center justify-center">
            {imageProps ? (
              <Image
                className={cn(
                  "h-full w-full object-cover",
                  "transition-transform duration-300 ease-in-out group-hover:scale-110"
                )}
                src={imageProps?.src}
                alt={item.image.alt || `image of ${item.name}`}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33.33vw, 25vw"
                {...(imageBlurDataURL && {
                  placeholder: "blur",
                  blurDataURL: imageBlurDataURL
                })}
              />
            ) : (
              <div
                className={cn(
                  "h-48 w-full overflow-hidden relative rounded-t-md bg-muted flex items-center justify-center",
                )}>
                <span className={cn(
                  "w-16 h-16 text-muted-foreground"
                )}>
                  <ImageIcon className="w-16 h-16" />
                </span>
              </div>
            )
            }
          </div>
          <div className="px-4 text-xl text-primary font-medium transition-all" >
            <p>{item.name}</p>
          </div>
          <div className="px-4 text-sm text-muted-foreground line-clamp-2">
            <p>{item.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <hr />
          <div className="px-4 pb-4 flex justify-between items-center text-sm">
            <p className="font-medium">
              {item?.categories?.[0]?.name}
            </p>

            <time className="text-muted-foreground">
              {date}
            </time>
          </div>
        </div>
      </Link> */}
    </>
  );
}