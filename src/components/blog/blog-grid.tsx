import BlogCard from "@/components/blog/blog-card";
import { BlogListQueryResult } from "@/sanity.types";
import { Suspense } from "react";
import CustomPagination from "@/components/pagination";

interface BlogGridProps {
  posts: BlogListQueryResult;
  totalPages: number;
  paginationPrefix: string;
}

export default async function BlogGrid({ posts, totalPages, paginationPrefix }: BlogGridProps) {
  return (
    <>
      {/* when no posts are found */}
      {posts?.length === 0 && (
        <div className="my-8 h-32 w-full flex items-center justify-center">
          <p className='font-medium text-muted-foreground'>
            No posts found.
          </p>
        </div>
      )}

      {/* when posts are found */}
      {posts && posts?.length > 0 && (
        <>
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-center">
            <Suspense fallback={null}>
              <CustomPagination routePreix={paginationPrefix} totalPages={totalPages} />
            </Suspense>
          </div>
        </>
      )}
    </>
  );
}
