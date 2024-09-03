"use client";

import { urlForImage } from "@/lib/image";
import { cn, getLocaleDate, urlForImageWithSize } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ItemCardProps = {
  item: ItemInfo;
};

export default function ItemCard({ item }: ItemCardProps) {
  // const imageUrl = urlForImageWithSize(item.image, 960, 540);
  const imageProps = item?.image
    ? urlForImage(item.image)
    : null;
  // const imageProps = null; // for testing
  const publishDate = item.publishDate || item._createdAt;
  const date = getLocaleDate(publishDate);

  return (
    <>
      {/* bg-muted is used when imageProps is null */}

      <Link
        href={`/item/${item.slug.current}`}
        className={cn(
          "border rounded-lg group flex flex-col justify-between gap-4",
          "hover:bg-accent transition-all"
        )}
      >
        {/* top */}
        <div className="flex flex-col gap-4">
          <div className="h-64 sm:h-56 lg:h-48 w-full overflow-hidden relative rounded-t-md border-b flex items-center justify-center">
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
              />
            ) : (
              // show image icon when no image is found
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
          <div className="px-4 text-sm text-muted-foreground line-clamp-3">
            <p>{item.description}</p>
          </div>
        </div>

        {/* bottom */}
        <div className="flex flex-col gap-4">
          <hr />
          <div className="px-4 pb-4 flex justify-between items-center text-xs">
            <p className="font-medium">
              {item?.categories?.[0]?.name}
            </p>

            <time className="text-muted-foreground">
              {date}
            </time>
          </div>
        </div>
      </Link>
    </>
  );
}