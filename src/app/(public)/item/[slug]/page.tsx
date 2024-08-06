import { sanityFetch } from "@/sanity/lib/fetch";
import { itemQuery } from "@/sanity/lib/queries";
import { ItemQueryResult } from "@/sanity.types";
import Link from "next/link";
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
      <Link href={`/item`} className="block">Item List</Link>
      <Link href={`/tag`} className="block">Tag List</Link>
      <Link href={`/category`} className="block">Category List</Link>
      {item.name?.find(kv => kv._key === "en")?.value}
      {item.description?.find(kv => kv._key === "en")?.value}
    </div>
  );
}
