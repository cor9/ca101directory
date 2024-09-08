import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, tagListQuery } from "@/sanity/lib/queries";
import { Suspense } from "react";
import { UpdateForm } from "./update-form";

export default async function UpdatePage() {
  const [categoryList, tagList] = await Promise.all([
    sanityFetch<CategoryListQueryResult>({
      query: categoryListQuery
    }),
    sanityFetch<TagListQueryResult>({
      query: tagListQuery
    })
  ]);

  return (
    <>
      {/* <DashboardHeader
        heading="Update"
        text="Update your product info."
      /> */}

      <div className="divide-y divide-muted pb-10">
        <Suspense fallback={null}>
          <UpdateForm tagList={tagList} categoryList={categoryList} />
        </Suspense>
      </div>
    </>
  );
}
