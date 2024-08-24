"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, urlForImageWithSize } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { format, parseISO } from "date-fns";

type ItemCardProps = {
  item: ItemInfo;
};

export default async function ItemCard({ item }: ItemCardProps) {
  const imageUrl = urlForImageWithSize(item.image, 960, 540);
  const date = new Date(item.publishDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  // const date = format(parseISO(item.publishDate), "yyyy/MM/dd");
  const category = item.categories[0];
  // .name.find((kv) => kv._key === 'en')?.value || 'No Category';

  return (
    <Link
      href={`/item/${item.slug.current}`}
      className={cn(
        "border rounded-lg group flex flex-col justify-between not-prose gap-8",
        "hover:bg-accent transition-all"
      )}
    >
      {/* top */}
      <div className="flex flex-col gap-4">
        <div className="h-48 w-full overflow-hidden relative rounded-t-md border-b flex items-center justify-center">
          <Image
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            src={imageUrl}
            alt={item.name?.find(entry => entry._key === "en")?.value ?? ""}
            width={480}
            height={270}
          />
        </div>
        <div className="px-4 text-xl text-primary font-medium transition-all" >
          <p>{item.name?.find(entry => entry._key === "en")?.value || 'No Name'}</p>
        </div>
        <div className="px-4 text-sm text-muted-foreground line-clamp-3">
          <p>{item.description?.find(entry => entry._key === "en")?.value}</p>
        </div>
      </div>

      {/* bottom */}
      <div className="flex flex-col gap-4">
        <hr />
        <div className="px-4 pb-4 flex justify-between items-center text-xs">
          <p>{category.name?.find(entry => entry._key === "en")?.value || 'No Category'}</p>
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
}