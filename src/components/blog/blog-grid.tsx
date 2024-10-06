import BlogCard from "@/components/blog/blog-card";
import { BlogPostListQueryResult } from "@/sanity.types";
import { Skeleton } from "../ui/skeleton";

interface BlogGridProps {
  posts: BlogPostListQueryResult;
}

export default async function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div>
      {
        posts && posts?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              posts.map(post => (
                <BlogCard key={post._id} post={post} />
              ))
            }
          </div>
        )}
    </div>
  );
}

export function BlogGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <Skeleton className="w-full aspect-[16/9] rounded-lg" />
          <Skeleton className="h-12 w-full" />
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
