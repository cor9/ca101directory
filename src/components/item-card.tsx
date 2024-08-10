"use client";

import Image from 'next/image';
import { cn, urlForImageWithSize } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

type ItemCardProps = {
    item: ItemInfo;
};

export default function ItemCard({ item }: ItemCardProps) {
    const router = useRouter();
    const imageUrl = urlForImageWithSize(item.image, 960, 540);

    return (
        <div
            key={item._id}
            className="group w-full shadow-medium hover:shadow-large transition-all bg-primary-100 rounded-md overflow-hidden cursor-pointer"
            onClick={() => {
                router.push(`/item/${item.slug?.current}`);
            }}
        >
            <Image
                width={480} height={270}
                alt={item.name.find(entry => entry._key === "en")?.value ?? "No Name"}
                className="rounded-t-lg w-full"
                src={imageUrl} />
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div
                        className={cn(
                            "flex items-center text-primary-800 font-semibold gap-2 relative",
                            "after:content-[' '] after:overflow-hidden after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:bg-primary-900 after:w-0 group-hover:after:w-full after:transition-width"
                        )}
                    >
                        <h3 className="text-lg">
                            {item.name.find(entry => entry._key === "en")?.value}
                        </h3>
                        <ExternalLink size={16} />
                    </div>
                    {/* {site.voteCount > 0 && (
                        <div className="flex items-center text-primary-500 gap-1">
                            <ThumbsUpIcon size={13} />
                            <span className="text-sm">{site.voteCount}</span>
                        </div>
                    )} */}
                </div>
                <div className="mt-2 text-primary-400 text-sm overflow-hidden text-ellipsis line-clamp-2">
                    {item.description?.find(entry => entry._key === "en")?.value}
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {item.categories?.slice(0, 1)?.map((category, index) => (
                            <span
                                key={index}
                                className="text-tiny font-medium py-[1px] px-2 rounded-[4px] bg-primary-700 text-primary-200 inline-block"
                            >
                                {category._key}
                            </span>
                        ))}
                    </div>
                    <span className="text-primary-600 text-nowrap text-tiny font-medium">
                        {/* {site.pricingType} */}
                        pricingType
                    </span>
                </div>
            </div>
        </div>
    );
}