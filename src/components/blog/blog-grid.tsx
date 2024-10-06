import BlogCard, { BlogCardSkeleton } from "@/components/blog/blog-card";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { BlogPostListQueryResult } from "@/sanity.types";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogGridProps {
  posts: BlogPostListQueryResult;
}

export default async function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div>
      {posts && posts?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export function BlogGridSkeleton({ count = POSTS_PER_PAGE }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}
