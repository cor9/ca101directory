import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
import { SubmitStepper } from "@/components/submit/submit-stepper";
import { Card } from "@/components/ui/card";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import { ItemInfo } from "@/types";
import { notFound } from "next/navigation";
import SubmissionCardInPublishPage from "./submission-card-in-publish-page";

export default async function PublishPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log('PublishPage, itemId:', id);
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
  //   return redirect(`/submit/plan/${item._id}`);
  // }

  return (
    <div className="flex flex-col min-h-[calc(100vh-32rem)] justify-center">
      <DashboardSubmitHeader
        title="(3/3) Submit"
        subtitle="Review and publish product."
      >
        <SubmitStepper initialStep={3} />
      </DashboardSubmitHeader>

      <Card className="mt-8 flex flex-col items-center w-full">
        <div className="w-full p-4">
          <SubmissionCardInPublishPage item={item} />
        </div>
      </Card>
    </div>
  );
}
