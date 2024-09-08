import BlogGrid from "@/components/blog/blog-grid";
import CustomSwitch from "@/components/custom-switch";
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

        {/* <CustomSwitch options={['all', 'featured', 'recent']} /> */}

        <CustomSwitch
          value={field.value}
          onChange={(value) =>
            form.setValue('orderType', String(value))
          }
          options={orderTypes}
          data-testid="orderType"
          className="flex rounded-full bg-muted p-2"
          highlighterClassName="bg-primary rounded-full"
          aria-label="Order type"
          radioClassName={cn(
            'relative mx-2 flex h-9 cursor-pointer items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors focus:outline-none data-[checked]:text-primary-foreground'
          )}
          highlighterIncludeMargin={true}
        />

        {/* blog grid */}
        <BlogGrid posts={posts} totalPages={totalPages} />
      </Container>
    </>
  );
}
