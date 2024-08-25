import ItemDetailClient from "@/components/item-detail-client";
import ItemHeaderClient from "@/components/item-header-client";
import { PortableText } from "@/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function ItemPage({ params }: Props) {
  const slug = params.slug;
  const item = await sanityFetch<ItemFullInfo>({
    query: itemQuery,
    params: { slug }
  });
  if (!item) {
    return notFound();
  }
  console.log('ItemPage, item:', item);

  return (
    <>
      <div className="space-y-8">
        {/* item info */}
        <ItemHeaderClient item={item} />

        <div className="grid gap-8 md:grid-cols-12">
          <div className="order-2 md:order-1 md:col-span-6 lg:col-span-7 flex flex-col gap-4">
            {/* introduction */}
            <h2 className="text-xl font-semibold mb-4">
              Introduction
            </h2>

            {/* description */}
            <p className="text-base text-muted-foreground leading-loose">
              {item.description}
            </p>

            <div className="mt-4 prose prose-violet prose-a:text-violet-500 max-w-none prose-pre:bg-slate-100 prose-pre:text-slate-700 prose-headings:scroll-m-20">
              {item.body && <PortableText value={item.body} />}
            </div>
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
