import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryQuery } from "@/sanity/lib/queries";
import { CategoryQueryResult } from "@/sanity.types";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function CategoryPage({ params }: Props) {
  const slug = params.slug;
  const category = await sanityFetch<CategoryQueryResult>({
    query: categoryQuery,
    params: { slug }
  });
  if (!category) {
    return notFound();
  }
  console.log('CategoryPage, category:', category);

  return (
    <div>
      <Link href={`/item`} className="block">Item List</Link>
      <Link href={`/tag`} className="block">Tag List</Link>
      <Link href={`/category`} className="block">Category List</Link>
      {category.name?.find(entry => entry._key === "en")?.value}
      {category.description?.find(entry => entry._key === "en")?.value}
    </div>
  );
}
