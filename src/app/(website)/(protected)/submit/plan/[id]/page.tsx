import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import DashboardPlanBreadCrumb from "@/components/dashboard/dashboard-plan-bread-crumb";
import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
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
      <div className="flex flex-col min-h-[calc(100vh-32rem)] justify-center">
        {/* <DashboardPlanBreadCrumb item={item} /> */}

        {/* <SubmitStepper initialStep={2} /> */}

        <DashboardSubmitHeader
          title="Submit"
          subtitle="Submit your product to get listed."
        >
          <SubmitStepper initialStep={2} />
        </DashboardSubmitHeader>

        <div className="mt-8 flex-grow flex items-center">
          {/* max-w-6xl mx-auto */}
          <div className="w-full">
            <PricingPlans item={item} />
          </div>
        </div>

      </div>

    </>
  );
}
