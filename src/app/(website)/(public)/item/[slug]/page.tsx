import ItemBreadCrumb from "@/components/item-bread-crumb";
import ItemCustomMdx from "@/components/item-custom-mdx";
import BackButton from "@/components/shared/back-button";
import { Button } from "@/components/ui/button";
import { getLocaleDate, urlForImageWithSize } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { GlobeIcon, HashIcon, HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ItemPageProps {
  params: { slug: string };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const item = await sanityFetch<ItemFullInfo>({
    query: itemQuery,
    params: { slug: params.slug }
  });

  if (!item) {
    console.error("ItemPage, item not found");
    return notFound();
  }

  const publishDate = item.publishDate || item._createdAt;
  const date = getLocaleDate(publishDate);

  return (
    <div className="flex flex-col gap-8">
      {/* Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-8 flex flex-col">
          {/* Basic information */}
          <div className="order-1 space-y-8">
            <ItemBreadCrumb item={item} />

            {/* name and description */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col space-y-8">
                <h1 className="text-4xl font-bold">
                  {item.name}
                </h1>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>

            {/* tags */}
            <div>
              <ul className="flex flex-wrap gap-2">
                {item.tags?.map((tag: any) => (
                  <li key={tag._id}>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/tag/${tag.slug.current}`}
                        // hover:underline underline-offset-4
                        className="text-sm flex items-center justify-center space-x-1 group">
                        <HashIcon className="w-3 h-3
                          transition-all duration-300 ease-in-out 
                          group-hover:scale-125" />
                        <span className="">{tag.name}</span>
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* action buttons */}
            <div className="flex flex-row gap-4">
              <Button size="lg" variant="default" asChild className="group flex-1">
                <Link href={item.link} className="flex items-center justify-center space-x-2">
                  <GlobeIcon className="w-4 h-4
                    transition-all duration-300 ease-in-out 
                    group-hover:scale-125" />
                  <span>Visit Website</span>
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild className="group flex-1">
                <Link href={item.link} className="flex items-center justify-center space-x-2">
                  <HeartIcon className="w-4 h-4
                    transition-transform duration-300 ease-in-out 
                    group-hover:scale-125" />
                  <span className="">Favorite</span>
                </Link>
              </Button>
            </div>

            {/* Detailed content */}
            {/* border rounded-lg p-6 */}
            <div className="order-3 ">
              <h2 className="text-xl font-semibold mb-4">Introduction</h2>
              <ItemCustomMdx source={item.introduction} />
            </div>

          </div>
        </div>

        {/* Right column */}
        <div className="order-2 lg:col-span-1 lg:order-none">
          {/* lg:sticky lg:top-24 */}
          <div className="flex flex-col space-y-8">

            {/* image */}
            <div className="relative group overflow-hidden rounded-lg">
              <Link href={`${item.link}`} target="_blank" prefetch={false}>
                <Image
                  width={360}
                  height={240}
                  alt={`${item.name}`}
                  title={`${item.name}`}
                  className="rounded-lg border w-full shadow-lg
                  transition-transform duration-300 group-hover:scale-105"
                  src={urlForImageWithSize(item.image, 960, 540)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black 
                bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                  <span className="text-white text-lg font-semibold 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Visit Website
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex flex-col space-y-4">

              {/* information */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Information</h2>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">
                      Website
                    </span>
                    <Link href={item.link} target="_blank" prefetch={false}
                      className="font-medium underline underline-offset-4">
                      {item.link}
                    </Link>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">
                      Added On
                    </span>
                    <span className="font-medium">
                      {date}
                    </span>
                  </li>
                </ul>
              </div>

              {/* categories */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <ul className="flex flex-wrap gap-4">
                  {item.categories?.map((category: any) => (
                    <li key={category._id}>
                      <Link href={`/category/${category.slug.current}`}
                        className="text-sm hover:underline underline-offset-4">
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* tags */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                <ul className="flex flex-wrap gap-4">
                  {item.tags?.map((tag: any) => (
                    <li key={tag._id}>
                      <Link href={`/tag/${tag.slug.current}`}
                        className="text-sm hover:underline underline-offset-4
                          flex items-center justify-center space-x-1 group">
                        <HashIcon className="w-3 h-3
                          transition-all duration-300 ease-in-out 
                          group-hover:scale-125" />
                        <span className="">{tag.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* back button */}
      <div className="flex items-center justify-start mt-8 order-4">
        <BackButton />
      </div>
    </div>
  );
}

