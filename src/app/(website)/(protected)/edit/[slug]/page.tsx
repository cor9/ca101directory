import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProPlanButton } from "@/components/forms/pro-plan-button";
import { PRICE_PLANS } from "@/config/pricing-plan";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, itemByIdQuery, tagListQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EditForm } from "./edit-form";

interface EditPageProps {
  params: { slug: string };
};

export default async function EditPage({ params }: EditPageProps) {
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
    console.error("EditPage, item not found");
    return notFound();
  }

  const pricePlan = PRICE_PLANS.find(plan => plan.title === 'Pro');

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* <DashboardBreadCrumb item={item} /> */}

        <DashboardHeader
          title="Edit"
          subtitle="Update your product info."
          showBackButton={true}
        >

          {
            item.pricePlan === 'free' ? (
              <>
                <ProPlanButton item={item} pricePlan={pricePlan} />
              </>
            ) : null
          }
        </DashboardHeader>

        <div className="mt-4">
          <Suspense fallback={null}>
            <EditForm item={item} tagList={tagList} categoryList={categoryList} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
