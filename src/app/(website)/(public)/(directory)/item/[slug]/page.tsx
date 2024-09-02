import ItemDetailClient from "@/components/item-detail-client";
import ItemHeaderClient from "@/components/item-header-client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { notFound } from "next/navigation";
import { CustomMdx } from "@/components/custom-mdx";
import { cn } from "@/lib/utils";

interface ItemPageProps {
  params: { slug: string };
};

export default async function ItemPage({ params }: ItemPageProps) {
  const item = await sanityFetch<ItemFullInfo>({
    query: itemQuery,
    params: { slug: params.slug }
  });
  if (!item) {
    console.error("ItemPage, item not found");
    return notFound();
  }
  // console.log('ItemPage, item:', item);
  // console.log(`ItemPage, item.introduction:`, item.introduction);

  return (
    <>
      <div className="space-y-8">
        {/* item info */}
        <ItemHeaderClient item={item} />

        <div className="grid gap-8 md:grid-cols-12">
          <div className="order-2 md:order-1 md:col-span-6 lg:col-span-7 flex flex-col gap-4">
            {/* description */}
            <h2 className="text-xl font-semibold mb-4">
              Description
            </h2>

            <p className="text-base text-muted-foreground">
              {item.description}
            </p>

            {/* introduction */}
            <h2 className="text-xl font-semibold mb-4">
              Introduction
            </h2>

            <article className="mt-4">
              {item.introduction &&
                <CustomMdx source={item.introduction}
                  components={markdownComponents} />
              }
            </article>

          </div>

          <div className="order-3 md:order-2 md:col-span-1"></div>

          {/* details */}
          <div className='order-1 md:order-3 md:col-span-5 lg:col-span-4'>
            <ItemDetailClient item={item} />
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * submitters may use h1, h2, h3 to define the heading of introduction section,
 * but we use h4, h5, h6 to define the heading of introduction section,
 * so we need to map h1, h2, h3 to h4, h5, h6
 */
const markdownComponents = {
  h1: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold",
        className,
      )}
      {...props}
    />
  ),
};