"use client";

import { urlForIcon } from "@/lib/image";
import { cn, getItemTargetLinkInWebsite } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

type SponsorItemCardProps = {
  item: ItemInfo;
};

/**
 * SponsorItemCard shows item icon
 */
export default function SponsorItemCard({ item }: SponsorItemCardProps) {
  const iconProps = item?.icon ? urlForIcon(item.icon) : null;
  const iconBlurDataURL = item?.icon?.blurDataURL || null;
  // console.log(`SponsorItemCard, iconBlurDataURL:${iconBlurDataURL}`);
  const itemLink = getItemTargetLinkInWebsite(item);

  return (
    <div
      className={cn(
        "border rounded-lg flex flex-col justify-between p-6",
        "duration-300 shadow-sm hover:shadow-md transition-shadow",
        item.sponsor
          ? "border-sky-300 border-spacing-1.5 bg-sky-50/50 dark:bg-sky-950/10 hover:bg-sky-50 dark:hover:bg-accent/60"
          : "hover:bg-accent/60 transition-colors duration-300",
      )}
    >
      {/* top */}
      <div className="flex flex-col gap-4">
        {/* icon + name */}
        <div className="flex w-full items-center gap-4">
          {iconProps && (
            <Image
              src={iconProps?.src}
              alt={item.icon.alt || `icon of ${item.name}`}
              title={item.icon.alt || `icon of ${item.name}`}
              width={32}
              height={32}
              className="object-cover image-scale rounded-md"
              {...(iconBlurDataURL && {
                placeholder: "blur",
                blurDataURL: iconBlurDataURL,
              })}
            />
          )}

          <Link
            href={`${itemLink}`}
            className="flex-1 flex justify-between items-center"
          >
            <h3
              className={cn(
                "flex-1 text-xl font-medium line-clamp-1 flex items-center gap-2",
                item.featured && "text-gradient_indigo-purple font-semibold",
              )}
            >
              {item.name}
            </h3>

            <span className="text-sm text-sky-500 border border-sky-500 rounded-md px-2 py-0.5">
              AD
            </span>
          </Link>
        </div>

        {/* categories */}
        {/* <div className="flex flex-col gap-2">
          {item.categories && item.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              {item.categories.map((category, index) => (
                <a
                  key={category._id}
                  href={`/category/${category.slug.current}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "px-2 py-1 h-6 rounded-md",
                  )}
                >
                  <span className="text-sm text-muted-foreground">
                    {category.name}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div> */}

        {/* min-h-[4.5rem] is used for making sure height of the card is the same */}
        <Link href={`${itemLink}`} className="mt-4 block cursor-pointer">
          <p className="text-sm line-clamp-3 leading-relaxed min-h-[4.5rem]">
            {item.description}
          </p>
        </Link>
      </div>

      {/* bottom */}
      <div className="mt-4 w-full flex justify-center items-center">
        {/* {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {item.tags.slice(0, 5).map((tag, index) => (
              <Link
                key={tag._id}
                href={`/tag/${tag.slug.current}`}
                className="flex items-center justify-center space-x-0.5 group"
              >
                <HashIcon className="w-3 h-3 text-muted-foreground icon-scale" />
                <span className="text-sm text-muted-foreground link-underline">
                  {tag.name}
                </span>
              </Link>
            ))}
            {item.tags.length > 5 && (
              <span className="text-sm text-muted-foreground px-1">
                +{item.tags.length - 5}
              </span>
            )}
          </div>
        )} */}

        {/* action button */}
        <Button
          size="lg"
          variant="outline"
          className={cn(
            "overflow-hidden rounded-full w-full border-sky-300 bg-transparent hover:bg-transparent",
            "group transition-transform duration-300 ease-in-out hover:scale-105",
          )}
        >
          <Link
            href={itemLink}
            className="flex items-center justify-center gap-2"
          >
            <span className="text-sky-500 font-semibold">Visit Website</span>
            <ArrowUpRightIcon className="text-sky-500 font-semibold size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
