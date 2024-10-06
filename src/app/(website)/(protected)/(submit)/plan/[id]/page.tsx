import { PricingPlans } from "@/components/dashboard/pricing-plans";
import SubmissionCardInPlanPage from "@/components/plan/submission-card-in-plan-page";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    title: "Submit your product (2/3)",
    description: "Submit your product (2/3) Choose pricing plan",
    canonicalUrl: `${siteConfig.url}/plan/${params.id}`,
  });
}

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
    <Card className="flex flex-col items-center">
      <div className="w-full p-4">
        <SubmissionCardInPlanPage item={item} />
      </div>

      <Separator className="w-full" />

      {/* sm:px-16 md:px-0 max-w-4xl mx-auto */}
      <div className="w-full p-4 my-4">
        <PricingPlans item={item} />
      </div>
    </Card>
  );
}
