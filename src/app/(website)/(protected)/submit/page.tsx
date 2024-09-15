import { DashboardHeader } from "@/components/dashboard/header";
import { SubmitForm } from "./submit-form";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, tagListQuery } from "@/sanity/lib/queries";
import { Suspense } from "react";

export default async function SubmitPage() {
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
      <DashboardHeader
        heading="Submit"
        text="Submit your product to get listed."
      />

      <div className="mt-6">
        <Suspense fallback={null}>
          <SubmitForm tagList={tagList} categoryList={categoryList} />
        </Suspense>
      </div>
    </>
  );
}
