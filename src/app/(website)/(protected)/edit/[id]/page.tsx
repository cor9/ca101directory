import { EditForm } from "@/components/edit/edit-form";
import { siteConfig } from "@/config/site";
import { useCurrentUser } from "@/hooks/use-current-user";
import { constructMetadata } from "@/lib/metadata";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, itemFullInfoByIdQuery, tagListQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  return constructMetadata({
    title: "Edit product information",
    description: "Edit product information",
    canonicalUrl: `${siteConfig.url}/edit/${params.id}`,
  });
}

interface EditPageProps {
  params: { id: string };
};

export default async function EditPage({ params }: EditPageProps) {
  const user = useCurrentUser();
  if (!user) {
    return { status: "error", message: "Unauthorized" };
  }

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
  // redirect to dashboard if the item is not submitted by the user
  if (item.submitter._id != user.id) {
    console.error("EditPage, user not match");
    return redirect("/dashboard");
  }

  return (
    <EditForm item={item} tagList={tagList} categoryList={categoryList} />
  );
}
