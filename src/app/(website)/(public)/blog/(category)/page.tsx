import BlogGrid from "@/components/blog/blog-grid";
import Container from "@/components/shared/container";
import { getBlogs } from "@/data/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";

export default async function BlogIndexPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log('BlogIndexPage, searchParams', searchParams);
  const { page } = searchParams as { [key: string]: string };
  const currentPage = page ? Number(page) : 1;
  const { posts, totalCount } = await getBlogs({ currentPage });
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  console.log('BlogIndexPage, totalCount', totalCount, ", totalPages", totalPages);

  return (
    <BlogGrid posts={posts} totalPages={totalPages} paginationPrefix="/blog" />
  );
}
