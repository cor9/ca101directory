import { DashboardHeader } from "@/components/dashboard/header";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { Icons } from "@/components/shared/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { currentUser } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Billing",
  description: "Manage billing and your subscription plan.",
});

export default async function PayPage() {
  const user = await currentUser();

  let userSubscriptionPlan;
  if (user && user.id && user.role === "USER") {
    userSubscriptionPlan = await getUserSubscriptionPlan(user.id);
  } else {
    redirect("/auth/login");
  }

  return (
    <>
      <DashboardHeader
        heading="Pay"
        text="Pay for your submission."
      />
      <div className="grid gap-8">
        {/* <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription className="text-balance">
            SaaS Starter app is a demo app using a Stripe test environment. You
            can find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert> */}
        
        {/* <BillingInfo userSubscriptionPlan={userSubscriptionPlan} /> */}

        <PricingCards userId={user.id} subscriptionPlan={userSubscriptionPlan} />
      </div>
    </>
  );
}
