"use server";

import { siteConfig } from "@/config/site";
import { sendSubmissionNotificationEmail } from "@/lib/mail";
import { FreePlanStatus, PricePlan } from "@/lib/submission";
import { getItemLinkInStudio } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";

export const submitToReview = async (itemId: string) => {
  console.log('submitToReview, itemId:', itemId);

  // TODO(javayhu): check if the item exists??? and check item is in submitting status
  // const item = await sanityFetch<Item>({ query: itemByIdQuery, params: { id: itemId } });
  // if (!item) {
  //   return { error: "Item not found!" };
  // }

  const result = await sanityClient.patch(itemId).set({
    pricePlan: PricePlan.FREE,
    freePlanStatus: FreePlanStatus.PENDING,
  }).commit();
  // console.log('submitToReview, result:', result);
  if (!result) {
    return { error: "Failed to submit item to review!" };
  }

  const itemLink = getItemLinkInStudio(itemId);
  sendSubmissionNotificationEmail(itemLink);
  return { success: "Item submitted to review!" };
};