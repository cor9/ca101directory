import ItemBreadCrumb from "@/components/item/item-bread-crumb";
import ItemCustomMdx from "@/components/item/item-custom-mdx";
import ItemGrid from "@/components/item/item-grid";
import BackButton from "@/components/shared/back-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { urlForImage } from "@/lib/image";
import { constructMetadata } from "@/lib/metadata";
import { getLocaleDate } from "@/lib/utils";
import { ItemInfoBySlugQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemFullInfoBySlugQuery, itemInfoBySlugQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { GlobeIcon, HashIcon, LayoutGridIcon } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const item = await sanityFetch<ItemInfoBySlugQueryResult>({
    query: itemInfoBySlugQuery,
    params: { slug: params.slug }
  });
  if (!item) {
    console.warn(`generateMetadata, item not found for slug: ${params.slug}`);
    return;
  }

  const imageProps = item?.image
    ? urlForImage(item?.image)
    : null;

  return constructMetadata({
    title: `${item.name}`,
    description: item.description,
    canonicalUrl: `${siteConfig.url}/item/${params.slug}`,
    image: imageProps?.src
  });
}

interface ItemPageProps {
  params: { slug: string };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const item = await sanityFetch<ItemFullInfo>({
    query: itemFullInfoBySlugQuery,
    params: { slug: params.slug }
  });

  if (!item) {
    console.error("ItemPage, item not found");
    return notFound();
  }

  const imageProps = item?.image
    ? urlForImage(item?.image)
    : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  const publishDate = item.publishDate || item._createdAt;
  const date = getLocaleDate(publishDate);

  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 gap-8 flex flex-col">
          {/* Basic information */}
          <ItemBreadCrumb item={item} />

          {/* name and description */}
          <div className="flex flex-1 items-center">
            <div className="flex flex-col gap-8">
              <h1 className="text-4xl font-bold">
                {item.name}
              </h1>
              <p className="text-muted-foreground text-balance leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex gap-4">
            <Button size="lg" variant="default" asChild className="group">
              <Link href={item.link}
                target="_blank"
                prefetch={false}
                className="flex items-center justify-center space-x-2">
                <GlobeIcon className="w-4 h-4
                    transition-all duration-300 ease-in-out 
                    group-hover:scale-125" />
                <span>Visit Website</span>
              </Link>
            </Button>

            {/* <Button size="lg" variant="outline" asChild className="group">
              <Link href={item.link} className="flex items-center justify-center space-x-2">
                <HeartIcon className="w-4 h-4
                    transition-transform duration-300 ease-in-out 
                    group-hover:scale-125" />
                <span className="">Favorite</span>
              </Link>
            </Button> */}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          {/* image */}
          <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
            <Link href={`${item.link}`} target="_blank" prefetch={false}>
              {imageProps && (
                <Image
                  src={imageProps.src}
                  alt={item.image?.alt || `image for ${item.name}`}
                  loading="eager"
                  fill
                  className="border w-full shadow-lg object-cover image-scale"
                  {...(imageBlurDataURL && {
                    placeholder: "blur",
                    blurDataURL: imageBlurDataURL
                  })}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black 
                  bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Visit Website
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Detailed content */}
          <div className="bg-muted/50 rounded-lg p-6 mr-0 lg:mr-8">
            <h2 className="text-lg font-semibold mb-4">
              Introduction
            </h2>
            <ItemCustomMdx source={item.introduction} />
          </div>

          <div className="flex items-center justify-start mt-16">
            <BackButton />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-4">
              {/* information */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Information
                </h2>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">
                      Publisher
                    </span>
                    <div className="flex items-center gap-2">
                      <UserAvatar className="w-5 h-5"
                        name={item.submitter.name}
                        image={item.submitter.image} />

                      {
                        item.submitter.link && (
                          <Link href={item.submitter.link} target="_blank" prefetch={false}
                            className="font-medium link-underline">
                            {item.submitter.name}
                          </Link>
                        ) || (
                          <span>
                            {item.submitter.name}
                          </span>
                        )
                      }
                    </div>
                  </li>

                  <li className="flex justify-between">
                    <span className="text-muted-foreground">
                      Website
                    </span>
                    <Link href={item.link} target="_blank" prefetch={false}
                      className="font-medium link-underline">
                      {item.link}
                    </Link>
                  </li>

                  <li className="flex justify-between">
                    <span className="text-muted-foreground">
                      Published date
                    </span>
                    <span className="font-medium">
                      {date}
                    </span>
                  </li>
                </ul>
              </div>

              {/* categories */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Categories
                </h2>
                <ul className="flex flex-wrap gap-4">
                  {item.categories?.map((category: any) => (
                    <li key={category._id}>
                      <Link href={`/category/${category.slug.current}`}
                        className="text-sm link-underline">
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* tags */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Tags
                </h2>
                <ul className="flex flex-wrap gap-4">
                  {item.tags?.map((tag: any) => (
                    <li key={tag._id}>
                      <Link href={`/tag/${tag.slug.current}`}
                        className="text-sm link-underline
                          flex items-center justify-center space-x-0.5 group">
                        <HashIcon className="w-3 h-3 text-muted-foreground icon-scale" />
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

      {/* Footer section shows related items */}
      {
        item.related && item.related.length > 0 && (
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center gap-2">
              <LayoutGridIcon className="w-4 h-4" />
              <h2 className="text-lg font-semibold">
                More Related
              </h2>
            </div>

            <div className="mt-4">
              <ItemGrid items={item.related} />
            </div>
          </div>
        )
      }
    </div>
  );
}

