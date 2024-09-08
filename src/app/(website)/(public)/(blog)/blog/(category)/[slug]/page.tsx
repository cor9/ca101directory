import BlogGrid from "@/components/blog/blog-grid";
import Container from "@/components/shared/container";
import { getBlogs } from "@/data/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";

export default async function BlogCategoryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log('BlogCategoryPage, searchParams', searchParams);
  const { page } = searchParams as { [key: string]: string };
  const currentPage = page ? Number(page) : 1;
  const { posts, totalCount } = await getBlogs({ category: params.slug, currentPage });
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  console.log('BlogCategoryPage, totalCount', totalCount, ", totalPages", totalPages);

  return (
    <Container className="pb-16">
      <BlogGrid posts={posts} totalPages={totalPages} paginationPrefix={`/blog/${params.slug}`} />
    </Container>
  );
}
