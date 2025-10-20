import { COLLECTIONS_PER_PAGE } from "@/lib/constants";

/**
 * get collections from sanity
 */
export async function getCollections({
  currentPage,
}: {
  currentPage: number;
}) {
  // Sanity CMS removed - function disabled
  console.log("getCollections: Sanity CMS removed, returning empty result");
  return { collections: [], totalCount: 0 };
}
