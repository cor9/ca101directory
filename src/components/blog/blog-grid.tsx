import BlogCard from "@/components/blog/blog-card";
import { BlogListQueryResult } from "@/sanity.types";
import { Suspense } from "react";
import CustomPagination from "../pagination";

interface BlogGridProps {
  posts: BlogListQueryResult;
  totalPages: number;
}

export default async function BlogGrid({ posts, totalPages }: BlogGridProps) {
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
          <div className="mt-12 gap-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {posts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center">
            <Suspense fallback={null}>
              <CustomPagination routePreix="/blog" totalPages={totalPages} />
            </Suspense>
          </div>
        </>
      )}
    </>
  );
}
