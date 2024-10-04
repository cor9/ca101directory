"use server";

import { getItemById } from "@/data/item";
import { sanityClient } from "@/sanity/lib/client";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
}

export async function unpublish(itemId: string): Promise<ServerActionResponse> {
  console.log('unpublish, itemId:', itemId);

  const item = await getItemById(itemId);
  if (!item) {
    return { status: "error", message: "Item not found!" };
  }

  const result = await sanityClient.patch(itemId).set({
    publishDate: null,
  }).commit();
  // console.log('unpublish, result:', result);

  if (!result) {
    return { status: "error", message: "Failed to unpublish item!" };
  }

  return { status: "success", message: "Item unpublished!" };
};