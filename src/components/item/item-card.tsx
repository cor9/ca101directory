"use client";

import { urlForImage } from "@/lib/image";
import { ItemInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { HashIcon } from "lucide-react";

type ItemCardProps = {
  item: ItemInfo;
};

export default function ItemCard({ item }: ItemCardProps) {
  const imageProps = item?.image ? urlForImage(item.image) : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  // console.log(`ItemCard, imageBlurDataURL:${imageBlurDataURL}`);
  const itemUrlPrefix = '/item';

  return (
    <div>
      <div className="cursor-pointer border rounded-lg flex flex-col justify-between gap-4 hover:bg-accent/60 transition-colors duration-300">
        {/* top */}
        <div className="flex flex-col gap-4">
          {/* Image container */}
          <div className="group overflow-hidden relative aspect-[16/9] rounded-t-md transition-all border-b">
            {imageProps && (
              <div>
                <Image
                  src={imageProps?.src}
                  alt={item.image.alt || `image of ${item.name}`}
                  fill
                  className="object-cover image-scale"
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
                  </div>
                </div>
              </div>
            )}

            {
              item.link ? (
                <Link href={item.link} prefetch={false} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black 
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

        {/* bottom */}
        <Link href={`${itemUrlPrefix}/${item.slug.current}`}
          className="flex flex-col gap-4 pb-4">
          <div className="px-4 flex flex-col gap-4">
            <h3 className="text-xl text-primary font-medium line-clamp-1">
              {item.name}
            </h3>
            <p className="text-sm text-primary line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          <Separator />

          <div className="px-4 flex justify-end items-center">
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                {item.tags.slice(0, 5).map((tag, index) => (
                  <div key={`tag-${index}`} className="flex items-center justify-center space-x-0.5 group">
                    <HashIcon className="w-3 h-3 text-muted-foreground icon-scale" />
                    <span className="text-sm text-primary/80">
                      {tag.name}
                    </span>
                  </div>
                ))}
                {item.tags.length > 5 && (
                  <span className="text-sm text-muted-foreground px-1">
                    +{item.tags.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </div >
    </div>
  );
}