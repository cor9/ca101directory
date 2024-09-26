import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
import { PricingPlans } from "@/components/dashboard/pricing-plans";
import { SubmitStepper } from "@/components/submit/submit-stepper";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import { ItemInfo } from "@/types";
import { notFound } from "next/navigation";

export default async function PlanPage({ params }: { params: { id: string } }) {
  // TODO: add user check, if user is not logged in, redirect to login page
  // if use not the submitter, shows error message
  // const user = await currentUser();
  // if (!user) {
  //   return redirect("/auth/login");
  // }

  // TODO: add item status check, if item is paid, redirect to dashboard

  const { id } = params;
  console.log('PlanPage, itemId:', id);
  const item = await sanityFetch<ItemInfo>({
    query: itemByIdQuery,
    params: { id: id },
    disableCache: true,
  });

  if (!item) {
    console.error("PlanPage, item not found");
    return notFound();
  }
  // console.log('PlanPage, item:', item);

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-32rem)] justify-center">
        <DashboardSubmitHeader
          title="Submit"
          subtitle="(2/3) Choose pricing plan."
        >
          <SubmitStepper initialStep={2} />
        </DashboardSubmitHeader>

        <div className="mt-8 flex-grow flex items-center">
          <div className="w-full sm:px-16 md:px-0 max-w-4xl mx-auto">
            <PricingPlans item={item} />
          </div>
        </div>
      </div>
    </>
  );
}
