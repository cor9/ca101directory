"use server";

import { getItemById } from "@/data/item";
import { sanityClient } from "@/sanity/lib/client";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
}

export async function publish(itemId: string): Promise<ServerActionResponse> {
  console.log('publish, itemId:', itemId);
  
  const item = await getItemById(itemId);
  if (!item) {
    return { status: "error", message: "Item not found!" };
  }

  const result = await sanityClient.patch(itemId).set({
    publishDate: new Date().toISOString(),
  }).commit();
  // console.log('publish, result:', result);
  
  if (!result) {
    return { status: "error", message: "Failed to publish item!" };
  }

  return { status: "success", message: "Item published!" };
};