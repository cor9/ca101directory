import { SUBMISSIONS_PER_PAGE } from "@/lib/constants";
import { SubmissionListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";

/**
 * get submissions from sanity
 */
export async function getSubmissions({
    userId,
    currentPage
}: {
    userId?: string;
    currentPage: number
}) {
    const { countQuery, dataQuery } = buildQuery(userId, currentPage);
    const [totalCount, submissions] = await Promise.all([
        sanityFetch<number>({ query: countQuery }),
        sanityFetch<SubmissionListQueryResult>({ query: dataQuery })
    ]);
    return { submissions, totalCount };
}

/**
 * build count and data query for get submissions from sanity
 */
const buildQuery = (userId: string, currentPage: number = 1) => {
    const userCondition = `&& submitter._ref == "${userId}"`;
    const offsetStart = (currentPage - 1) * SUBMISSIONS_PER_PAGE;
    const offsetEnd = offsetStart + SUBMISSIONS_PER_PAGE;

    // @sanity-typegen-ignore
    const countQuery = `count(*[_type == "item" && defined(slug.current) 
       ${userCondition} ])`;
    // @sanity-typegen-ignore
    const dataQuery = `*[_type == "item" && defined(slug.current) 
       ${userCondition} ] [${offsetStart}...${offsetEnd}] {
        ...,
        submitter->
    }`;
    // console.log('buildQuery, countQuery', countQuery);
    // console.log('buildQuery, dataQuery', dataQuery);
    return { countQuery, dataQuery };
};