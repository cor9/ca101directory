import { PublishButton } from "@/components/forms/publish-button";
import { SubmitStepper } from "@/components/submit/submit-stepper";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { notFound } from "next/navigation";

export default async function PublishPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log('PublishPage, itemId:', id);
  const item = await sanityFetch<ItemFullInfo>({
    query: itemByIdQuery,
    params: { id: id }
  });

  if (!item) {
    console.error("PublishPage, item not found");
    return notFound();
  }
  // console.log('PublishPage, item:', item);

  return (
    <>
      {/* <DashboardHeader
        title="Publish"
        subtitle="Select a price plan."
      /> */}

      <SubmitStepper initialStep={3} />

      <div className="mt-6">
        <div className="flex justify-center items-center">
          <PublishButton item={item} />
        </div>
      </div>
    </>
  );
}
