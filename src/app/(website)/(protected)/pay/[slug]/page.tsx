import { PricingCards } from "@/components/dashboard/pricing-cards";
import { currentUser } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SubmitStepper } from "../../submit/submit-stepper";
import { pricingData } from "@/config/pricing";


export default async function PayPage() {
  const user = await currentUser();

  let userSubscriptionPlan;
  if (user && user.id && user.role === "USER") {
    // userSubscriptionPlan = await getUserSubscriptionPlan(user.id);
    userSubscriptionPlan = pricingData[0];
  } else {
    redirect("/auth/login");
  }

  return (
    <>
      {/* <DashboardHeader
        title="Pay"
        subtitle="Pay for your submission."
      /> */}

      <SubmitStepper initialStep={2} />

      <div className="mt-6">
        <Suspense fallback={null}>
          {/* <PricingCards userId={user.id} subscriptionPlan={userSubscriptionPlan} /> */}
          <PricingCards userId={user.id} pricePlan={userSubscriptionPlan} />
        </Suspense>
      </div>
    </>
  );
}
