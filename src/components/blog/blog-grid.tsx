import BlogCard from "@/components/blog/blog-card";
import { BlogPostListQueryResult } from "@/sanity.types";

interface BlogGridProps {
  posts: BlogPostListQueryResult;
}

export default async function BlogGrid({ posts }: BlogGridProps) {
  return (
    <>
      {
        posts && posts?.length > 0 && (
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {
              posts.map(post => (
                <BlogCard key={post._id} post={post} />
              ))
            }
          </div>
        )}
    </>
  );
}
