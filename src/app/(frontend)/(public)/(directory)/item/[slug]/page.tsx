import "@/styles/mdx.css";

import ItemDetailClient from "@/components/item-detail-client";
import ItemHeaderClient from "@/components/item-header-client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { notFound } from "next/navigation";
import { MdxRemoteClient } from "@/components/mdx-remote-client";

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
  // console.log('ItemPage, item:', item);
  // console.log(`ItemPage, item.content:`, item.content);
  // console.log(`ItemPage, item.mdContent:`, item.mdContent);
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

            {/* 由于我是自定义了组件，所有就没有使用tailwindcss的typography定义的样式，也就是prose那些 */}
            {/* 如果不自定义组件的话，那么就可以将 article className="prose" 这部分打开，效果其实也不错 */}
            {/* 为什么选择 React Markdown 而不是 next-remote-mdx，因为后者似乎不支持 table */}

            {/* https://github.com/tailwindlabs/tailwindcss-typography */}

            {/* <article className="prose prose-slate dark:prose-invert"> */}
            <article className="mt-4">
              {item.mdContent &&
                <MdxRemoteClient source={item.mdContent} />
              }
            </article>
            {/* </article> */}

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
