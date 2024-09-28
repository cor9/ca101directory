import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import Container from "@/components/shared/container";

export default async function BlogListLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* blog category filter */}
      <div className="mt-8">
        <BlogCategoryFilter />
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </>
  );
}
