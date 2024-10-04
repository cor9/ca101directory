"use server";

import { currentUser } from "@/lib/auth";
import { sendNotifySubmissionEmail } from "@/lib/mail";
import { FreePlanStatus, PricePlan } from "@/lib/submission";
import { getItemLinkInStudio, getItemStatusLinkInWebsite } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";

export const submitToReview = async (itemId: string) => {
  console.log('submitToReview, itemId:', itemId);

  // TODO(javayhu): check if the item exists??? and check item is in submitting status
  // const item = await sanityFetch<Item>({ query: itemByIdQuery, params: { id: itemId } });
  // if (!item) {
  //   return { error: "Item not found!" };
  // }

  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }
    
    const result = await sanityClient.patch(itemId).set({
      pricePlan: PricePlan.FREE,
      freePlanStatus: FreePlanStatus.PENDING,
    }).commit();
    // console.log('submitToReview, result:', result);
    if (!result) {
      return { error: "Failed to submit item to review!" };
    }

    const statusLink = getItemStatusLinkInWebsite(itemId);
    const reviewLink = getItemLinkInStudio(itemId);
    sendNotifySubmissionEmail(user.name, user.email, result.name, statusLink, reviewLink);
    return { success: "Item submitted to review!" };
  } catch (error) {
    console.log("submitToReview, error", error);
    return { error: "Failed to submit item to review!" };
  }
};