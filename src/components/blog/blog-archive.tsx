import PostList from "@/components/blog/post-list";
import { sanityClient } from "@/sanity/lib/client";
import { paginatedquery } from "@/sanity/lib/queries";
import BlogPagination from "@/components/blog/blog-pagination";
import { POSTS_PER_PAGE } from "@/lib/constants";

export default async function BlogArchive({ searchParams }) {
  // Fetch the current page from the query parameters, defaulting to 1 if it doesn't exist
  const page = searchParams.page;
  const pageIndex = parseInt(page, 10) || 1;

  // Define the parameters for fetching posts based on the current page
  const params = {
    pageIndex: (pageIndex - 1) * POSTS_PER_PAGE,
    limit: pageIndex * POSTS_PER_PAGE
  };

  console.log("BlogArchive, params", params);
  console.log("BlogArchive, paginatedquery", paginatedquery);

  const posts = await sanityClient.fetch(
    paginatedquery,
    params,
    {
      useCdn: false,
      next: {
        revalidate: 0,
      }
    }
  )
  console.log("BlogArchive, posts size", posts ? posts.length : 0);
  // console.log("BlogArchive, posts", posts);

  // Check if the current page is the first or the last
  const isFirstPage = pageIndex < 2;
  const isLastPage = posts.length < POSTS_PER_PAGE;

  return (
    <>
      {/* when no posts are found */}
      {posts && posts?.length === 0 && (
        <div className="my-8 h-32 w-full flex items-center justify-center">
          <p className='font-medium text-muted-foreground'>
            No posts found.
          </p>
        </div>
      )}

      {/* when posts are found */}
      {posts && posts?.length > 0 && (
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
          {posts.map(post => (
            <PostList
              key={post._id}
              post={post}
            />
          ))}
        </div>
      )}

      {/* blog pagination */}
      {posts && posts?.length > 0 && (
        <div className="mt-12 flex items-center justify-center">
          <BlogPagination
            pageIndex={pageIndex}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
          />
        </div>
      )}
    </>
  );
}
