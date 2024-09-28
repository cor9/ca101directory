"use client";

import { urlForImage } from "@/lib/image";
import { cn, getLocaleDate } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";

type ItemCardProps = {
  item: ItemInfo;
};

export default function ItemCard({ item }: ItemCardProps) {
  const imageProps = item?.image
    ? urlForImage(item.image)
    : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  // console.log(`ItemCard, imageBlurDataURL:${imageBlurDataURL}`);
  const publishDate = item.publishDate || item._createdAt;
  const date = getLocaleDate(publishDate);

  return (
    <>
      {/* bg-muted is used when imageProps is null */}
      <div className="cursor-pointer">
        <Link
          href={`/item/${item.slug.current}`}
          className={cn(
            "border rounded-lg flex flex-col justify-between gap-4",
            "hover:bg-accent transition-all"
          )}
        >
          {/* top */}
          <div className="flex flex-col gap-4">
            <div className="h-64 w-full group overflow-hidden relative rounded-t-md border-b flex items-center justify-center">
              {imageProps ? (
                <Image
                  className="object-cover image-scale"
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
                </div>
              </div>
            </div>
            <div className="px-4 text-xl text-primary font-medium transition-all" >
              <p>{item.name}</p>
            </div>
            <div className="px-4 text-sm text-muted-foreground line-clamp-2">
              <p>{item.description}</p>
            </div>
          </div>

          {/* bottom */}
          <div className="flex flex-col gap-4">
            <Separator />
            <div className="px-4 pb-4 flex justify-between items-center text-sm">
              {/* <p className="font-medium">
              {item?.categories?.[0]?.name}
            </p> */}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <span key={`tag-${index}`} className="text-sm px-2 py-1 rounded-md">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* <time className="text-muted-foreground">
              {date}
            </time> */}
            </div>
          </div>

        </Link>
      </div>
    </>
  );
}