"use client";

import { cn, getLocaleDate, urlForImageWithSize } from "@/lib/utils";
import { ItemInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";

type ItemCardProps = {
  item: ItemInfo;
};

export default function ItemCard({ item }: ItemCardProps) {
  const imageUrl = urlForImageWithSize(item.image, 960, 540);
  const publishDate = item.publishDate || item._createdAt;
  const date = getLocaleDate(publishDate);

  return (
    <Link
      href={`/item/${item.slug.current}`}
      className={cn(
        "border rounded-lg group flex flex-col justify-between gap-8",
        "hover:bg-accent transition-all"
      )}
    >
      {/* top */}
      <div className="flex flex-col gap-4">
        <div className="h-48 w-full overflow-hidden relative rounded-t-md border-b flex items-center justify-center">
          <Image
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            src={imageUrl}
            alt={`image of ${item.name}`}
            width={480}
            height={270}
          />
        </div>
        <div className="px-4 text-xl text-primary font-medium font-serif transition-all" >
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
  );
}