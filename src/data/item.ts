import { ITEMS_PER_PAGE, SHOW_QUERY_LOGS } from "@/lib/constants";
import type { ItemInfo } from "@/types";

/**
 * get item by id
 */
export async function getItemById(id: string) {
  // Sanity CMS removed - function disabled
  console.log("getItemById: Sanity CMS removed, returning null");
  return null;
}

/**
 * get item info by id, with submitter info & images, etc.
 */
export async function getItemInfoById(id: string) {
  // Sanity CMS removed - function disabled
  console.log("getItemInfoById: Sanity CMS removed, returning null");
  return null;
}

/**
 * get items from sanity
 */
export async function getItems({
  collection,
  category,
  tag,
  sortKey,
  reverse,
  query,
  filter,
  currentPage,
  hasSponsorItem,
}: {
  collection?: string;
  category?: string;
  tag?: string;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
  filter?: string;
  currentPage: number;
  hasSponsorItem?: boolean;
}) {
  // Sanity CMS removed - function disabled
  console.log("getItems: Sanity CMS removed, returning empty result");
  return { items: [], totalCount: 0 };
}
