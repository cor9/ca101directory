import { POSTS_PER_PAGE } from "@/lib/constants";
import { BlogPostListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";

/**
 * get blogs from sanity
 */
export async function getBlogs({
    category,
    currentPage
}: {
    category?: string;
    currentPage: number
}) {
    const { countQuery, dataQuery } = buildQuery(category, currentPage);
    const [totalCount, posts] = await Promise.all([
        sanityFetch<number>({ query: countQuery }),
        sanityFetch<BlogPostListQueryResult>({ query: dataQuery })
    ]);
    return { posts, totalCount };
}

/**
 * build count and data query for get blogs from sanity
 */
const buildQuery = (category?: string, currentPage: number = 1) => {
    const categoryCondition = category ? `&& "${category}" in categories[]->slug.current` : '';
    const offsetStart = (currentPage - 1) * POSTS_PER_PAGE;
    const offsetEnd = offsetStart + POSTS_PER_PAGE;

    // @sanity-typegen-ignore
    const countQuery = `count(*[_type == "blogPost" && defined(slug.current) && defined(publishDate) 
       ${categoryCondition} ])`;
    // @sanity-typegen-ignore
    const dataQuery = `*[_type == "blogPost" && defined(slug.current) && defined(publishDate) 
       ${categoryCondition} ] | order(publishDate desc) [${offsetStart}...${offsetEnd}] {
        _id,
        _createdAt,
        title,
        slug,
        excerpt,
        featured,
        image,
        publishDate,
        author->,
        categories[]->,
    }`;
    // console.log('buildQuery, countQuery', countQuery);
    // console.log('buildQuery, dataQuery', dataQuery);
    return { countQuery, dataQuery };
};