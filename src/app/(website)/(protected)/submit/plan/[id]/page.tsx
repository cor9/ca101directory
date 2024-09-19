import DashboardPlanBreadCrumb from "@/components/dashboard/dashboard-plan-bread-crumb";
import { PricingPlans } from "@/components/dashboard/pricing-plans";
import { SubmitStepper } from "@/components/submit/submit-stepper";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { notFound } from "next/navigation";

export default async function PlanPage({ params }: { params: { id: string } }) {
  // TODO: add user check, if user is not logged in, redirect to login page
  // if use not the submitter, shows error message
  // const user = await currentUser();
  // if (!user) {
  //   return redirect("/auth/login");
  // }

  const { id } = params;
  console.log('PlanPage, itemId:', id);
  const item = await sanityFetch<ItemFullInfo>({
    query: itemByIdQuery,
    params: { id: id }
  });

  if (!item) {
    console.error("PlanPage, item not found");
    return notFound();
  }
  // console.log('PlanPage, item:', item);

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* <DashboardPlanBreadCrumb item={item} /> */}

        {/* <DashboardHeader
          title="Plan"
          subtitle="Select a price plan."
        /> */}

        <SubmitStepper initialStep={2} />

        <div className="px-2 md:px-4 lg:px-8">
          <PricingPlans item={item} />
        </div>
      </div>
    </>
  );
}
