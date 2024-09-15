import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, itemByIdQuery, itemQuery, tagListQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UpdateForm } from "./update-form";
import { DashboardHeader } from "@/components/dashboard/header";

interface UpdatePageProps {
  params: { slug: string };
};

export default async function UpdatePage({ params }: UpdatePageProps) {
  const [item, categoryList, tagList] = await Promise.all([
    sanityFetch<ItemFullInfo>({
      query: itemByIdQuery,
      params: { id: params.slug }
    }),
    sanityFetch<CategoryListQueryResult>({
      query: categoryListQuery
    }),
    sanityFetch<TagListQueryResult>({
      query: tagListQuery
    })
  ]);

  if (!item) {
    console.error("UpdatePage, item not found");
    return notFound();
  }

  return (
    <>
      <DashboardHeader
        heading="Update"
        text="Update your product info."
      />

      <div className="mt-4">
        <Suspense fallback={null}>
          <UpdateForm item={item} tagList={tagList} categoryList={categoryList} />
        </Suspense>
      </div>
    </>
  );
}
