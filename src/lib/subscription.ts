// TODO: Fix this when we turn strict mode on. // @ts-nocheck
import { pricingData } from "@/config/subscriptions";
import { stripe } from "@/lib/stripe";
import { sanityClient } from "@/sanity/lib/client";
import { UserSubscriptionPlan } from "@/types";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  if(!userId) {
    throw new Error("Missing parameters");
  }

  // const user = await prisma.user.findFirst({
  //   where: {
  //     id: userId,
  //   },
  //   select: {
  //     stripeSubscriptionId: true,
  //     stripeCurrentPeriodEnd: true,
  //     stripeCustomerId: true,
  //     stripePriceId: true,
  //   },
  // });

  // change query from Prisma to Sanity
  // TODO: what if there is no user?
  const user = await sanityClient.fetch(`*[_type == "user" && _id == "${userId}"][0]`);

  if (!user) {
    throw new Error("User not found");
  } else {
    console.log('getUserSubscriptionPlan, userId:', user._id);
  }

  // user.stripeCurrentPeriodEnd is a string like "2024-03-15T00:00:00Z"
  // convert user.stripeCurrentPeriodEnd to timestamp (number)
  const stripeCurrentPeriodEndTime = new Date(user.stripeCurrentPeriodEnd).getTime();

  // Check if user is on a paid plan. 86_400_000 means 24 hours
  const isPaid =
    user.stripePriceId &&
    stripeCurrentPeriodEndTime + 86_400_000 > Date.now() ? true : false;

  // Find the pricing data corresponding to the user's plan
  const userPlan =
    pricingData.find((plan) => plan.stripeIds.monthly === user.stripePriceId) ||
    pricingData.find((plan) => plan.stripeIds.yearly === user.stripePriceId);

  const plan = isPaid && userPlan ? userPlan : pricingData[0];

  const interval = isPaid
    ? userPlan?.stripeIds.monthly === user.stripePriceId
      ? "month"
      : userPlan?.stripeIds.yearly === user.stripePriceId
      ? "year"
      : null
    : null;

  let isCanceled = false;
  if (isPaid && user.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: stripeCurrentPeriodEndTime,
    isPaid,
    interval,
    isCanceled
  }
}
