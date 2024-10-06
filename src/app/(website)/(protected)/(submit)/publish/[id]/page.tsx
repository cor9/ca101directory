import SubmissionCardInPublishPage from "@/components/publish/submission-card-in-publish-page";
import ConfettiEffect from "@/components/shared/confetti-effect";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import { ItemInfo } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  return constructMetadata({
    title: "Submit your product (3/3)",
    description: "Submit your product (3/3) Review and publish product",
    canonicalUrl: `${siteConfig.url}/publish/${params.id}`,
  });
}

export default async function PublishPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  const { pay } = searchParams as { [key: string]: string };
  const showConfetti = pay === 'success';
  // console.log('PublishPage, itemId:', id);
  const item = await sanityFetch<ItemInfo>({
    query: itemByIdQuery,
    params: { id: id },
    disableCache: true,
  });

  if (!item) {
    console.error("PublishPage, item not found");
    return notFound();
  }
  // console.log('PublishPage, item:', item);

  // TODO: check status, if status is not 'approved', redirect to edit page
  // if (item.pricePlan === 'free' && item.freePlanStatus !== 'approved') {
  //   return redirect(`/edit/${item._id}`);
  // } else if (item.pricePlan === 'pro' && item.proPlanStatus !== 'success') {
  //   return redirect(`/plan/${item._id}`);
  // }

  return (
    <div>
      {showConfetti && <ConfettiEffect />}
      
      <SubmissionCardInPublishPage item={item} />
    </div>
  );
}
