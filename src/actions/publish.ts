"use server";

import { Item } from "@/sanity.types";
import { sanityClient } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";

export const publish = async (itemId: string) => {
  console.log('publish, itemId:', itemId);
  
  // const item = await sanityFetch<Item>({ query: itemByIdQuery, params: { id: itemId } });
  // if (!item) {
  //   return { error: "Item not found!" };
  // }

  const result = await sanityClient.patch(itemId).set({
    published: true,
    publishDate: new Date().toISOString(),
  }).commit();
  console.log('publish, result:', result);
  if (!result) {
    return { error: "Failed to publish item!" };
  }

  return { success: "Item published!" };
};