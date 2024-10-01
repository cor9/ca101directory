import BlogGrid from "@/components/blog/blog-grid";
import EmptyGrid from "@/components/empty-grid";
import CustomPagination from "@/components/pagination";
import { getBlogs } from "@/data/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { Suspense } from "react";

export default async function BlogCategoryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // console.log('BlogCategoryPage, searchParams', searchParams);
  const { page } = searchParams as { [key: string]: string };
  const currentPage = page ? Number(page) : 1;
  const { posts, totalCount } = await getBlogs({ category: params.slug, currentPage });
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  console.log('BlogCategoryPage, totalCount', totalCount, ", totalPages", totalPages);

  return (
    <section>
      {/* when no posts are found */}
      {posts?.length === 0 && (
        <EmptyGrid />
      )}

      {/* when posts are found */}
      {posts && posts?.length > 0 && (
        <section>
          <BlogGrid posts={posts} />

          <div className="mt-8 flex items-center justify-center">
            <Suspense fallback={null}>
              <CustomPagination routePreix={`/blog/${params.slug}`} totalPages={totalPages} />
            </Suspense>
          </div>
        </section>
      )}
    </section>
  );
}
