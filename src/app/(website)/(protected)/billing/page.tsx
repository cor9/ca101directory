import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { currentUser } from "@/lib/auth";
import { AlertTriangleIcon } from "lucide-react";
import { redirect } from "next/navigation";

// export const metadata = constructMetadata({
//   title: "Billing",
//   description: "Manage billing and your subscription plan.",
// });

export default async function BillingPage() {
  const user = await currentUser();

  // let userSubscriptionPlan;
  if (user && user.id && user.role === "USER") {
    // userSubscriptionPlan = await getUserSubscriptionPlan(user.id);
  } else {
    redirect("/auth/login");
  }

  return (
    <div>
      <DashboardHeader
        title="Billing"
        subtitle="Manage your billings."
      />
      <div className="mt-6 grid gap-8">
        <Alert className="!pl-14">
          <AlertTriangleIcon />
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
        </Alert>
        {/* <BillingInfo userSubscriptionPlan={userSubscriptionPlan} /> */}
      </div>
    </div>
  );
}
