import { BlogHeaderLayout } from "@/components/content/blog-header-layout";
import { BlogPosts } from "@/components/content/blog-posts";
import MaxWidthContainer from "@/components/shared/max-width-container";
import { getBlurDataURL } from "@/lib/utils";
import { allPosts } from "contentlayer/generated";

export default async function BlogListPage() {
  const posts = await Promise.all(
    allPosts
      .filter((post) => post.published)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      })),
  );

  return (
    <>
      <BlogHeaderLayout />

      <MaxWidthContainer>
        <BlogPosts posts={posts} />
      </MaxWidthContainer>
    </>
  );
}
