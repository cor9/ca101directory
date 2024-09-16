// TODO: Fix this when we turn strict mode on. // @ts-nocheck
import { PRICE_PLANS } from "@/config/pricing-plan";
import { sanityClient } from "@/sanity/lib/client";
import { UserPricePlan } from "@/types";

export async function getUserPricePlan(
  userId: string
): Promise<UserPricePlan> {
  if(!userId) {
    throw new Error("Missing parameters");
  }

  const user = await sanityClient.fetch(`*[_type == "user" && _id == "${userId}"][0]`);
  if (!user) {
    throw new Error("User not found");
  } else {
    console.log('getUserPricePlan, userId:', user._id);
  }

  // user.stripeCurrentPeriodEnd is a string like "2024-03-15T00:00:00Z"
  // convert user.stripeCurrentPeriodEnd to timestamp (number)
  // const stripeCurrentPeriodEndTime = new Date(user.stripeCurrentPeriodEnd).getTime();

  // Check if user is on a paid plan. 86_400_000 means 24 hours
  // const isPaid =
  //   user.stripePriceId &&
  //   stripeCurrentPeriodEndTime + 86_400_000 > Date.now() ? true : false;

  const isPaid = user.stripePriceId ? true : false;

  // Find the pricing data corresponding to the user's plan
  const userPlan = PRICE_PLANS.find((plan) => plan.stripePriceId === user.stripePriceId);

  const plan = isPaid && userPlan ? userPlan : PRICE_PLANS[0];

  // const interval = isPaid
  //   ? userPlan?.stripeIds.monthly === user.stripePriceId
  //     ? "month"
  //     : userPlan?.stripeIds.yearly === user.stripePriceId
  //     ? "year"
  //     : null
  //   : null;

  let isCanceled = false;
  // if (isPaid && user.stripeSubscriptionId) {
  //   const stripePlan = await stripe.subscriptions.retrieve(
  //     user.stripeSubscriptionId
  //   );
  //   isCanceled = stripePlan.cancel_at_period_end;
  // }

  return {
    ...plan,
    ...user,
    // stripeCurrentPeriodEnd: stripeCurrentPeriodEndTime,
    isPaid,
    // interval,
    isCanceled
  }
}
