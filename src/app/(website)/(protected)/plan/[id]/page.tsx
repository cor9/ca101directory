import { PricingCards } from "@/components/dashboard/pricing-cards";
import { SubmitStepper } from "@/components/submit/submit-stepper";
import { currentUser } from "@/lib/auth";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { notFound, redirect } from "next/navigation";

export default async function PlanPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) {
    return redirect("/auth/login");
  }

  // let userPricePlan;
  // if (user && user.id && user.role === "USER") {
  //   userPricePlan = await getUserPricePlan(user.id);
  // } else { // TODO: when user is admin???
  //   redirect("/auth/login");
  // }
  // console.log('PlanPage, userPricePlan:', userPricePlan);

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

  console.log('PlanPage, item:', item);

  return (
    <>
      {/* <DashboardHeader
        title="Pay"
        subtitle="Pay for your submission."
      /> */}

      <SubmitStepper initialStep={2} />

      <div className="mt-6 flex justify-center items-center">
        <PricingCards item={item} />
      </div>
    </>
  );
}
