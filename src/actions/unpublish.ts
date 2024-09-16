"use server";

import { Item } from "@/sanity.types";
import { sanityClient } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";

export const unpublish = async (itemId: string) => {
  console.log('unpublish, itemId:', itemId);
  
  // const item = await sanityFetch<Item>({ query: itemByIdQuery, params: { id: itemId } });
  // if (!item) {
  //   return { error: "Item not found!" };
  // }

  const result = await sanityClient.patch(itemId).set({
    published: false,
    publishDate: null,
  }).commit();
  console.log('unpublish, result:', result);
  if (!result) {
    return { error: "Failed to unpublish item!" };
  }

  return { success: "Item unpublished!" };
};