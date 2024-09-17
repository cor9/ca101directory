import { SubmitStepper } from "@/components/submit/submit-stepper";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, tagListQuery } from "@/sanity/lib/queries";
import { SubmitForm } from "./submit-form";

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
      {/* <DashboardHeader
        title="Submit"
        subtitle="Submit your product to get listed."
      /> */}

      <SubmitStepper initialStep={1} />

      <div className="mt-8">
        <SubmitForm tagList={tagList} categoryList={categoryList} />
      </div>
    </>
  );
}
