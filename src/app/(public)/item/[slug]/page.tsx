import { sanityFetch } from "@/sanity/lib/fetch";
import { itemQuery } from "@/sanity/lib/queries";
import { ItemQueryResult } from "@sanity/types";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function ItemPage({ params }: Props) {
  const slug = params.slug;
  const item = await sanityFetch<ItemQueryResult>({
    query: itemQuery,
    params: { slug }
  });
  if (!item) {
    return notFound();
  }
  console.log('ItemPage, item:', item);

  return (
    <div>
      {item.name?.find(item => item._key === "en")?.value}
      {item.description?.find(item => item._key === "en")?.value}
    </div>
  );
}
