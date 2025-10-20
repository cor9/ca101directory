import { SUBMISSIONS_PER_PAGE } from "@/lib/constants";

/**
 * get submissions from sanity
 */
export async function getSubmissions({
  userId,
  currentPage,
}: {
  userId?: string;
  currentPage: number;
}) {
  // Sanity CMS removed - function disabled
  console.log("getSubmissions: Sanity CMS removed, returning empty result");
  return { submissions: [], totalCount: 0 };
}
