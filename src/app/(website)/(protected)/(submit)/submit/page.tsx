import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
import { SubmitStepper } from "@/components/submit/submit-stepper";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, tagListQuery } from "@/sanity/lib/queries";
import { SubmitForm } from "@/components/submit/submit-form";
import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
  title: "Submit your product (1/3)",
  description: "Submit your product (1/3) – Enter product details.",
  canonicalUrl: `${siteConfig.url}/submit`,
});

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
    <div>
      <DashboardSubmitHeader
        title="1/3 Submit"
        subtitle="Enter product details."
      >
        <SubmitStepper initialStep={1} />
      </DashboardSubmitHeader>

      <div className="mt-8">
        <SubmitForm tagList={tagList} categoryList={categoryList} />
      </div>
    </div>
  );
}
