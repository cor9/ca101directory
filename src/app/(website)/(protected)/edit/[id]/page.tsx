import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { constructMetadata } from "@/lib/metadata";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, itemFullInfoByIdQuery, tagListQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EditForm } from "./edit-form";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  return constructMetadata({
    title: "Edit",
    description: "Edit product information",
    canonicalUrl: `${siteConfig.url}/edit/${params.slug}`,
  });
}

interface EditPageProps {
  params: { id: string };
};

export default async function EditPage({ params }: EditPageProps) {
  const [item, categoryList, tagList] = await Promise.all([
    sanityFetch<ItemFullInfo>({
      query: itemFullInfoByIdQuery,
      params: { id: params.id }
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

  return (
    <div>
      <div className="flex flex-col gap-6">
        <DashboardHeader
          title="Edit"
          subtitle="Update product info."
          showBackButton={true}
        />

        <div className="mt-4">
          <Suspense fallback={null}>
            <EditForm item={item} tagList={tagList} categoryList={categoryList} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
