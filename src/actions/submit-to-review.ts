"use server";

import { Item } from "@/sanity.types";
import { sanityClient } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";

export const submitToReview = async (itemId: string) => {
  console.log('submitToReview, itemId:', itemId);
  const item = await sanityFetch<Item>({ query: itemByIdQuery, params: { id: itemId } });
  if (!item) {
    return { error: "Item not found!" };
  }

  const result = await sanityClient.patch(itemId).set({
    pricePlan: "free",
    freePlanStatus: "reviewing",
    proPlanStatus: "paying",
  }).commit();
  console.log('submitToReview, result:', result);
  if (!result) {
    return { error: "Failed to submit item to review!" };
  }

  return { success: "Item submitted to review!" };
};