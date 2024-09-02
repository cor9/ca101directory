import BlogGrid from "@/components/blog/blog-grid";
import Container from "@/components/shared/container";
import { HeaderSection } from "@/components/shared/header-section";
import { getBlogs } from "@/data/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";

export default async function BlogListPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log('BlogListPage, searchParams', searchParams);
  const { category, page } = searchParams as { [key: string]: string };
  const currentPage = page ? Number(page) : 1;
  const { posts, totalCount } = await getBlogs({ category, currentPage });
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  console.log('BlogListPage, totalCount', totalCount, ", totalPages", totalPages);

  const subtitle = category ?
    `All posts in category ${category.toUpperCase()}`
    : "See all posts we have ever written";

  return (
    <>
      <Container className="pb-16">
        {/* blog header section */}
        <HeaderSection className="mt-8"
          title="Blog"
          subtitle={subtitle} />

        {/* blog grid */}
        <BlogGrid posts={posts} totalPages={totalPages} />
      </Container>
    </>
  );
}
