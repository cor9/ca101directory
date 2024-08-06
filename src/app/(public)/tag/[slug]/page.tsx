import { sanityFetch } from "@/sanity/lib/fetch";
import { tagQuery } from "@/sanity/lib/queries";
import { TagQueryResult } from "@/sanity.types";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function TagPage({ params }: Props) {
  const slug = params.slug;
  const tag = await sanityFetch<TagQueryResult>({
    query: tagQuery,
    params: { slug }
  });
  if (!tag) {
    return notFound();
  }
  console.log('TagPage, tag:', tag);

  return (
    <div>
      <Link href={`/item`} className="block">Item List</Link>
      <Link href={`/tag`} className="block">Tag List</Link>
      <Link href={`/category`} className="block">Category List</Link>
      {tag.name?.find(kv => kv._key === "en")?.value}
      {tag.description?.find(kv => kv._key === "en")?.value}
    </div>
  );
}
