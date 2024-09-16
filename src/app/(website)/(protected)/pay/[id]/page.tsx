import { PricingCards } from "@/components/dashboard/pricing-cards";
import { currentUser } from "@/lib/auth";
import { getUserPricePlan } from "@/lib/payment";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SubmitStepper } from "../../submit/submit-stepper";

export default async function PayPage({ params }: { params: { id: string } }) {
  const user = await currentUser();

  let userPricePlan;
  if (user && user.id && user.role === "USER") {
    userPricePlan = await getUserPricePlan(user.id);
  } else {
    redirect("/auth/login");
  }
  console.log('PayPage, userPricePlan:', userPricePlan);

  const { id } = params;
  console.log('PayPage, itemId:', id);

  return (
    <>
      {/* <DashboardHeader
        title="Pay"
        subtitle="Pay for your submission."
      /> */}

      <SubmitStepper initialStep={2} />

      <div className="mt-6">
        <PricingCards userId={user.id} itemId={id}
          userPricePlan={userPricePlan} />
      </div>
    </>
  );
}
