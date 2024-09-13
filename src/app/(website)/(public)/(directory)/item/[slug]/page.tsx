import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ItemFullInfo } from "@/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { CustomMdx } from "@/components/custom-mdx";
import { getLocaleDate, urlForImageWithSize } from "@/lib/utils";
import ItemCustomMdx from "./item-custom-mdx";
import Container from "@/components/shared/container";
import BackButton from "@/components/shared/back-button";
import ItemBreadCrumb from "@/components/item-bread-crumb";

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
    <div className="mt-8 flex flex-col lg:flex-row gap-16">
      <div className="lg:w-2/3 space-y-8">
        <div className="space-y-8">
          <ItemBreadCrumb item={item} />

          <div className="flex items-center space-x-4">
            {/* maybe put logo here */}
            <div className="flex flex-col space-y-8">
              <h1 className="text-4xl font-bold">
                {item.name}
              </h1>
              <p className="text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>

          <ul className="flex flex-wrap gap-4">
            {item.tags?.map((tag: any) => (
              <li key={tag._id}>
                <Link href={`/blog/${tag.slug.current}`}
                  className="text-sm hover:underline underline-offset-4">
                  #{tag.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            <Button size="lg" asChild>
              <Link href={item.link}>View Website</Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href={item.link}>Add to favorites</Link>
            </Button>
          </div>

          {/* <Image
            src={urlForImageWithSize(item.image, 960, 540)}
            alt={`${item.name} screenshot`}
            width={800}
            height={400}
            className="rounded-lg w-full mt-8"
          /> */}
        </div>

        <div className="border rounded-lg p-6">
          <ItemCustomMdx source={item.introduction} />
        </div>

        <div className="flex items-center justify-start my-8">
          <BackButton />
        </div>
      </div>

      <div className="lg:w-1/3">
        <div className="space-y-4 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:flex lg:flex-col">

          {/* image */}
          <div className="relative group overflow-hidden rounded-lg">
            <Link href={`${item.link}`} target="_blank" prefetch={false}>
              <Image
                width={480}
                height={270}
                alt={`${item.name}`}
                title={`${item.name}`}
                className="rounded-lg border w-full 
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

          {/* details */}
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">
                  Website
                </span>
                <Link href={item.link} target="_blank" prefetch={false}
                  className="font-medium hover:underline underline-offset-4">
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
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <ul className="flex flex-wrap gap-4">
              {item.categories?.map((category: any) => (
                <li key={category._id}>
                  <Link href={`/blog/${category.slug.current}`}
                    className="text-sm hover:underline underline-offset-4">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* tags */}
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <ul className="flex flex-wrap gap-4">
              {item.tags?.map((tag: any) => (
                <li key={tag._id}>
                  <Link href={`/blog/${tag.slug.current}`}
                    className="text-sm hover:underline underline-offset-4">
                    #{tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

